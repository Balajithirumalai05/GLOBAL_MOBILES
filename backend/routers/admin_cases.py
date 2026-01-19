from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.catalog import (
    CaseMainCategory,
    CasePhone,
    CaseModel,
    CaseProduct,
    CaseVariant,
    CaseProductModelMap,
)
import os, shutil, uuid

router = APIRouter(prefix="/admin/cases", tags=["Admin Cases"])

UPLOAD_DIR = "static/cases"
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
# CASE MAIN CATEGORY
# =========================
@router.post("/main-category")
def add_case_main_category(
    name: str = Form(...),
    db: Session = Depends(get_db)
):
    cat = CaseMainCategory(name=name, is_active=1)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {"id": cat.id}


@router.get("/main-categories")
def list_case_main_categories(db: Session = Depends(get_db)):
    return db.query(CaseMainCategory).order_by(CaseMainCategory.id.desc()).all()


@router.put("/main-category/{id}")
def update_case_main_category(
    id: int,
    name: str = Form(...),
    db: Session = Depends(get_db)
):
    cat = db.get(CaseMainCategory, id)
    if not cat:
        raise HTTPException(404, "Case main category not found")

    cat.name = name
    db.commit()
    return {"message": "Updated"}


@router.put("/main-category/{id}/toggle")
def toggle_case_main_category(
    id: int,
    is_active: str = Form(...),
    db: Session = Depends(get_db)
):
    cat = db.get(CaseMainCategory, id)
    if not cat:
        raise HTTPException(404, "Case main category not found")

    cat.is_active = 1 if is_active.lower() == "true" else 0
    db.commit()
    return {"message": "Updated"}


@router.delete("/main-category/{id}")
def delete_case_main_category(id: int, db: Session = Depends(get_db)):
    cat = db.get(CaseMainCategory, id)
    if not cat:
        raise HTTPException(404, "Case main category not found")

    db.delete(cat)
    db.commit()
    return {"message": "Deleted"}


# =========================
# CASE PHONES
# =========================
@router.post("/phone")
def add_case_phone(
    name: str = Form(...),
    case_main_category_id: int = Form(...),
    db: Session = Depends(get_db)
):
    p = CasePhone(
        name=name,
        case_main_category_id=case_main_category_id,
        is_active=1
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"id": p.id}


@router.get("/phones/by-main/{main_id}")
def list_case_phones(main_id: int, db: Session = Depends(get_db)):
    return db.query(CasePhone).filter(
        CasePhone.case_main_category_id == main_id
    ).all()


@router.put("/phone/{id}")
def update_case_phone(
    id: int,
    name: str = Form(...),
    db: Session = Depends(get_db)
):
    phone = db.get(CasePhone, id)
    if not phone:
        raise HTTPException(404, "Phone not found")

    phone.name = name
    db.commit()
    return {"message": "Updated"}


@router.put("/phone/{id}/toggle")
def toggle_case_phone(
    id: int,
    is_active: str = Form(...),
    db: Session = Depends(get_db)
):
    phone = db.get(CasePhone, id)
    if not phone:
        raise HTTPException(404, "Phone not found")

    phone.is_active = 1 if is_active.lower() == "true" else 0
    db.commit()
    return {"message": "Updated"}


@router.delete("/phone/{id}")
def delete_case_phone(id: int, db: Session = Depends(get_db)):
    phone = db.get(CasePhone, id)
    if not phone:
        raise HTTPException(404, "Phone not found")

    db.delete(phone)
    db.commit()
    return {"message": "Deleted"}


# =========================
# CASE MODELS
# =========================
@router.post("/model")
def add_case_model(
    name: str = Form(...),
    case_phone_id: int = Form(...),
    db: Session = Depends(get_db)
):
    m = CaseModel(name=name, case_phone_id=case_phone_id, is_active=1)
    db.add(m)
    db.commit()
    db.refresh(m)
    return {"id": m.id}


@router.get("/models/by-phone/{phone_id}")
def list_case_models(phone_id: int, db: Session = Depends(get_db)):
    return db.query(CaseModel).filter(
        CaseModel.case_phone_id == phone_id
    ).all()


@router.put("/model/{id}")
def update_case_model(
    id: int,
    name: str = Form(...),
    db: Session = Depends(get_db)
):
    m = db.get(CaseModel, id)
    if not m:
        raise HTTPException(404, "Model not found")

    m.name = name
    db.commit()
    return {"message": "Updated"}


@router.put("/model/{id}/toggle")
def toggle_case_model(
    id: int,
    is_active: str = Form(...),
    db: Session = Depends(get_db)
):
    m = db.get(CaseModel, id)
    if not m:
        raise HTTPException(404, "Model not found")

    m.is_active = 1 if is_active.lower() == "true" else 0
    db.commit()
    return {"message": "Updated"}


@router.delete("/model/{id}")
def delete_case_model(id: int, db: Session = Depends(get_db)):
    m = db.get(CaseModel, id)
    if not m:
        raise HTTPException(404, "Model not found")

    db.delete(m)
    db.commit()
    return {"message": "Deleted"}


# =========================
# CASE PRODUCTS
# =========================
@router.post("/case-product")
def add_case_product(
    title: str = Form(...),
    subtitle: str = Form(""),
    price: int = Form(...),
    discount_percent: int = Form(0),
    db: Session = Depends(get_db)
):
    p = CaseProduct(
        title=title,
        subtitle=subtitle,
        price=price,
        discount_percent=discount_percent,
        is_active=1
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"id": p.id}


