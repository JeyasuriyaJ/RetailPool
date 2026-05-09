from sqlalchemy import Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String) # Storing plain text or simple hash for MVP
    name = Column(String)
    role = Column(String) # 'retailer', 'distributor', 'subdistributor', 'both'
    created_at = Column(DateTime, default=datetime.utcnow)

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    sku = Column(String, index=True, default="N/A")
    category = Column(String, default="General")
    unit_price = Column(Float)
    current_stock = Column(Integer)
    reorder_level = Column(Integer)

class RetailerNetwork(Base):
    __tablename__ = "retailers"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    # Could link to User id if needed

class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, index=True)
    retailer_id = Column(String, ForeignKey("users.id"))
    total_amount = Column(Float)
    status = Column(String, default="pending") # pending, processing, shipped, delivered
    created_at = Column(DateTime, default=datetime.utcnow)
    ai_reasoning = Column(String, nullable=True)
    
    retailer = relationship("User")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(String, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"))
    product_id = Column(String, ForeignKey("inventory_items.id"))
    quantity = Column(Integer)
    unit_price = Column(Float)
    total_price = Column(Float)
    
    order = relationship("Order", back_populates="items")
    product = relationship("InventoryItem")

class StoreRequest(Base):
    __tablename__ = "store_requests"
    id = Column(String, primary_key=True, index=True)
    retailer_id = Column(String, ForeignKey("retailers.id"))
    item_id = Column(String, ForeignKey("inventory_items.id"))
    quantity = Column(Integer)
    profit_per_unit = Column(Float)
    status = Column(String, default="pending")  # pending, processing, fulfilled
    eta = Column(String)
    
    retailer = relationship("RetailerNetwork")
    item = relationship("InventoryItem")

class FulfilledLogistic(Base):
    __tablename__ = "fulfilled_logistics"
    id = Column(String, primary_key=True, index=True)
    store_request_id = Column(String, ForeignKey("store_requests.id"))
    fulfilled_at = Column(DateTime, default=datetime.utcnow)
    
    store_request = relationship("StoreRequest")
