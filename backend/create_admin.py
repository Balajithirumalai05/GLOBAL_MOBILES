from database.db import SessionLocal
from models.catalog import Admin
from utils.security import hash_password


def create_admin():
    db = SessionLocal()

    username = input("Enter admin username: ").strip()
    password = input("Enter admin password: ").strip()

    # check if admin already exists
    existing = db.query(Admin).filter(Admin.username == username).first()
    if existing:
        print("❌ Admin already exists")
        return

    admin = Admin(
        username=username,
        password=hash_password(password)
    )

    db.add(admin)
    db.commit()
    db.close()

    print("✅ Admin created successfully")

if __name__ == "__main__":
    create_admin()
