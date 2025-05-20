"""Pydantic schemas for Asset."""

from pydantic import BaseModel
from datetime import datetime


class AssetBase(BaseModel):
    ticker: str
    name: str | None = None
    type: str
    currency: str


class AssetCreate(AssetBase):
    """
    Schema for creating a new asset.
    """
    pass


class AssetOut(AssetBase):
    """
    Schema for returning an asset in API responses.
    """
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
