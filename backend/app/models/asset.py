from sqlalchemy import Column, Integer, String, DateTime, Enum, func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class AssetTypeEnum(str, enum.Enum):
    stock = "stock"
    etf = "etf"
    crypto = "crypto"

class Asset(Base):
    """
    Représente un actif financier : action, ETF ou crypto.
    """
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, nullable=False, unique=True)
    name = Column(String)
    type = Column(Enum(AssetTypeEnum), nullable=False)  # ENUM explicite
    currency = Column(String)  # ex: USD, EUR, CHF
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    asset_portfolios = relationship("PortfolioAsset", back_populates="asset")
    price_history = relationship("PriceHistory", back_populates="asset", cascade="all, delete")
