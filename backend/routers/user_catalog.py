from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from models.catalog import MainCategory, SubCategory, Product, ProductImage

router = APIRouter(prefix="/catalog", tags=["User Catalog"])

# ---------- MAIN CATEGORIES ----------
@router.get("/categories")
def user_categories(db: Session = Depends(get_db)):
    return db.query(MainCategory)\
        .filter(MainCategory.is_active.in_([1]))\
        .all()


# ---------- SUB CATEGORIES ----------
@router.get("/categories/{main_id}/sub")
def user_sub_categories(main_id: int, db: Session = Depends(get_db)):
    return db.query(SubCategory)\
        .join(MainCategory)\
        .filter(
            SubCategory.main_category_id == main_id,
            SubCategory.is_active.in_([1]),
            MainCategory.is_active.in_([1])
        )\
        .all()

@router.get("/products")
def user_all_products(db: Session = Depends(get_db)):
    products = db.query(Product)\
        .join(SubCategory)\
        .join(MainCategory)\
        .filter(
            Product.is_available.in_([1]),
            SubCategory.is_active.in_([1]),
            MainCategory.is_active.in_([1])
        )\
        .all()

    result = []
    for p in products:
        # ✅ Take type1 as main image
        img = db.query(ProductImage).filter(
            ProductImage.product_id == p.id,
            ProductImage.type_name == "type1"
        ).first()

        result.append({
            "id": p.id,
            "name": p.name,
            "subtitle": p.subtitle,
            "price": p.price,
            "discount_percent": p.discount_percent,
            "sub_category_id": p.sub_category_id,
            "image": img.image if img else None   # ✅ now UI works
        })

    return result
# ---------- PRODUCTS BY SUB ----------
@router.get("/products/sub/{sub_id}")
def user_products_by_sub(sub_id: int, db: Session = Depends(get_db)):
    products = db.query(Product)\
        .join(SubCategory)\
        .join(MainCategory)\
        .filter(
            Product.sub_category_id == sub_id,
            Product.is_available.in_([1]),
            SubCategory.is_active.in_([1]),
            MainCategory.is_active.in_([1])
        )\
        .all()

    result = []
    for p in products:
        img = db.query(ProductImage).filter(
            ProductImage.product_id == p.id,
            ProductImage.type_name == "type1"
        ).first()

        result.append({
            "id": p.id,
            "name": p.name,
            "subtitle": p.subtitle,
            "price": p.price,
            "discount_percent": p.discount_percent,
            "sub_category_id": p.sub_category_id,
            "image": img.image if img else None
        })

    return result

