"""Run with: python -m app.seed
Creates a demo admin login and populates users/orders so the dashboard
looks the same as the old mock data, but from the real database.
"""
from . import models
from .database import SessionLocal, engine
from .auth import hash_password

models.Base.metadata.create_all(bind=engine)

USERS = [
    {"name": "Arjun Sharma", "email": "arjun@example.com", "role": "Admin", "status": "Active", "joined": "2024-01-15"},
    {"name": "Priya Reddy", "email": "priya@example.com", "role": "Editor", "status": "Active", "joined": "2024-02-20"},
    {"name": "Kiran Rao", "email": "kiran@example.com", "role": "Viewer", "status": "Inactive", "joined": "2024-03-10"},
    {"name": "Sneha Patel", "email": "sneha@example.com", "role": "Editor", "status": "Active", "joined": "2024-04-05"},
    {"name": "Rahul Verma", "email": "rahul@example.com", "role": "Admin", "status": "Active", "joined": "2024-05-18"},
    {"name": "Anjali Nair", "email": "anjali@example.com", "role": "Viewer", "status": "Active", "joined": "2024-06-22"},
    {"name": "Vikram Singh", "email": "vikram@example.com", "role": "Editor", "status": "Inactive", "joined": "2024-07-30"},
    {"name": "Deepa Iyer", "email": "deepa@example.com", "role": "Viewer", "status": "Active", "joined": "2024-08-12"},
    {"name": "Suresh Kumar", "email": "suresh@example.com", "role": "Editor", "status": "Active", "joined": "2024-09-01"},
    {"name": "Meera Joshi", "email": "meera@example.com", "role": "Admin", "status": "Active", "joined": "2024-10-14"},
    {"name": "Aditya Gupta", "email": "aditya@example.com", "role": "Viewer", "status": "Inactive", "joined": "2024-11-03"},
    {"name": "Kavitha Menon", "email": "kavitha@example.com", "role": "Editor", "status": "Active", "joined": "2024-12-19"},
]

ORDERS = [
    {"id": "ORD-001", "customer": "Arjun Sharma", "product": "React Course", "amount": 2400, "status": "Completed", "date": "2024-12-01"},
    {"id": "ORD-002", "customer": "Priya Reddy", "product": "UI Kit Pro", "amount": 8750, "status": "Pending", "date": "2024-12-02"},
    {"id": "ORD-003", "customer": "Kiran Rao", "product": "Backend Plan", "amount": 1200, "status": "Processing", "date": "2024-12-03"},
    {"id": "ORD-004", "customer": "Sneha Patel", "product": "Dashboard Theme", "amount": 5600, "status": "Completed", "date": "2024-12-04"},
    {"id": "ORD-005", "customer": "Rahul Verma", "product": "AG Grid License", "amount": 3300, "status": "Cancelled", "date": "2024-12-05"},
    {"id": "ORD-006", "customer": "Anjali Nair", "product": "React Course", "amount": 2400, "status": "Completed", "date": "2024-12-06"},
    {"id": "ORD-007", "customer": "Vikram Singh", "product": "UI Kit Pro", "amount": 8750, "status": "Pending", "date": "2024-12-07"},
    {"id": "ORD-008", "customer": "Deepa Iyer", "product": "Backend Plan", "amount": 1200, "status": "Completed", "date": "2024-12-08"},
]


def seed():
    db = SessionLocal()
    try:
        if not db.query(models.Admin).filter_by(email="admin@demo.com").first():
            db.add(models.Admin(email="admin@demo.com", hashed_password=hash_password("admin123")))

        if db.query(models.User).count() == 0:
            db.bulk_save_objects([models.User(**u) for u in USERS])

        if db.query(models.Order).count() == 0:
            db.bulk_save_objects([models.Order(**o) for o in ORDERS])

        db.commit()
        print("Seeded: admin login = admin@demo.com / admin123")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
