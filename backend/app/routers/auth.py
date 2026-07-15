from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import hash_password, verify_password, create_access_token
from ..database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(payload: schemas.AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Admin).filter(models.Admin.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    admin = models.Admin(email=payload.email, hashed_password=hash_password(payload.password))
    db.add(admin)
    db.commit()
    db.refresh(admin)

    token = create_access_token({"sub": admin.email})
    return {"access_token": token}


@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm uses "username" as the field name; we treat it as email.
    admin = db.query(models.Admin).filter(models.Admin.email == form_data.username).first()
    if not admin or not verify_password(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": admin.email})
    return {"access_token": token}
