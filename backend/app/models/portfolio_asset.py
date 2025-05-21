"""SQLAlchemy model for the association between portfolios and assets."""

from sqlalchemy import Column, Integer, ForeignKey, Numeric, Date, String
from sqlalchemy.orm import relationship
from app.database import Base


class PortfolioAsset(Base):
    """
    Represents a single asset held within a portfolio.

    Includes quantity, average purchase price, currency, and optional purchase date.
    """
    __tablename__ = "portfolio_assets"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id", ondelete="CASCADE"), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Numeric, nullable=False)
    average_price = Column(Numeric, nullable=False)
    purchase_date = Column(Date)
    currency = Column(String)

    # Relationships
    portfolio = relationship("Portfolio", back_populates="assets")
    asset = relationship("Asset")
