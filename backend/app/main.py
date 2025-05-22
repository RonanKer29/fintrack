"""Main entrypoint for the FastAPI application."""
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from dotenv import load_dotenv

from app.routers import base, auth, asset, portfolio_assets, portfolios, users, transactions, price_history, dashboard, distribution, top_assets

load_dotenv()  # Load environment variables from .env

app = FastAPI()

# Autoriser les requêtes venant du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(base.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(asset.router)
app.include_router(portfolios.router)
app.include_router(portfolio_assets.router)
app.include_router(transactions.router)
app.include_router(price_history.router)
app.include_router(dashboard.router)
app.include_router(distribution.router)
app.include_router(top_assets.router)
