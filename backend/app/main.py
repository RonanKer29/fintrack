"""Main entrypoint for the FastAPI application."""

from fastapi import FastAPI
from dotenv import load_dotenv

from app.routers import base, auth, asset, portfolio_assets, portfolios, users, transactions, price_history

load_dotenv()  # Load environment variables from .env

app = FastAPI()

# Register routers
app.include_router(base.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(asset.router)
app.include_router(portfolios.router)
app.include_router(portfolio_assets.router)
app.include_router(transactions.router)
app.include_router(price_history.router)
