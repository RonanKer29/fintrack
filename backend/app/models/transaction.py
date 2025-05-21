"""SQLAlchemy model for transactions (buy, sell, dividend)."""

from sqlalchemy import Column, Integer, ForeignKey, Numeric, String, Date
from sqlalchemy.orm import relationship
from app.database import Base


class Transaction(Base):
    """
    Represents a transaction linked to a portfolio and an asset.

    Can be of type: 'buy', 'sell', or 'dividend'.
    """
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=True)

    type = Column(String)  # buy, sell, dividend
    quantity = Column(Numeric)
    price = Column(Numeric)
    currency = Column(String)
    date = Column(Date)

    # Relationships (optionnels à développer plus tard)
    user = relationship("User", back_populates="transactions", lazy="joined")
    asset = relationship("Asset")
    portfolio = relationship("Portfolio")
