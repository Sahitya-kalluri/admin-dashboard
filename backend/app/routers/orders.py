from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_admin

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("", response_model=schemas.OrderPage)
def list_orders(
    search: str = "",
    status: str = "All",
    page: int = 1,
    per_page: int = 5,
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(get_current_admin),
):
    query = db.query(models.Order)

    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(
                models.Order.customer.ilike(like),
                models.Order.id.ilike(like),
                models.Order.product.ilike(like),
            )
        )
    if status != "All":
        query = query.filter(models.Order.status == status)

    total = query.count()
    total_pages = max(1, (total + per_page - 1) // per_page)
    items = (
        query.order_by(models.Order.date.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
    }


@router.post("", response_model=schemas.OrderOut, status_code=201)
def create_order(
    payload: schemas.OrderCreate,
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(get_current_admin),
):
    existing = db.query(models.Order).filter(models.Order.id == payload.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Order ID already exists")
    order = models.Order(**payload.model_dump())
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
