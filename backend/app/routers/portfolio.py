"""API routes for managing portfolios."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.schemas.portfolio import PortfolioCreate, PortfolioOut
from app.schemas.realtime import AssetRealtimePerformance  # ✅ nouveau schéma
from app.models.portfolio import Portfolio

from app.core.auth_dependencies import get_current_user
from app.models.user import User
from app.utils.yfinance import get_live_price
from app.models import price_history


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
    Prevents creating more than one.
    """
    existing = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already has a portfolio")

    new_portfolio = Portfolio(
        user_id=current_user.id,
        **portfolio.dict()
    )
    db.add(new_portfolio)
    db.commit()
    db.refresh(new_portfolio)
    return new_portfolio



@router.get("/mine", response_model=PortfolioOut)
def get_my_portfolio(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the unique portfolio owned by the authenticated user.
    """
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio



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


@router.get("/performance")
def get_portfolio_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns the global performance of the user's portfolio:
    - current total value
    - total cost basis
    - absolute and percentage gain/loss
    """
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    total_cost = 0.0
    total_value = 0.0

    for pa in portfolio.assets:
        asset = pa.asset
        if not asset or not asset.ticker:
            continue

        current_price = get_live_price(asset.ticker)
        if current_price is None:
            continue

        quantity = float(pa.quantity)
        avg_price = float(pa.average_price)

        total_cost += quantity * avg_price
        total_value += quantity * current_price

    gain = total_value - total_cost
    try:
        percentage_gain = (gain / total_cost) * 100
    except ZeroDivisionError:
        percentage_gain = 0.0

    return {
        "total_cost": round(total_cost, 2),
        "current_value": round(total_value, 2),
        "gain": round(gain, 2),
        "percentage_gain": round(percentage_gain, 2),
    }


@router.get("/performance-history")
def get_portfolio_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.utils.yfinance import get_live_price  # si ce n’est pas déjà importé

    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    asset_ids = [pa.asset_id for pa in portfolio.assets]
    if not asset_ids:
        return []

    # Récupère toutes les dates disponibles dans PriceHistory
    dates = (
        db.query(price_history.PriceHistory.date)
        .filter(price_history.PriceHistory.asset_id.in_(asset_ids))
        .distinct()
        .order_by(price_history.PriceHistory.date)
        .all()
    )

    history = []
    for (d,) in dates:
        total = 0.0
        for pa in portfolio.assets:
            price = (
                db.query(price_history.PriceHistory.price)
                .filter(price_history.PriceHistory.asset_id == pa.asset_id)
                .filter(price_history.PriceHistory.date == d)
                .first()
            )
            if price:
                total += float(pa.quantity) * float(price[0])

        history.append({
            "date": d.isoformat(),
            "value": round(total, 2),
        })

    # Ajouter point d'aujourd'hui (live)
    live_value = 0.0
    for pa in portfolio.assets:
        asset = pa.asset
        if not asset or not asset.ticker:
            continue
        price = get_live_price(asset.ticker)
        if price is None:
            continue
        live_value += float(pa.quantity) * price

    history.append({
        "date": date.today().isoformat(),
        "value": round(live_value, 2),
    })

    return history
