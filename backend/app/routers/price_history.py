"""API routes for managing asset price history."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

from app.models.price_history import PriceHistory
from app.schemas.price_history import PriceHistoryCreate, PriceHistoryResponse

router = APIRouter(prefix="/prices", tags=["Price History"])


@router.post("/", response_model=PriceHistoryResponse)
def add_price_entry(
    entry: PriceHistoryCreate,
    db: Session = Depends(get_db),
):
    """
    Add a new historical price entry for an asset.
    """
    price = PriceHistory(**entry.dict())
    db.add(price)
    db.commit()
    db.refresh(price)
    return price


@router.get("/{asset_id}", response_model=list[PriceHistoryResponse])
def get_price_history(asset_id: int, db: Session = Depends(get_db)):
    """
    Get all historical prices for a given asset.
    """
    return db.query(PriceHistory).filter(PriceHistory.asset_id == asset_id).order_by(PriceHistory.date).all()
