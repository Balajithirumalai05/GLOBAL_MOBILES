from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from database.db import engine
from database.base import Base
from routers.admin_catalog import router as admin_catalog_router
from routers.user_catalog import router as user_catalog_router
from routers.admin_auth import router as admin_auth_router  
from routers.user_auth import router as user_auth_router

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# =========================
# CORS CONFIGURATION
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # React (Vite)
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# STATIC FILES
# =========================
app.mount("/static", StaticFiles(directory="static"), name="static")

# =========================
# ROUTERS
# =========================

        # You can include other routers similarly   
app.include_router(admin_catalog_router)
app.include_router(user_catalog_router)
app.include_router(admin_auth_router)
app.include_router(user_auth_router)
from routers import admin_cases, cases_public

app.include_router(admin_cases.router)
app.include_router(cases_public.router)
