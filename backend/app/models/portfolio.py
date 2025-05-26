from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from app.database import Base

class Portfolio(Base):
    """
    Represents a user's investment portfolio.
    Enforced: one-to-one relationship with User (1 user = 1 portfolio)
    """
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)  # 👈 unique constraint here
    is_public = Column(Boolean, default=False)
    title = Column(String)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relations
    user = relationship("User", back_populates="portfolio")  # 👈 rename to singular
    assets = relationship("PortfolioAsset", back_populates="portfolio", cascade="all, delete-orphan")
