"""SQLAlchemy model for the User table."""

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    """
    ORM model for the 'users' table.

    Attributes:
        id (int): Primary key, auto-incremented.
        email (str): Unique email address of the user.
        hashed_password (str): User's password, hashed.
        created_at (datetime): Timestamp of user creation, default to current time.
        username (str): Unique display name.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # type: ignore
    username = Column(String, unique=True, nullable=False)

    # Relations
    portfolio = relationship("Portfolio", uselist=False, back_populates="user", cascade="all, delete")  # 🔁 1:1
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete")
