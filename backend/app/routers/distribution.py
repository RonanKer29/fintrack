from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portfolio import Portfolio
from app.core.auth_dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/portfolios", tags=["Portfolios"])

@router.get("/distribution")
def get_portfolio_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    distribution = {"stock": 0.0, "etf": 0.0, "crypto": 0.0}

    for pa in portfolio.assets:
        asset = pa.asset
        if asset and asset.type and asset.type.lower() in distribution:
            type_key = asset.type.lower()
            distribution[type_key] += float(pa.quantity) * float(pa.average_price)

    return distribution
