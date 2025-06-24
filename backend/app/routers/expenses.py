from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
router = APIRouter()

@router.post("/groups/{group_id}/expenses", response_model=schemas.ExpenseOut)
def add_expense(group_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    if expense.split_type not in ["equal", "percentage"]:
        raise HTTPException(status_code=400, detail="Invalid split_type")

    # Create Expense
    db_expense = models.Expense(
        description=expense.description,
        amount=expense.amount,
        paid_by=expense.paid_by,
        group_id=group_id,
        split_type=expense.split_type
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)

    # Handle Splits
    splits = []
    if expense.split_type == "equal":
        user_ids = [gu.user_id for gu in group.users]
        if not user_ids:
            raise HTTPException(status_code=400, detail="No users in group")
        split_amount = round(expense.amount / len(user_ids), 2)
        for uid in user_ids:
            splits.append(models.Split(expense_id=db_expense.id, user_id=uid, amount=split_amount))

    elif expense.split_type == "percentage":
        total_percent = sum(s.percentage for s in expense.splits if s.percentage)
        if round(total_percent, 2) != 100.0:
            raise HTTPException(status_code=400, detail="Percentages must sum to 100")
        for s in expense.splits:
            amt = round((s.percentage / 100.0) * expense.amount, 2)
            splits.append(models.Split(expense_id=db_expense.id, user_id=s.user_id, amount=amt))

    db.add_all(splits)
    db.commit()

    return db_expense
