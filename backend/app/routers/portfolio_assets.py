"""API routes for managing assets within portfolios."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db

from app.models.portfolio_asset import PortfolioAsset
from app.models.portfolio import Portfolio
from app.models.asset import Asset
from app.schemas.portfolio_asset import PortfolioAssetCreate, PortfolioAssetResponse

router = APIRouter(prefix="/portfolio-assets", tags=["Portfolio Assets"])


@router.post("/", response_model=PortfolioAssetResponse)
def add_asset_to_portfolio(
    portfolio_asset: PortfolioAssetCreate,
    db: Session = Depends(get_db),
):
    """
    Add a new asset to a portfolio.

    Validates that both the portfolio and the asset exist before creating
    the portfolio-asset association.
    """
    db_portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_asset.portfolio_id).first()
    if not db_portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    db_asset = db.query(Asset).filter(Asset.id == portfolio_asset.asset_id).first()
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    new_entry = PortfolioAsset(**portfolio_asset.dict())
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry


@router.get("/{portfolio_id}", response_model=list[PortfolioAssetResponse])
def get_portfolio_assets(portfolio_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all assets within a specific portfolio.

    Returns a list of portfolio-asset relationships for the given portfolio ID.
    """
    return db.query(PortfolioAsset).filter(PortfolioAsset.portfolio_id == portfolio_id).all()
