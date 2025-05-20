"""Pydantic schemas for Portfolio."""

from pydantic import BaseModel
from datetime import datetime


class PortfolioBase(BaseModel):
    title: str
    description: str | None = None
    is_public: bool = False


class PortfolioCreate(PortfolioBase):
    """
    Schema for creating a new portfolio.
    """
    pass


class PortfolioOut(PortfolioBase):
    """
    Schema returned when reading a portfolio.
    """
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
