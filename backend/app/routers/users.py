from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database

router = APIRouter()

# === POST /users ===
@router.post("/", response_model=schemas.UserBase)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing_user = db.query(models.User).filter_by(name=user.name).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    db_user = models.User( name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# === GET /users ===
@router.get("/", response_model=List[schemas.UserBase])
def get_users(db: Session = Depends(database.get_db)):
    return db.query(models.User).all()