@router.get("/case-products")
def list_case_products(db: Session = Depends(get_db)):
    return db.query(CaseProduct).order_by(CaseProduct.id.desc()).all()


@router.put("/case-product/{id}")
def update_case_product(
    id: int,
    title: str = Form(...),
    subtitle: str = Form(""),
    price: int = Form(...),
    discount_percent: int = Form(0),
    db: Session = Depends(get_db)
):
    p = db.get(CaseProduct, id)
    if not p:
        raise HTTPException(404, "Case product not found")

    p.title = title
    p.subtitle = subtitle
    p.price = price
    p.discount_percent = discount_percent
    db.commit()
    return {"message": "Updated"}


@router.put("/case-product/{id}/toggle")
def toggle_case_product(
    id: int,
    is_active: str = Form(...),
    db: Session = Depends(get_db)
):
    p = db.get(CaseProduct, id)
    if not p:
        raise HTTPException(404, "Case product not found")

    p.is_active = 1 if is_active.lower() == "true" else 0
    db.commit()
    return {"message": "Updated"}


@router.delete("/case-product/{id}")
def delete_case_product(id: int, db: Session = Depends(get_db)):
    p = db.get(CaseProduct, id)
    if not p:
        raise HTTPException(404, "Case product not found")

    # delete files
    variants = db.query(CaseVariant).filter(
        CaseVariant.case_product_id == id
    ).all()

    for v in variants:
        delete_file(v.image)

    db.query(CaseVariant).filter(CaseVariant.case_product_id == id).delete()
    db.query(CaseProductModelMap).filter(
        CaseProductModelMap.case_product_id == id
    ).delete()

    db.delete(p)
    db.commit()
    return {"message": "Deleted"}


# =========================
# CASE PRODUCT VARIANTS
# =========================
@router.post("/case-product/{case_product_id}/variant")
def upload_case_variant(
    case_product_id: int,
    type_name: str = Form(...),   # type1..type5
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    old = db.query(CaseVariant).filter(
        CaseVariant.case_product_id == case_product_id,
        CaseVariant.type_name == type_name
    ).first()

    if old:
        delete_file(old.image)
        db.delete(old)
        db.commit()

    v = CaseVariant(
        case_product_id=case_product_id,
        type_name=type_name,
        image=save_image(image),
        is_active=1
    )
    db.add(v)
    db.commit()
    db.refresh(v)
    return {"id": v.id, "message": "Uploaded"}


@router.get("/case-product/{case_product_id}/variants")
def get_case_variants(case_product_id: int, db: Session = Depends(get_db)):
    variants = db.query(CaseVariant).filter(
        CaseVariant.case_product_id == case_product_id
    ).all()

    # ✅ return full info (admin needs id + is_active)
    return [
        {
            "id": v.id,
            "type_name": v.type_name,
            "image": v.image,
            "is_active": v.is_active
        }
        for v in variants
    ]


@router.put("/variant/{variant_id}/toggle")
def toggle_case_variant(
    variant_id: int,
    is_active: str = Form(...),
    db: Session = Depends(get_db)
):
    v = db.get(CaseVariant, variant_id)
    if not v:
        raise HTTPException(404, "Variant not found")

    v.is_active = 1 if is_active.lower() == "true" else 0
    db.commit()
    return {"message": "Updated"}


@router.delete("/case-product/{case_product_id}/variant/{type_name}")
def delete_case_variant(case_product_id: int, type_name: str, db: Session = Depends(get_db)):
    v = db.query(CaseVariant).filter(
        CaseVariant.case_product_id == case_product_id,
        CaseVariant.type_name == type_name
    ).first()

    if not v:
        raise HTTPException(404, "Variant not found")

    delete_file(v.image)
    db.delete(v)
    db.commit()
    return {"message": "Deleted"}


# =========================
# MAP CASE PRODUCT -> MODEL
# =========================
@router.post("/case-product/{case_product_id}/map-model")
def map_case_product_to_model(
    case_product_id: int,
    case_main_category_id: int = Form(...),
    case_phone_id: int = Form(...),
    case_model_id: int = Form(...),
    db: Session = Depends(get_db)
):
    exists = db.query(CaseProductModelMap).filter(
        CaseProductModelMap.case_product_id == case_product_id,
        CaseProductModelMap.case_model_id == case_model_id
    ).first()

    if exists:
        return {"message": "Already mapped"}

    m = CaseProductModelMap(
        case_product_id=case_product_id,
        case_main_category_id=case_main_category_id,
        case_phone_id=case_phone_id,
        case_model_id=case_model_id,
        is_active=1
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return {"id": m.id, "message": "Mapped"}


@router.get("/case-product/{case_product_id}/mapped-models")
def get_mapped_models(case_product_id: int, db: Session = Depends(get_db)):
    rows = db.query(CaseProductModelMap).filter(
        CaseProductModelMap.case_product_id == case_product_id
    ).all()

    return [
        {
            "id": r.id,
            "case_product_id": r.case_product_id,
            "case_main_category_id": r.case_main_category_id,
            "case_phone_id": r.case_phone_id,
            "case_model_id": r.case_model_id,
            "is_active": r.is_active
        }
        for r in rows
    ]


@router.put("/map/{map_id}/toggle")
def toggle_case_product_model_map(
    map_id: int,
    is_active: str = Form(...),
    db: Session = Depends(get_db)
):
    row = db.get(CaseProductModelMap, map_id)
    if not row:
        raise HTTPException(404, "Map row not found")

    row.is_active = 1 if is_active.lower() == "true" else 0
    db.commit()
    return {"message": "Updated"}
