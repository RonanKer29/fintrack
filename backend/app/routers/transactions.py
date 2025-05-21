"""API routes for managing portfolio transactions."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db

from app.models.transaction import Transaction
from app.models.portfolio import Portfolio
from app.models.asset import Asset
from app.schemas.transaction import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionResponse)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new transaction (buy/sell/dividend) linked to a portfolio and asset.
    """
    if transaction.asset_id:
        db_asset = db.query(Asset).filter(Asset.id == transaction.asset_id).first()
        if not db_asset:
            raise HTTPException(status_code=404, detail="Asset not found")

    if transaction.portfolio_id:
        db_portfolio = db.query(Portfolio).filter(Portfolio.id == transaction.portfolio_id).first()
        if not db_portfolio:
            raise HTTPException(status_code=404, detail="Portfolio not found")

    new_tx = Transaction(**transaction.dict())
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx


@router.get("/portfolio/{portfolio_id}", response_model=list[TransactionResponse])
def get_transactions_by_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    """
    Get all transactions linked to a specific portfolio.
    """
    return db.query(Transaction).filter(Transaction.portfolio_id == portfolio_id).all()
