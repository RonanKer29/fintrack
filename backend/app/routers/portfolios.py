"""API routes for managing portfolios."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.portfolio import PortfolioCreate, PortfolioOut
from app.schemas.realtime import AssetRealtimePerformance  # ✅ nouveau schéma
from app.models.portfolio import Portfolio
from app.models.portfolio_asset import PortfolioAsset
from app.core.auth_dependencies import get_current_user
from app.models.user import User
from app.utils.yfinance import get_live_price

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


@router.get("/{portfolio_id}/realtime-distribution", response_model=list[AssetRealtimePerformance])
def get_realtime_distribution(
    portfolio_id: int,
    db: Session = Depends(get_db)
):
    """
    Return the real-time value and performance for each asset in the given portfolio.
    """
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    result = []

    for pa in portfolio.assets:
        asset = pa.asset
        if not asset or not asset.ticker:
            continue

        current_price = get_live_price(asset.ticker)
        if current_price is None:
            continue  # Skip if failed

        quantity = float(pa.quantity)
        average_price = float(pa.average_price)
        value = quantity * current_price
        gain = (current_price - average_price) * quantity

        # ✅ Calcul du pourcentage de gain
        try:
            percentage_gain = ((current_price - average_price) / average_price) * 100
        except ZeroDivisionError:
            percentage_gain = 0.0

        result.append({
            "ticker": asset.ticker,
            "type": asset.type,
            "quantity": quantity,
            "average_price": round(average_price, 2),
            "current_price": round(current_price, 2),
            "value": round(value, 2),
            "gain": round(gain, 2),
            "percentage_gain": round(percentage_gain, 2),
        })

    return result
