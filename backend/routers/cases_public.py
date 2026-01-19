from fastapi import APIRouter, Depends
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

router = APIRouter(prefix="/cases", tags=["Cases Public"])


@router.get("/main-categories")
def public_case_main_categories(db: Session = Depends(get_db)):
    return db.query(CaseMainCategory).filter(CaseMainCategory.is_active == 1).all()


@router.get("/phones/by-main/{main_id}")
def public_case_phones(main_id: int, db: Session = Depends(get_db)):
    return db.query(CasePhone).filter(
        CasePhone.case_main_category_id == main_id,
        CasePhone.is_active == 1
    ).all()


@router.get("/models/by-phone/{phone_id}")
def public_case_models(phone_id: int, db: Session = Depends(get_db)):
    return db.query(CaseModel).filter(
        CaseModel.case_phone_id == phone_id,
        CaseModel.is_active == 1
    ).all()


@router.get("/products")
def public_case_products(db: Session = Depends(get_db)):
    return db.query(CaseProduct).filter(CaseProduct.is_active == 1).order_by(CaseProduct.id.desc()).all()


@router.get("/product/{case_product_id}/variants")
def public_case_variants(case_product_id: int, db: Session = Depends(get_db)):
    variants = db.query(CaseVariant).filter(
        CaseVariant.case_product_id == case_product_id,
        CaseVariant.is_active == 1
    ).all()
    return {v.type_name: v.image for v in variants}


@router.get("/product/{case_product_id}/allowed-models")
def public_allowed_models(case_product_id: int, db: Session = Depends(get_db)):
    # must be mapped + active
    rows = db.query(CaseProductModelMap).filter(
        CaseProductModelMap.case_product_id == case_product_id,
        CaseProductModelMap.is_active == 1
    ).all()

    # filter: main/phone/model active
    result = []
    for r in rows:
        main = db.get(CaseMainCategory, r.case_main_category_id)
        phone = db.get(CasePhone, r.case_phone_id)
        model = db.get(CaseModel, r.case_model_id)

        if not main or not phone or not model:
            continue

        if main.is_active != 1: 
            continue
        if phone.is_active != 1:
            continue
        if model.is_active != 1:
            continue

        result.append({
            "map_id": r.id,
            "case_main_category_id": r.case_main_category_id,
            "case_phone_id": r.case_phone_id,
            "case_model_id": r.case_model_id,
            "main_name": main.name,
            "phone_name": phone.name,
            "model_name": model.name,
        })

    return result
