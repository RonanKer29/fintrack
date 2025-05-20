"""Pydantic schemas for authentication (login and token)."""

from pydantic import BaseModel, EmailStr

class UserLogin(BaseModel):
    """
    Schema used for user login.

    Attributes:
        email (EmailStr): User's email address.
        password (str): Raw password to be checked.
    """
    email: EmailStr
    password: str


class Token(BaseModel):
    """
    Schema returned after successful login.

    Attributes:
        access_token (str): The JWT token.
        token_type (str): Usually "bearer".
    """
    access_token: str
    token_type: str = "bearer"
