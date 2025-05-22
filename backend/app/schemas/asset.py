from datetime import datetime
from typing import Literal
from pydantic import BaseModel


class AssetBase(BaseModel):
    ticker: str
    name: str | None = None
    type: Literal["stock", "etf", "crypto"]
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

# schemas/asset.py
class TopAssetOut(BaseModel):
    ticker: str
    name: str | None
    type: Literal["stock", "etf", "crypto"]
    current_value: float
