"""API routes for managing portfolios."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.portfolio import PortfolioCreate, PortfolioOut
from app.models.portfolio import Portfolio
from app.core.auth_dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/portfolios",
    tags=["portfolios"]
)


@router.post("/", response_model=PortfolioOut, status_code=201)
def create_portfolio(
    portfolio: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new portfolio for the authenticated user.
    """
    new_portfolio = Portfolio(
        user_id=current_user.id,
        **portfolio.dict()
    )
    db.add(new_portfolio)
    db.commit()
    db.refresh(new_portfolio)
    return new_portfolio


@router.get("/mine", response_model=list[PortfolioOut])
def get_my_portfolios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all portfolios owned by the authenticated user.
    """
    return db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
