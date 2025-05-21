from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.auth_dependencies import get_current_user
from app.models import portfolio_asset, asset, price_history, portfolio
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retourne uniquement la valeur totale actuelle du portefeuille de l'utilisateur (en USD).

    🔐 Nécessite une authentification (JWT Bearer).
    """
    assets = (
    db.query(portfolio_asset.PortfolioAsset)
    .join(portfolio.Portfolio)  # JOIN explicite avec le bon modèle
    .filter(portfolio.Portfolio.user_id == current_user.id)
    .all()
)


    total_value = 0

    for pa in assets:
        latest_price = (
            db.query(price_history.PriceHistory)
            .filter(price_history.PriceHistory.asset_id == pa.asset_id)
            .order_by(price_history.PriceHistory.date.desc())
            .first()
        )

        if latest_price:
            total_value += pa.quantity * latest_price.price

    return {
        "total_value": round(total_value, 2)
    }


@router.get("/dashboard/debug-assets")
def debug_assets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Étape 1 : check utilisateur
    print("👤 Utilisateur connecté :", current_user.id)

    # Étape 2 : check portefeuilles
    portfolios = db.query(portfolio.Portfolio).filter(portfolio.Portfolio.user_id == current_user.id).all()
    print(f"📁 Portefeuilles de l'utilisateur : {[p.id for p in portfolios]}")

    # Étape 3 : check portfolio_assets
    assets = (
        db.query(portfolio_asset.PortfolioAsset)
        .filter(portfolio_asset.PortfolioAsset.portfolio_id.in_([p.id for p in portfolios]))
        .all()
    )

    print("🔗 PortfolioAssets récupérés :", assets)

    return {
        "nb_assets": len(assets),
        "data": [f"{a.asset_id} - {a.quantity}" for a in assets]
    }
