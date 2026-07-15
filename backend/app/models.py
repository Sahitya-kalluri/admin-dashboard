import datetime
from sqlalchemy import Column, Integer, String, DateTime, Numeric
from .database import Base


class Admin(Base):
    """Dashboard operators who can log in — separate from the Users table below,
    which holds the app's own end users being managed through the dashboard."""
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    role = Column(String, default="Viewer")
    status = Column(String, default="Active")
    joined = Column(String, default=lambda: datetime.date.today().isoformat())


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)  # e.g. ORD-001
    customer = Column(String, nullable=False)
    product = Column(String, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, default="Pending")
    date = Column(String, default=lambda: datetime.date.today().isoformat())
