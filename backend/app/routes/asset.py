"""API routes for managing financial assets."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.asset import Asset
from app.schemas.asset import AssetCreate, AssetOut

router = APIRouter(
    prefix="/assets",
    tags=["assets"]
)


@router.get("/", response_model=list[AssetOut])
def get_assets(db: Session = Depends(get_db)):
    """
    Retrieve all available financial assets.
    """
    return db.query(Asset).all()


@router.post("/", response_model=AssetOut, status_code=201)
def create_asset(asset: AssetCreate, db: Session = Depends(get_db)):
    """
    Create a new asset (stock, ETF, crypto).

    Duplicate tickers are not allowed.
    """
    existing = db.query(Asset).filter(Asset.ticker == asset.ticker).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ticker already exists")

    new_asset = Asset(**asset.dict())
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)

    return new_asset
