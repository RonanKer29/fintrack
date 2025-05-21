"""Pydantic schemas for Transaction."""

from pydantic import BaseModel
from typing import Optional
from datetime import date


class TransactionBase(BaseModel):
    asset_id: Optional[int]
    portfolio_id: Optional[int]
    type: str  # buy, sell, dividend
    quantity: Optional[float]
    price: Optional[float]
    currency: Optional[str]
    date: Optional[date]


class TransactionCreate(TransactionBase):
    user_id: int


class TransactionResponse(TransactionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
