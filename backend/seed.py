from database import engine, SessionLocal, Base
import models
import uuid

def reset_db():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)

def seed_data():
    reset_db()
    
    db = SessionLocal()
    print("Seeding database...")
    
    # 1. Seed Users
    u1 = models.User(id="u1", email="retailer@example.com", password="password", name="Jane Doe", role="retailer")
    u2 = models.User(id="u2", email="distributor@example.com", password="password", name="John Smith", role="distributor")
    u3 = models.User(id="u3", email="subdistributor@example.com", password="password", name="Alice Jones", role="subdistributor")
    
    db.add_all([u1, u2, u3])
    db.commit()

    # 2. Seed Retailers
    r1 = models.RetailerNetwork(id="r1", name="Retailer A (Downtown)", location="Downtown")
    r2 = models.RetailerNetwork(id="r2", name="Retailer B (Heights)", location="Heights")
    r3 = models.RetailerNetwork(id="r3", name="Retailer C (Suburb)", location="Suburb")
    
    db.add_all([r1, r2, r3])
    db.commit()
    
    # 3. Seed Inventory
    i1 = models.InventoryItem(id="i1", name="India Gate Basmati Rice (5kg)", sku="SKU-RICE-1", category="Grains", unit_price=200.0, current_stock=500, reorder_level=100)
    i2 = models.InventoryItem(id="i2", name="Amul Butter (500g)", sku="SKU-BTR-1", category="Dairy", unit_price=25.0, current_stock=200, reorder_level=50)
    i3 = models.InventoryItem(id="i3", name="Tata Tea Gold (500g)", sku="SKU-TEA-1", category="Beverages", unit_price=35.0, current_stock=300, reorder_level=100)
    i4 = models.InventoryItem(id="i4", name="Toor Dal (1kg)", sku="SKU-DAL-1", category="Grains", unit_price=40.0, current_stock=150, reorder_level=80)
    i5 = models.InventoryItem(id="i5", name="Aashirvaad Atta (10kg)", sku="SKU-ATTA-1", category="Grains", unit_price=85.0, current_stock=400, reorder_level=120)
    
    db.add_all([i1, i2, i3, i4, i5])
    db.commit()

    # 4. Seed Orders (for the retailer)
    o1 = models.Order(id="ord_1", retailer_id="u1", total_amount=225.0, status="pending", ai_reasoning="AI suggests increasing order due to upcoming holiday.")
    o1_item1 = models.OrderItem(id="oi_1", order_id="ord_1", product_id="i1", quantity=1, unit_price=200.0, total_price=200.0)
    o1_item2 = models.OrderItem(id="oi_2", order_id="ord_1", product_id="i2", quantity=1, unit_price=25.0, total_price=25.0)

    db.add_all([o1, o1_item1, o1_item2])
    db.commit()
    
    # 5. Seed Store Requests (for the distributor fulfillment board)
    req1 = models.StoreRequest(id="req_1", retailer_id="r1", item_id="i1", quantity=50, profit_per_unit=20.0, status="pending", eta="Today")
    req2 = models.StoreRequest(id="req_2", retailer_id="r1", item_id="i2", quantity=20, profit_per_unit=5.0, status="pending", eta="Today")
    req3 = models.StoreRequest(id="req_3", retailer_id="r2", item_id="i3", quantity=15, profit_per_unit=8.0, status="pending", eta="Tomorrow")
    req4 = models.StoreRequest(id="req_4", retailer_id="r2", item_id="i4", quantity=40, profit_per_unit=10.0, status="pending", eta="Tomorrow")
    req5 = models.StoreRequest(id="req_5", retailer_id="r3", item_id="i5", quantity=100, profit_per_unit=15.0, status="processing", eta="In 3 Days")
    
    db.add_all([req1, req2, req3, req4, req5])
    db.commit()
    db.close()
    
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed_data()
