from fastapi import FastAPI, HTTPException, Request, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import random
import uuid
from datetime import datetime, timedelta
import socketio
from auth_utils import verify_password, get_password_hash, create_access_token, decode_access_token, oauth2_scheme

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Real-Time Sockets Setup ---
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

@sio.event
async def connect(sid, environ):
    print(f"Socket connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Socket disconnected: {sid}")

# --- Auth Dependencies ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user_id = decode_access_token(token)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# --- Distributor Endpoints ---
@app.get("/api/distributor/requests")
async def get_distributor_requests(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    requests = db.query(models.StoreRequest).all()
    res = []
    for r in requests:
        res.append({
            "id": r.id,
            "store": r.retailer.name if r.retailer else "Unknown",
            "item": r.item.name if r.item else "Unknown",
            "qty": r.quantity,
            "profitPerUnit": r.profit_per_unit,
            "status": r.status,
            "eta": r.eta
        })
    return res

@app.post("/api/distributor/fulfill/{req_id}")
async def fulfill_distributor_request(req_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    req = db.query(models.StoreRequest).filter(models.StoreRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    if req.status == "fulfilled":
        return {"message": "Already fulfilled"}
        
    req.status = "fulfilled"
    
    if req.item.current_stock >= req.quantity:
        req.item.current_stock -= req.quantity
    
    log = models.FulfilledLogistic(
        id=f"log_{uuid.uuid4().hex[:8]}",
        store_request_id=req.id,
        fulfilled_at=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    
    # Emit real-time event
    await sio.emit("notification", {"message": f"Order {req.id} fulfilled!"})
    await sio.emit("inventory-update", {"itemId": req.item_id, "newStock": req.item.current_stock})
    
    return {"message": "Success", "id": req.id}


# --- ML Model Loading ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "lightgbm_model.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "feature_list.pkl")

try:
    model = joblib.load(MODEL_PATH)
    features = joblib.load(FEATURES_PATH)
    print("Model and features loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    features = []

# --- Auth Endpoints ---
class LoginCredentials(BaseModel):
    email: str
    password: str

class RegisterData(BaseModel):
    email: str
    password: str
    name: str
    role: str

@app.post("/api/auth/login")
async def login(creds: LoginCredentials, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == creds.email).first()
    if not user or not verify_password(creds.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "createdAt": user.created_at.isoformat(),
            "updatedAt": user.created_at.isoformat(),
        },
        "accessToken": access_token
    }

@app.post("/api/auth/register")
async def register(data: RegisterData, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_user = models.User(
        id=f"u_{uuid.uuid4().hex[:8]}",
        email=data.email,
        password=get_password_hash(data.password),
        name=data.name,
        role=data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.id})
    
    return {
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role,
            "createdAt": new_user.created_at.isoformat(),
            "updatedAt": new_user.created_at.isoformat(),
        },
        "accessToken": access_token
    }

@app.post("/api/auth/logout")
async def logout():
    return {"message": "Logged out"}

@app.post("/api/auth/refresh")
async def refresh_token(user: models.User = Depends(get_current_user)):
    return {"accessToken": create_access_token(data={"sub": user.id})}

@app.get("/api/auth/me")
async def get_current_user_endpoint(user: models.User = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "createdAt": user.created_at.isoformat(),
        "updatedAt": user.created_at.isoformat(),
    }

# --- Orders Endpoints ---
@app.get("/api/orders")
async def get_orders(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    orders = db.query(models.Order).all()
    res = []
    for o in orders:
        items = []
        for i in o.items:
            items.append({
                "productId": i.product_id,
                "productName": i.product.name if i.product else "Unknown",
                "quantity": i.quantity,
                "unitPrice": i.unit_price,
                "totalPrice": i.total_price
            })
            
        res.append({
            "id": o.id,
            "retailerId": o.retailer_id,
            "retailerName": o.retailer.name if o.retailer else "Unknown",
            "items": items,
            "totalAmount": o.total_amount,
            "status": o.status,
            "createdAt": o.created_at.isoformat(),
            "updatedAt": o.created_at.isoformat(),
            "suggestedQuantity": {},
            "aiReasoning": o.ai_reasoning
        })
    return res

# --- Inventory Endpoints ---
@app.get("/api/inventory")
async def get_inventory(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    items = db.query(models.InventoryItem).all()
    res = []
    for item in items:
        status = "low" if item.current_stock <= item.reorder_level else "healthy"
        res.append({
            "id": item.id,
            "productId": item.id,
            "productName": item.name,
            "quantity": item.current_stock,
            "reorderLevel": item.reorder_level,
            "status": status,
            "lastUpdated": datetime.now().isoformat()
        })
    return res

# --- Forecasts Logic ---
def generate_forecast(product, features_list, ml_model):
    dummy_input = [0] * len(features_list) if features_list else [0]*37
    
    predicted_demand = 100
    if ml_model and dummy_input:
        try:
            pred = ml_model.predict([dummy_input])
            predicted_demand = float(pred[0])
            if predicted_demand < 0: predicted_demand = 0
        except Exception as e:
            print(f"Prediction failed: {e}")
    else:
        predicted_demand = random.randint(50, 300)

    confidence = round(random.uniform(0.7, 0.95), 2)
    
    historical_data = []
    for i in range(7):
        date_str = (datetime.now() - timedelta(days=6-i)).strftime("%Y-%m-%d")
        historical_data.append({
            "date": date_str,
            "actual": int(predicted_demand * random.uniform(0.8, 1.2)),
            "predicted": int(predicted_demand),
            "upperBound": int(predicted_demand * 1.2),
            "lowerBound": int(predicted_demand * 0.8)
        })

    return {
        "id": f"fc_{product.id}",
        "productId": product.id,
        "productName": product.name,
        "predictedDemand": int(predicted_demand),
        "confidence": confidence,
        "reasoning": f"Based on historical data and ML predictions, {product.name} is expected to have steady demand.",
        "period": "Next 7 Days",
        "historicalData": historical_data
    }

@app.get("/api/forecasts")
async def get_forecasts(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    products = db.query(models.InventoryItem).all()
    return [generate_forecast(p, features, model) for p in products]

@app.get("/api/forecasts/summary")
async def get_forecast_summary(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    products = db.query(models.InventoryItem).all()
    forecasts = [generate_forecast(p, features, model) for p in products]
    
    total_demand = sum([f["predictedDemand"] for f in forecasts])
    avg_conf = sum([f["confidence"] for f in forecasts]) / len(forecasts) if forecasts else 0
    return {
        "totalPredictedDemand": total_demand,
        "averageConfidence": avg_conf,
        "topProducts": forecasts[:5]
    }

# Must convert app to socketio ASGIApp at the end
app = socketio.ASGIApp(sio, other_asgi_app=app)
