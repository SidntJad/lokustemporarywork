import asyncio
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import models
from database import engine, get_db, SessionLocal
from pydantic import BaseModel

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lokus State Engine")

# Allow Next.js to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# BACKGROUND WORKER (Cart Integrity Engine)
# ==========================================
async def sweep_expired_carts():
    """Runs constantly to push expired carts back to the pool."""
    while True:
        await asyncio.sleep(10)  # Check every 10 seconds
        db = SessionLocal()
        try:
            now = datetime.now(timezone.utc)
            expired_reservations = db.query(models.Reservation).filter(
                models.Reservation.status == models.ReservationState.RESERVED,
                models.Reservation.expires_at <= now
            ).all()
            
            for res in expired_reservations:
                res.status = models.ReservationState.EXPIRED
                shoe = db.query(models.Product).filter(models.Product.id == res.shoe_id).first()
                if shoe:
                    shoe.available_stock += 1
                    if shoe.status == models.ProductState.SOLD_OUT:
                        shoe.status = models.ProductState.LIVE
                        print(f"RESTOCK ALERT: {shoe.model_name} is back in the pool!")
            
            if expired_reservations:
                db.commit()
                print(f"Swept {len(expired_reservations)} expired carts.")
        except Exception as e:
            db.rollback()
        finally:
            db.close()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(sweep_expired_carts())


# ==========================================
# 1. SEED DATA
# ==========================================
@app.post("/api/v1/seed")
def seed_database(db: Session = Depends(get_db)):
    if db.query(models.Product).count() == 0:
        shoe1 = models.Product(
            brand="Nike", model_name="Travis Scott Jordan 1", colorway="Mocha", price_inr=85000, 
            image_url="https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80", 
            total_stock=5, available_stock=5, status=models.ProductState.LIVE
        )
        shoe2 = models.Product(
            brand="Yeezy", model_name="Boost 350 V2", colorway="Zebra", price_inr=22000, 
            image_url="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", 
            total_stock=10, available_stock=10, status=models.ProductState.LIVE
        )
        db.add_all([shoe1, shoe2])
        db.commit()
        return {"message": "Database seeded!"}
    return {"message": "Database already contains data."}

# ==========================================
# 2. FETCH LIVE DROPS
# ==========================================
@app.get("/api/v1/drops")
def get_live_drops(db: Session = Depends(get_db)):
    live_shoes = db.query(models.Product).filter(models.Product.status == models.ProductState.LIVE).all()
    return {"live_drops": live_shoes}

# ==========================================
# 3. TRANSACTION ORCHESTRATOR
# ==========================================
@app.post("/api/v1/reserve")
def reserve_shoe(user_id: int, shoe_id: int, db: Session = Depends(get_db)):
    try:
        # THE LOCK
        shoe = db.query(models.Product).filter(models.Product.id == shoe_id).with_for_update().first()
        if not shoe: raise HTTPException(status_code=404, detail="Shoe not found.")
        if shoe.status != models.ProductState.LIVE: raise HTTPException(status_code=400, detail="Shoe not live.")
        if shoe.available_stock <= 0: raise HTTPException(status_code=409, detail="Out of Stock")

        shoe.available_stock -= 1
        if shoe.available_stock == 0: shoe.status = models.ProductState.SOLD_OUT
            
        expiration_time = datetime.now(timezone.utc) + timedelta(minutes=1)
        new_reservation = models.Reservation(user_id=user_id, shoe_id=shoe_id, status=models.ReservationState.RESERVED, expires_at=expiration_time)
        
        db.add(new_reservation)
        db.commit()
        db.refresh(new_reservation)
        
        return {"message": "Secured!", "reservation_id": new_reservation.id, "expires_at": new_reservation.expires_at}
    except Exception as e:
        db.rollback() 
        raise e

