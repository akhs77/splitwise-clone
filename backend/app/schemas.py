from pydantic import BaseModel, Field
from typing import List, Optional

# === USER ===

class UserCreate(BaseModel):
    name: str 

class UserBase(UserCreate):
    id: int
    # name: str

    class Config:
        from_attributes = True
        populate_by_name = True

class UserOut(UserBase):
    id: int
    name: str
    class Config:
        orm_mode = True

# === GROUP ===
class GroupCreate(BaseModel):
    name: str
    user_ids: List[int]


class GroupOut(BaseModel):
    id: int
    name: str
    user_ids: List[int]
    total_expenses: float

    class Config:
        orm_mode = True


# === EXPENSE ===
class SplitInput(BaseModel):
    user_id: int
    amount: Optional[float] = None
    percentage: Optional[float] = None

from enum import Enum

class SplitType(str, Enum):
    equal = "equal"
    percentage = "percentage"

class ExpenseCreate(BaseModel):
    description: str
    amount: float
    paid_by: int
    split_type: SplitType
    splits: List[SplitInput]


class ExpenseOut(BaseModel):
    id: int
    description: str
    amount: float
    paid_by: int
    split_type: str

    class Config:
        from_attributes = True


# === BALANCE ===
class BalanceOut(BaseModel):
    from_user_id: int
    to_user_id: int
    amount: float
