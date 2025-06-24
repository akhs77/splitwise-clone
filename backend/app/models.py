from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class GroupUser(Base):
    __tablename__ = "group_users"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    group = relationship("Group", back_populates="users")
    user = relationship("User", back_populates="group_links")

class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    users = relationship("GroupUser", back_populates="group")
    expenses = relationship("Expense", back_populates="group")


class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True)
    description = Column(String)
    amount = Column(Float)
    paid_by = Column(Integer, ForeignKey("users.id"))
    group_id = Column(Integer, ForeignKey("groups.id"))
    split_type = Column(String)  # "equal" or "percentage"

    group = relationship("Group", back_populates="expenses")
    splits = relationship("Split", back_populates="expense")

class Split(Base):
    __tablename__ = "splits"
    id = Column(Integer, primary_key=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)

    expense = relationship("Expense", back_populates="splits")
    user = relationship("User", back_populates="splits")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    # 🔧 Add this line to fix the error
    group_links = relationship("GroupUser", back_populates="user")
    splits = relationship("Split", back_populates="user") 