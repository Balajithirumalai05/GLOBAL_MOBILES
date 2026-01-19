from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database.base import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Text

class MainCategory(Base):
    __tablename__ = "main_categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    image = Column(String(255))
    is_active = Column(Boolean, default=True)


class SubCategory(Base):
    __tablename__ = "sub_categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    image = Column(String(255))
    is_active = Column(Boolean, default=True)

    main_category_id = Column(Integer, ForeignKey("main_categories.id"))

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    subtitle = Column(String(200))
    price = Column(Integer)
    discount_percent = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)

    sub_category_id = Column(Integer, ForeignKey("sub_categories.id"))


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True)
    type_name = Column(String(10))  # type1..type5
    image = Column(String(255))

    product_id = Column(Integer, ForeignKey("products.id"))


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    password = Column(String(255))  # hashed



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(255))  # hashed



class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)

class CaseMainCategory(Base):
    __tablename__ = "case_main_category"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    is_active = Column(Integer, default=1)

    phones = relationship("CasePhone", back_populates="main_category", cascade="all, delete")


class CasePhone(Base):
    __tablename__ = "case_phone"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    case_main_category_id = Column(Integer, ForeignKey("case_main_category.id"), nullable=False)
    is_active = Column(Integer, default=1)

    main_category = relationship("CaseMainCategory", back_populates="phones")
    models = relationship("CaseModel", back_populates="phone", cascade="all, delete")


class CaseModel(Base):
    __tablename__ = "case_model"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    case_phone_id = Column(Integer, ForeignKey("case_phone.id"), nullable=False)
    is_active = Column(Integer, default=1)

    phone = relationship("CasePhone", back_populates="models")


class CaseProduct(Base):
    __tablename__ = "case_product"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(120), nullable=False)
    subtitle = Column(Text, default="")
    price = Column(Integer, nullable=False)
    discount_percent = Column(Integer, default=0)
    is_active = Column(Integer, default=1)   # ✅ case availability

    variants = relationship("CaseVariant", back_populates="case_product", cascade="all, delete")


class CaseVariant(Base):
    __tablename__ = "case_variant"

    id = Column(Integer, primary_key=True, index=True)
    case_product_id = Column(Integer, ForeignKey("case_product.id"), nullable=False)
    type_name = Column(String(30), nullable=False)  # type1..type5
    image = Column(String(255), nullable=False)
    is_active = Column(Integer, default=1)

    case_product = relationship("CaseProduct", back_populates="variants")


class CaseProductModelMap(Base):
    """
    ✅ Link: Case Product -> (Main Category -> Phone -> Model)
    Means: case product can be used for that model
    """
    __tablename__ = "case_product_model_map"

    id = Column(Integer, primary_key=True, index=True)
    case_product_id = Column(Integer, ForeignKey("case_product.id"), nullable=False)

    case_main_category_id = Column(Integer, ForeignKey("case_main_category.id"), nullable=False)
    case_phone_id = Column(Integer, ForeignKey("case_phone.id"), nullable=False)
    case_model_id = Column(Integer, ForeignKey("case_model.id"), nullable=False)

    is_active = Column(Integer, default=1)  # ✅ visibility per model mapping