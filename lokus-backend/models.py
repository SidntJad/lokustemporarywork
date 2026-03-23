from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime, timezone

# models.py
from sqlalchemy import Column, Integer, String, Float, LargeBinary

class Inventory(Base):
    __tablename__ = "inventory_registry"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String)
    model_name = Column(String)
    colorway = Column(String)
    price_inr = Column(Float)
    total_stock = Column(Integer)
    
    # Store raw bytes instead of text strings
    image_front = Column(LargeBinary) 
    image_side = Column(LargeBinary)
    image_rear = Column(LargeBinary)

class ProductState(str, enum.Enum):
    UPCOMING = "UPCOMING"
    LIVE = "LIVE"
    SOLD_OUT = "SOLD_OUT"

class ReservationState(str, enum.Enum):
    RESERVED = "RESERVED"
    PURCHASED = "PURCHASED"
    EXPIRED = "EXPIRED"

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True)
    model_name = Column(String)
    colorway = Column(String)
    price_inr = Column(Integer)
    image_url = Column(String)
    total_stock = Column(Integer, default=0)
    available_stock = Column(Integer, default=0)
    status = Column(SQLEnum(ProductState), default=ProductState.UPCOMING)

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) 
    shoe_id = Column(Integer, ForeignKey("products.id"))
    status = Column(SQLEnum(ReservationState), default=ReservationState.RESERVED)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime)

# NEW: The Orders Table (Transaction Finalization)
class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    shoe_id = Column(Integer, ForeignKey("products.id"))
    reservation_id = Column(Integer, ForeignKey("reservations.id"))
    size = Column(String)
    status = Column(String, default="ORDER-RECEIVED")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # This allows us to easily fetch shoe details for the Vault page
    shoe = relationship("Product")