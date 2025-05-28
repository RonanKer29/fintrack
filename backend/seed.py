"""Seed file to reset the DB and insert one test entry per table."""

from app.database import Base, engine, SessionLocal
from app.models import user, asset, portfolio, portfolio_asset, transaction, price_history
from datetime import date, timedelta
from passlib.context import CryptContext
import random

# Init
db = SessionLocal()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

print("🔥 Dropping all tables...")
Base.metadata.drop_all(bind=engine)

print("📦 Creating all tables...")
Base.metadata.create_all(bind=engine)

# 👤 User
hashed_pwd = pwd_context.hash("test1234")
user_obj = user.User(email="test@example.com", hashed_password=hashed_pwd, username="test")
db.add(user_obj)
db.commit()
db.refresh(user_obj)

# 📈 Assets (ETF, Stock, Crypto)
asset_etf = asset.Asset(
    ticker="VTI",
    name="Vanguard Total Stock Market ETF",
    type="etf",
    currency="USD"
)
asset_stock = asset.Asset(
    ticker="AAPL",
    name="Apple Inc.",
    type="stock",
    currency="USD"
)
asset_msft = asset.Asset(
    ticker="MSFT",
    name="Microsoft",
    type="stock",
    currency="USD"
)
asset_crypto = asset.Asset(
    ticker="BTC",
    name="Bitcoin",
    type="crypto",
    currency="USD"
)

db.add_all([asset_etf, asset_stock, asset_crypto, asset_msft])
db.commit()
db.refresh(asset_etf)
db.refresh(asset_stock)
db.refresh(asset_crypto)

# 💼 Portfolio
portfolio_obj = portfolio.Portfolio(
    user_id=user_obj.id,
    title="Portefeuille Test",
    description="Portefeuille pour tests",
    is_public=False
)
db.add(portfolio_obj)
db.commit()
db.refresh(portfolio_obj)

# 🔗 PortfolioAssets (liés aux 3 types)
pa_etf = portfolio_asset.PortfolioAsset(
    portfolio_id=portfolio_obj.id,
    asset_id=asset_etf.id,
    quantity=15,
    average_price=205.0,
    purchase_date=date(2024, 1, 1),
    currency="USD"
)
pa_stock = portfolio_asset.PortfolioAsset(
    portfolio_id=portfolio_obj.id,
    asset_id=asset_stock.id,
    quantity=10,
    average_price=180.0,
    purchase_date=date(2024, 2, 1),
    currency="USD"
)
pa_crypto = portfolio_asset.PortfolioAsset(
    portfolio_id=portfolio_obj.id,
    asset_id=asset_crypto.id,
    quantity=0.05,
    average_price=60000.0,
    purchase_date=date(2024, 3, 1),
    currency="USD"
)
pa_msft = portfolio_asset.PortfolioAsset(
    portfolio_id=portfolio_obj.id,
    asset_id=asset_msft.id,
    quantity=15,
    average_price=350.0,
    purchase_date=date(2024, 4, 15),
    currency="USD"
)

db.add_all([pa_etf, pa_stock, pa_crypto, pa_msft])
db.commit()

# 🔁 Transactions (uniquement sur VTI pour l'exemple)
transactions_data = [
    {"type": "buy", "quantity": 10, "price": 200.0, "date": date(2024, 1, 1)},
    {"type": "buy", "quantity": 5, "price": 210.0, "date": date(2024, 2, 1)},
    {"type": "dividend", "quantity": None, "price": 5.0, "date": date(2024, 3, 1)},
    {"type": "sell", "quantity": 3, "price": 220.0, "date": date(2024, 4, 1)},
]

for tx in transactions_data:
    tx_obj = transaction.Transaction(
        user_id=user_obj.id,
        asset_id=asset_etf.id,
        portfolio_id=portfolio_obj.id,
        type=tx["type"],
        quantity=tx["quantity"],
        price=tx["price"],
        currency="USD",
        date=tx["date"]
    )
    db.add(tx_obj)

db.commit()

# 📉 Price History (3 mois dynamiques pour VTI, AAPL, MSFT)
today = date.today()
start_date = today - timedelta(days=89)  # 90 jours de données

price_history_entries = []

for i in range(90):
    current_date = start_date + timedelta(days=i)
    price_history_entries += [
        price_history.PriceHistory(
            asset_id=asset_etf.id,
            date=current_date,
            price=210 + random.uniform(-5, 5),
            currency='USD'
        ),
        price_history.PriceHistory(
            asset_id=asset_stock.id,
            date=current_date,
            price=180 + random.uniform(-5, 5),
            currency='USD'
        ),
        price_history.PriceHistory(
            asset_id=asset_msft.id,
            date=current_date,
            price=350 + random.uniform(-10, 10),
            currency='USD'
        ),
    ]

db.add_all(price_history_entries)
db.commit()

print("✅ Seed completed successfully.")
db.close()
