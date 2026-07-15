from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_admin

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=schemas.UserPage)
def list_users(
    search: str = "",
    role: str = "All",
    status: str = "All",
    page: int = 1,
    per_page: int = 10,
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(get_current_admin),
):
    query = db.query(models.User)

    if search:
        like = f"%{search}%"
        query = query.filter(or_(models.User.name.ilike(like), models.User.email.ilike(like)))
    if role != "All":
        query = query.filter(models.User.role == role)
    if status != "All":
        query = query.filter(models.User.status == status)

    total = query.count()
    total_pages = max(1, (total + per_page - 1) // per_page)
    items = (
        query.order_by(models.User.id.desc())
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


@router.post("", response_model=schemas.UserOut, status_code=201)
def create_user(
    payload: schemas.UserCreate,
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(get_current_admin),
):
    user = models.User(**payload.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(get_current_admin),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return None
