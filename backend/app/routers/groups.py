from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models import Group
from app.database import get_db
from .. import models, schemas, database

router = APIRouter()

# === POST /groups ===
@router.post("/", response_model=schemas.GroupOut)
def create_group(group: schemas.GroupCreate, db: Session = Depends(database.get_db)):
    db_group = models.Group(name=group.name)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)

    for user_id in group.user_ids:
        db_group_user = models.GroupUser(group_id=db_group.id, user_id=user_id)
        db.add(db_group_user)
    
    db.commit()

    return schemas.GroupOut(
        id=db_group.id,
        name=db_group.name,
        user_ids=group.user_ids,
        total_expenses=0.0
    )


# === GET /groups ===
@router.get("/", response_model=List[schemas.GroupOut])
def get_groups(db: Session = Depends(database.get_db)):
    groups = db.query(models.Group).all()

    results = []
    for group in groups:
        user_ids = [gu.user_id for gu in group.users]
        total_expenses = sum(exp.amount for exp in group.expenses)

        results.append(schemas.GroupOut(
            id=group.id,
            name=group.name,
            user_ids=user_ids,
            total_expenses=total_expenses
        ))

    return results


# === GET /groups/{group_id} ===
@router.get("/{group_id}")
def get_group_detail(group_id: int, db: Session = Depends(database.get_db)):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    users = [db.query(models.User).filter_by(id=gu.user_id).first() for gu in group.users]

    return {
        "id": group.id,
        "name": group.name,
        "users": [{"id": u.id, "name": u.name} for u in users]
    }


@router.get("/groups", response_model=list[schemas.GroupOut])
def get_all_groups(db: Session = Depends(get_db)):
    return db.query(Group).all()