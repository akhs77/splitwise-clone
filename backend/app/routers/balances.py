from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from collections import defaultdict

from .. import models, schemas, database

router = APIRouter()

@router.get("/groups/{group_id}/balances", response_model=list[schemas.BalanceOut])
def group_balances(group_id: int, db: Session = Depends(database.get_db)):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    balances = defaultdict(lambda: defaultdict(float))

    for expense in group.expenses:
        paid_by = expense.paid_by
        for split in expense.splits:
            if split.user_id != paid_by:
                balances[split.user_id][paid_by] += split.amount

    # Net out balances using a safe copy
    simplified = []
    visited_pairs = set()

    for from_user, owes in balances.copy().items():
        for to_user, amount in owes.copy().items():
            if (to_user, from_user) in visited_pairs:
                continue  # skip reverse pair already processed

            reverse_amount = balances[to_user].get(from_user, 0)
            net_amount = amount - reverse_amount

            if net_amount > 0:
                simplified.append(schemas.BalanceOut(
                    from_user_id=from_user,
                    to_user_id=to_user,
                    amount=round(net_amount, 2)
                ))
            elif net_amount < 0:
                simplified.append(schemas.BalanceOut(
                    from_user_id=to_user,
                    to_user_id=from_user,
                    amount=round(-net_amount, 2)
                ))

            visited_pairs.add((from_user, to_user))

    return simplified


@router.get("/users/{user_id}/balances", response_model=list[schemas.BalanceOut])
def user_balances(user_id: int, db: Session = Depends(database.get_db)):
    groups = db.query(models.Group).join(models.GroupUser).filter(models.GroupUser.user_id == user_id).all()

    result = []
    for group in groups:
        group_bal = group_balances(group.id, db)
        for b in group_bal:
            if b.from_user_id == user_id or b.to_user_id == user_id:
                result.append(b)

    return result
