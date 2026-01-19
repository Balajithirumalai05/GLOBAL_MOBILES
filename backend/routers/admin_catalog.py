from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.catalog import MainCategory, SubCategory, Product, ProductImage
import os, shutil, uuid

router = APIRouter(prefix="/admin/catalog", tags=["Admin Catalog"])

UPLOAD_DIR = "static/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================
# UTILITY
# =========================
def save_image(image: UploadFile):
    filename = f"{uuid.uuid4()}_{image.filename}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    return path

def delete_file(path: str):
    if path and os.path.exists(path):
        os.remove(path)


# =========================
# MAIN CATEGORY
# =========================

# ➕ ADD
@router.post("/main-category")
def add_main_category(
    name: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    cat = MainCategory(
        name=name,
        image=save_image(image),
        is_active=1
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {"id": cat.id}


# 📄 LIST (ADMIN)
@router.get("/main-categories")
def admin_main_categories(db: Session = Depends(get_db)):
    return db.query(MainCategory).order_by(MainCategory.id.desc()).all()


# 👁️ TOGGLE
@router.put("/main-category/{id}/toggle")
def toggle_main_category(
    id: int,
    is_active: str = Form(...),
    db: Session = Depends(get_db)
):
    cat = db.get(MainCategory, id)
    if not cat:
        raise HTTPException(404)

    cat.is_active = 1 if is_active.lower() == "true" else 0
    db.commit()
    return {"message": "Updated"}

@router.delete("/main-category/{id}")
def delete_main_category(id: int, db: Session = Depends(get_db)):
    cat = db.get(MainCategory, id)
    if not cat:
        raise HTTPException(404, "Main category not found")

    # ❌ delete image from disk
    delete_file(cat.image)

    # ❌ delete sub categories + their images
    subs = db.query(SubCategory).filter(SubCategory.main_category_id == id).all()
    for sub in subs:
        delete_file(sub.image)

        # ❌ delete products under sub category
        products = db.query(Product).filter(Product.sub_category_id == sub.id).all()
        for p in products:
            images = db.query(ProductImage).filter(ProductImage.product_id == p.id).all()
            for img in images:
                delete_file(img.image)
            db.query(ProductImage).filter(ProductImage.product_id == p.id).delete()

        db.query(Product).filter(Product.sub_category_id == sub.id).delete()

    db.query(SubCategory).filter(SubCategory.main_category_id == id).delete()
    db.delete(cat)
    db.commit()

    return {"message": "Main category deleted"}


# =========================
# SUB CATEGORY
# =========================

# ➕ ADD
@router.post("/sub-category")
def add_sub_category(
    name: str = Form(...),
    main_category_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    sub = SubCategory(
        name=name,
        image=save_image(image),
        main_category_id=main_category_id,
        is_active=1
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return {"id": sub.id}


# 📄 LIST (ADMIN)
@router.get("/sub-categories/by-main/{main_id}")
def admin_sub_categories(main_id: int, db: Session = Depends(get_db)):
    return db.query(SubCategory)\
        .filter(SubCategory.main_category_id == main_id)\
        .all()


# 👁️ TOGGLE
@router.put("/sub-category/{id}/toggle")
def toggle_sub_category(
    id: int,
    is_active: str = Form(...),
    db: Session = Depends(get_db)
):
    sub = db.get(SubCategory, id)
    if not sub:
        raise HTTPException(404)

    sub.is_active = 1 if is_active.lower() == "true" else 0
    db.commit()
    return {"message": "Updated"}
@router.delete("/sub-category/{id}")
def delete_sub_category(id: int, db: Session = Depends(get_db)):
    sub = db.get(SubCategory, id)
    if not sub:
        raise HTTPException(404, "Sub category not found")

    delete_file(sub.image)

    products = db.query(Product).filter(Product.sub_category_id == id).all()
    for p in products:
        images = db.query(ProductImage).filter(ProductImage.product_id == p.id).all()
        for img in images:
            delete_file(img.image)

        db.query(ProductImage).filter(ProductImage.product_id == p.id).delete()

    db.query(Product).filter(Product.sub_category_id == id).delete()
    db.delete(sub)
    db.commit()

    return {"message": "Sub category deleted"}


# =========================
# PRODUCTS
# =========================

# ➕ ADD
@router.post("/product")
def add_product(
    name: str = Form(...),
    subtitle: str = Form(""),
    price: int = Form(...),
    discount_percent: int = Form(0),
    sub_category_id: int = Form(...),
    db: Session = Depends(get_db)
):
    product = Product(
        name=name,
        subtitle=subtitle,
        price=price,
        discount_percent=discount_percent,
        sub_category_id=sub_category_id,
        is_available=1
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"id": product.id}


# 📄 LIST (ADMIN)
@router.get("/products/by-sub-category/{sub_id}")
def admin_products(sub_id: int, db: Session = Depends(get_db)):
    return db.query(Product)\
        .filter(Product.sub_category_id == sub_id)\
        .all()


# 👁️ TOGGLE
@router.put("/product/{id}/toggle")
def toggle_product(
    id: int,
    is_available: str = Form(...),
    db: Session = Depends(get_db)
):
    product = db.get(Product, id)
    if not product:
        raise HTTPException(404)

    product.is_available = 1 if is_available.lower() == "true" else 0
    db.commit()
    return {"message": "Updated"}


# =========================
# PRODUCT TYPE IMAGES (TYPE1–TYPE5)
# =========================

@router.post("/product/{product_id}/type-image")
def upload_type_image(
    product_id: int,
    type_name: str = Form(...),     # type1..type5
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # delete existing image for this type
    db.query(ProductImage).filter(
        ProductImage.product_id == product_id,
        ProductImage.type_name == type_name
    ).delete()

    img = ProductImage(
        product_id=product_id,
        type_name=type_name,
        image=save_image(image)
    )
    db.add(img)
    db.commit()

    return {"message": f"{type_name} uploaded"}


@router.get("/product/{product_id}/type-images")
def get_type_images(product_id: int, db: Session = Depends(get_db)):
    images = db.query(ProductImage)\
        .filter(ProductImage.product_id == product_id)\
        .all()

    return {img.type_name: img.image for img in images}


@router.delete("/product/{product_id}/type-image/{type_name}")
def delete_type_image(
    product_id: int,
    type_name: str,
    db: Session = Depends(get_db)
):
    db.query(ProductImage).filter(
        ProductImage.product_id == product_id,
        ProductImage.type_name == type_name
    ).delete()
    db.commit()

    return {"message": "Image removed"}
@router.delete("/product/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    product = db.get(Product, id)
    if not product:
        raise HTTPException(404, "Product not found")

    images = db.query(ProductImage).filter(ProductImage.product_id == id).all()
    for img in images:
        delete_file(img.image)

    db.query(ProductImage).filter(ProductImage.product_id == id).delete()
    db.delete(product)
    db.commit()

    return {"message": "Product deleted"}

@router.put("/main-category/{id}")
def update_main_category(
    id: int,
    name: str = Form(...),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    cat = db.get(MainCategory, id)
    if not cat:
        raise HTTPException(404, "Main category not found")

    cat.name = name

    if image:
        delete_file(cat.image)
        cat.image = save_image(image)

    db.commit()
    return {"message": "Main category updated"}
@router.put("/sub-category/{id}")
def update_sub_category(
    id: int,
    name: str = Form(...),
    main_category_id: int = Form(...),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    sub = db.get(SubCategory, id)
    if not sub:
        raise HTTPException(404, "Sub category not found")

    sub.name = name
    sub.main_category_id = main_category_id

    if image:
        delete_file(sub.image)
        sub.image = save_image(image)

    db.commit()
    return {"message": "Sub category updated"}
@router.put("/product/{id}")
def update_product(
    id: int,
    name: str = Form(...),
    subtitle: str = Form(""),
    price: int = Form(...),
    discount_percent: int = Form(0),
    sub_category_id: int = Form(...),
    db: Session = Depends(get_db)
):
    product = db.get(Product, id)
    if not product:
        raise HTTPException(404, "Product not found")

    product.name = name
    product.subtitle = subtitle
    product.price = price
    product.discount_percent = discount_percent
    product.sub_category_id = sub_category_id

    db.commit()
    return {"message": "Product updated"}