# ==========================================
# 4. ADMIN DASHBOARD ROUTES
# ==========================================
@app.get("/api/v1/admin/stats")
def get_system_stats(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    return {
        "total_shoes_tracked": db.query(models.Product).count(),
        "active_locks": db.query(models.Reservation).filter(models.Reservation.status == models.ReservationState.RESERVED).count(),
        "expired_violators": db.query(models.Reservation).filter(models.Reservation.status == models.ReservationState.RESERVED, models.Reservation.expires_at <= now).count(),
        "sold_out_count": db.query(models.Product).filter(models.Product.status == models.ProductState.SOLD_OUT).count()
    }

@app.post("/api/v1/admin/force-sweep")
def force_sweep_carts(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    swept_count = 0
    restocked_shoes = []
    
    try:
        expired = db.query(models.Reservation).filter(models.Reservation.status == models.ReservationState.RESERVED, models.Reservation.expires_at <= now).all()
        for res in expired:
            res.status = models.ReservationState.EXPIRED
            swept_count += 1
            shoe = db.query(models.Product).filter(models.Product.id == res.shoe_id).first()
            if shoe:
                shoe.available_stock += 1
                if shoe.status == models.ProductState.SOLD_OUT: shoe.status = models.ProductState.LIVE
                if shoe.model_name not in restocked_shoes: restocked_shoes.append(shoe.model_name)
                    
        db.commit()
        return {"message": "Sweep Complete", "swept_count": swept_count, "restocked": restocked_shoes}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Sweep Failed")
    

from pydantic import BaseModel

class CheckoutRequest(BaseModel):
    size: str


# Create a strict schema for incoming product data
class ProductCreate(BaseModel):
    brand: str
    model_name: str
    colorway: str
    price_inr: int
    image_url: str
    total_stock: int

@app.post("/api/v1/admin/products")
def add_new_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Allows admins to inject new inventory directly into the LIVE state."""
    try:
        new_product = models.Product(
            brand=product.brand,
            model_name=product.model_name,
            colorway=product.colorway,
            price_inr=product.price_inr,
            image_url=product.image_url,
            total_stock=product.total_stock,
            available_stock=product.total_stock, # Initial available matches total
            status=models.ProductState.LIVE      # Make it instantly shoppable
        )
        
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        
        return {
            "message": "Product injected successfully!", 
            "product_id": new_product.id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to inject product into registry.")

# ==========================================
# 5. CHECKOUT & VAULT ORCHESTRATION
# ==========================================
@app.get("/api/v1/reservations/{res_id}")
def get_reservation_details(res_id: int, db: Session = Depends(get_db)):
    """Fetches the locked shoe details for the checkout page."""
    res = db.query(models.Reservation).filter(models.Reservation.id == res_id).first()
    if not res: 
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    shoe = db.query(models.Product).filter(models.Product.id == res.shoe_id).first()
    return {"reservation": res, "shoe": shoe}

@app.post("/api/v1/checkout/{res_id}")
def complete_checkout(res_id: int, req: CheckoutRequest, db: Session = Depends(get_db)):
    """The final step: converts a RESERVED cart into a PURCHASED order."""
    try:
        # Lock the reservation
        res = db.query(models.Reservation).filter(models.Reservation.id == res_id).with_for_update().first()
        
        if not res or res.status != models.ReservationState.RESERVED:
            raise HTTPException(status_code=400, detail="Cart is no longer valid or has expired.")
            
        # THE FIX: Force SQLite datetime to be timezone aware before comparing
        expire_time = res.expires_at.replace(tzinfo=timezone.utc) if res.expires_at.tzinfo is None else res.expires_at
            
        if expire_time <= datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Time limit exceeded. Cart expired.")

        # 1. State Transition
        res.status = models.ReservationState.PURCHASED

        # 2. Create Final Order
        new_order = models.Order(
            user_id=res.user_id,
            shoe_id=res.shoe_id,
            reservation_id=res.id,
            size=req.size,
            status="AUTHENTICATING-SOON"
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order) # Refresh to get the new order ID!
        
        return {"message": "Transaction Complete!", "order_id": new_order.id}
    except HTTPException as he:
        db.rollback()
        raise he
    except Exception as e:
        db.rollback()
        # Print the actual error if it fails again so we can debug it
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/users/{user_id}/orders")
def get_user_vault(user_id: int, db: Session = Depends(get_db)):
    """Feeds data to your Lokus /vault page."""
    orders = db.query(models.Order).filter(models.Order.user_id == user_id).all()
    
    order_history = []
    for o in orders:
        order_history.append({
            "order_id": o.id,
            "status": o.status,
            "size": o.size,
            "shoe": {
                "brand": o.shoe.brand,
                "model_name": o.shoe.model_name,
                "image_url": o.shoe.image_url,
                "price_inr": o.shoe.price_inr
            }
        })
    return {"order_history": order_history}

# main.py
from fastapi import UploadFile, File, Form

@app.post("/api/v1/inventory")
async def inject_to_inventory(
    brand: str = Form(...),
    model_name: str = Form(...),
    colorway: str = Form(...),
    price_inr: float = Form(...),
    total_stock: int = Form(...),
    frontImage: UploadFile = File(...),
    sideImage: UploadFile = File(...),
    backImage: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Read the raw bytes from the uploaded files
    new_entry = models.Inventory(
        brand=brand,
        model_name=model_name,
        colorway=colorway,
        price_inr=price_inr,
        total_stock=total_stock,
        image_front=await frontImage.read(),
        image_side=await sideImage.read(),
        image_rear=await backImage.read()
    )
    db.add(new_entry)
    db.commit()
    return {"status": "success"}