from pydantic import BaseModel


class MainCategoryCreate(BaseModel):
    name: str


class SubCategoryCreate(BaseModel):
    name: str
    main_category_id: int


class ModelCreate(BaseModel):
    name: str
    subtitle: str
    price: int
    sub_category_id: int
