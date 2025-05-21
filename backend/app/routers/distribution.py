from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portfolio import Portfolio

router = APIRouter(prefix="/portfolios", tags=["Portfolios"])

@router.get("/{portfolio_id}/distribution")
def get_portfolio_distribution(portfolio_id: int, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    distribution = {"stock": 0.0, "etf": 0.0, "crypto": 0.0}

    for pa in portfolio.assets:
        asset = pa.asset
        if asset and asset.type and asset.type.lower() in distribution:
            type_key = asset.type.lower()  # handle "ETF", "Stock" capitalization
            distribution[type_key] += float(pa.quantity) * float(pa.average_price)

    return distribution
