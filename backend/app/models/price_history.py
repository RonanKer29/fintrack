"""SQLAlchemy model for historical asset prices."""

from sqlalchemy import Column, Integer, ForeignKey, Numeric, String, Date
from app.database import Base
from sqlalchemy.orm import relationship


class PriceHistory(Base):
    """
    Historical price data for a specific asset.

    Used for visualizing value evolution over time.
    """
    __tablename__ = "price_history"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    date = Column(Date)
    price = Column(Numeric)
    currency = Column(String)
    asset = relationship("Asset", back_populates="price_history")
