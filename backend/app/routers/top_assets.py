from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.portfolio import Portfolio
from app.models.user import User
from app.schemas.asset import TopAssetOut
from app.core.auth_dependencies import get_current_user
from app.utils.yfinance import get_live_price

router = APIRouter(prefix="/assets", tags=["assets"])

@router.get("/top", response_model=list[TopAssetOut])
def get_top_assets_for_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    portfolios = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    if not portfolios:
        raise HTTPException(status_code=404, detail="No portfolios found")

    top_assets = []

    for portfolio in portfolios:
        for pa in portfolio.assets:
            asset = pa.asset
            if not asset or not asset.ticker:
                continue

            live_price = get_live_price(asset.ticker)
            if live_price is None:
                continue

            current_value = float(pa.quantity) * live_price

            top_assets.append({
                "ticker": asset.ticker,
                "name": asset.name,
                "type": asset.type,
                "current_value": round(current_value, 2),
            })

    # Grouper par ticker
    merged = {}
    for a in top_assets:
        if a["ticker"] in merged:
            merged[a["ticker"]]["current_value"] += a["current_value"]
        else:
            merged[a["ticker"]] = a

    sorted_assets = sorted(merged.values(), key=lambda x: x["current_value"], reverse=True)
    return sorted_assets[:5]
