"""Authentication routes for logging in and retrieving JWT tokens."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserLogin, Token
from app.schemas.user import UserOut
from app.core.auth import verify_password
from app.core.token_utils import create_access_token
from app.core.auth_dependencies import get_current_user

router = APIRouter(tags=["auth"])

@router.post("/login", response_model=Token, summary="Authenticate user and get JWT")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT token.

    - **email**: user's email
    - **password**: raw password

    Returns:
    - `access_token`: the JWT token
    - `token_type`: "bearer"
    """
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut, summary="Get current user's profile")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Return the authenticated user's profile.

    Requires a valid JWT token in the `Authorization` header:
    ```
    Authorization: Bearer <your_token_here>
    ```
    """
    return current_user
