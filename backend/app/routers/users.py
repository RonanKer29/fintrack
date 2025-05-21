"""API routes for user-related operations."""

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.core.auth import hash_password  # ✅ passlib

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    """
    Create a new user in the database.

    Args:
        user (UserCreate): The user input data (email + password).
        db (Session): The database session.

    Returns:
        UserOut: The newly created user (without password).
    """
    # Vérifie que l'email n'est pas déjà utilisé
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash du mot de passe avec passlib
    hashed_pwd = hash_password(user.password)

    new_user = User(email=user.email, hashed_password=hashed_pwd, username=user.username)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
