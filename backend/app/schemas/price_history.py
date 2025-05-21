"""Pydantic schemas for PriceHistory."""

from pydantic import BaseModel
from datetime import date


class PriceHistoryBase(BaseModel):
    asset_id: int
    date: date
    price: float
    currency: str


class PriceHistoryCreate(PriceHistoryBase):
    pass


class PriceHistoryResponse(PriceHistoryBase):
    id: int

    class Config:
        from_attributes = True
