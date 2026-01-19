from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from models.cart import Cart
from utils.user_guard import user_required

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.post("/add")
def add_to_cart(
    product_id: int,
    quantity: int = 1,
    user_id: int = Depends(user_required),
    db: Session = Depends(get_db)
):
    item = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.product_id == product_id
    ).first()

    if item:
        item.quantity += quantity
    else:
        db.add(Cart(
            user_id=user_id,
            product_id=product_id,
            quantity=quantity
        ))

    db.commit()
    return {"message": "Added"}


@router.get("")
def get_cart(
    user_id: int = Depends(user_required),
    db: Session = Depends(get_db)
):
    return db.query(Cart)\
        .filter(Cart.user_id == user_id)\
        .all()


@router.delete("/remove/{product_id}")
def remove_from_cart(
    product_id: int,
    user_id: int = Depends(user_required),
    db: Session = Depends(get_db)
):
    db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.product_id == product_id
    ).delete()

    db.commit()
    return {"message": "Removed"}
