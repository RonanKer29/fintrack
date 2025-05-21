"""Pydantic schemas for PortfolioAsset operations."""

from pydantic import BaseModel
from typing import Optional
from datetime import date


class PortfolioAssetBase(BaseModel):
    """
    Base schema for a portfolio asset.

    Represents an asset (e.g., ETF, stock) held in a portfolio, including
    quantity, purchase price, date, and currency.
    """
    asset_id: int
    quantity: float
    average_price: float
    purchase_date: Optional[date] = None
    currency: Optional[str] = None


class PortfolioAssetCreate(PortfolioAssetBase):
    """
    Schema for creating a new portfolio asset.

    Includes the portfolio ID to associate the asset with a specific portfolio.
    """
    portfolio_id: int


class PortfolioAssetResponse(PortfolioAssetBase):
    """
    Schema for returning a portfolio asset.

    Includes the asset's database ID and the portfolio ID it belongs to.
    """
    id: int
    portfolio_id: int

    class Config:
        from_attributes = True  # Enable ORM to Pydantic conversion
