"""Pydantic schemas for the User model (API input/output)."""

from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """
    Shared base schema for User (used in input/output).

    Attributes:
        email (EmailStr): Email address of the user.
    """
    email: EmailStr
    username: str  # ← AJOUTÉ


class UserCreate(UserBase):
    """
    Schema for creating a new user (input only).

    Attributes:
        password (str): Raw password (will be hashed in backend).
    """
    password: str


class UserOut(UserBase):
    """
    Schema for returning a user (output only).

    Attributes:
        id (int): Unique user ID.
        created_at (datetime): Timestamp of user creation.
    """
    id: int
    created_at: datetime

    class Config:
        """Required to convert SQLAlchemy models to Pydantic"""
        orm_mode = True
