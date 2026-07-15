import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

TEST_DB_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("test.db"):
        os.remove("test.db")


client = TestClient(app)


def get_token():
    client.post("/auth/register", json={"email": "test@demo.com", "password": "testpass123"})
    res = client.post(
        "/auth/login",
        data={"username": "test@demo.com", "password": "testpass123"},
    )
    return res.json()["access_token"]


def test_register_and_login():
    res = client.post("/auth/register", json={"email": "new@demo.com", "password": "pass1234"})
    assert res.status_code == 201
    assert "access_token" in res.json()

    res = client.post("/auth/login", data={"username": "new@demo.com", "password": "pass1234"})
    assert res.status_code == 200
    assert res.json()["token_type"] == "bearer"


def test_login_wrong_password_fails():
    client.post("/auth/register", json={"email": "wrong@demo.com", "password": "correctpass"})
    res = client.post("/auth/login", data={"username": "wrong@demo.com", "password": "badpass"})
    assert res.status_code == 401


def test_users_requires_auth():
    res = client.get("/api/users")
    assert res.status_code == 401


def test_create_and_list_users():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post(
        "/api/users",
        json={"name": "Test User", "email": "tu@example.com", "role": "Editor", "status": "Active"},
        headers=headers,
    )
    assert res.status_code == 201

    res = client.get("/api/users?page=1&per_page=10", headers=headers)
    assert res.status_code == 200
    body = res.json()
    assert body["total"] >= 1
    assert any(u["email"] == "tu@example.com" for u in body["items"])


def test_users_search_filters_results():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    client.post(
        "/api/users",
        json={"name": "Zebra Search", "email": "zebra@example.com", "role": "Viewer", "status": "Active"},
        headers=headers,
    )
    res = client.get("/api/users?search=Zebra", headers=headers)
    assert res.status_code == 200
    body = res.json()
    assert all("zebra" in u["name"].lower() for u in body["items"])


def test_create_and_list_orders():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post(
        "/api/orders",
        json={"id": "ORD-TEST-1", "customer": "Test Cust", "product": "Test Product", "amount": 999.5, "status": "Pending"},
        headers=headers,
    )
    assert res.status_code == 201

    res = client.get("/api/orders?status=Pending", headers=headers)
    assert res.status_code == 200
    body = res.json()
    assert all(o["status"] == "Pending" for o in body["items"])


def test_duplicate_order_id_rejected():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"id": "ORD-DUP", "customer": "A", "product": "B", "amount": 100, "status": "Pending"}
    res1 = client.post("/api/orders", json=payload, headers=headers)
    assert res1.status_code == 201
    res2 = client.post("/api/orders", json=payload, headers=headers)
    assert res2.status_code == 400


def test_analytics_returns_kpis_and_recent_orders():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/api/analytics", headers=headers)
    assert res.status_code == 200
    body = res.json()
    assert len(body["kpis"]) == 4
    assert "recentOrders" in body
