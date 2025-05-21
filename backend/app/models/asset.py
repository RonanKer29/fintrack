"""SQLAlchemy model for Asset."""

from sqlalchemy import Column, Integer, String, DateTime, func
from app.database import Base
from sqlalchemy.orm import relationship

class Asset(Base):
    """
    Represents a financial asset (stock, ETF, crypto).
    """
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, nullable=False, unique=True)
    name = Column(String)
    type = Column(String)  # ex: stock, ETF, crypto
    currency = Column(String)  # ex: USD, EUR, CHF
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    asset_portfolios = relationship("PortfolioAsset", back_populates="asset")
