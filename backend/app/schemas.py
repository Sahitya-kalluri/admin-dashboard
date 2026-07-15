from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict


# ---- Auth ----
class AdminCreate(BaseModel):
    email: EmailStr
    password: str


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---- Users ----
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "Viewer"
    status: str = "Active"


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    joined: str


class UserPage(BaseModel):
    items: List[UserOut]
    total: int
    page: int
    per_page: int
    total_pages: int


# ---- Orders ----
class OrderBase(BaseModel):
    customer: str
    product: str
    amount: float
    status: str = "Pending"


class OrderCreate(OrderBase):
    id: str


class OrderOut(OrderBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    date: str


class OrderPage(BaseModel):
    items: List[OrderOut]
    total: int
    page: int
    per_page: int
    total_pages: int


# ---- Analytics ----
class KPI(BaseModel):
    label: str
    value: str
    change: str
    trend: str
    icon: str


class AnalyticsOut(BaseModel):
    kpis: List[KPI]
    recentOrders: List[OrderOut]
