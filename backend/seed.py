"""Seed file to reset the DB and insert one test entry per table."""

from app.database import Base, engine, SessionLocal
from app.models import user, asset, portfolio, portfolio_asset, transaction, price_history
from datetime import date, timedelta
from passlib.context import CryptContext

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

# 📈 Asset
asset_obj = asset.Asset(
    ticker="VTI",
    name="Vanguard Total Stock Market ETF",
    type="ETF",
    currency="USD"
)
db.add(asset_obj)
db.commit()
db.refresh(asset_obj)

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

# 🔗 PortfolioAsset
pa_obj = portfolio_asset.PortfolioAsset(
    portfolio_id=portfolio_obj.id,
    asset_id=asset_obj.id,
    quantity=15,
    average_price=205.0,
    purchase_date=date(2024, 1, 1),
    currency="USD"
)
db.add(pa_obj)
db.commit()
db.refresh(pa_obj)

# 🔁 Transactions (multi)
transactions_data = [
    {"type": "buy", "quantity": 10, "price": 200.0, "date": date(2024, 1, 1)},
    {"type": "buy", "quantity": 5, "price": 210.0, "date": date(2024, 2, 1)},
    {"type": "dividend", "quantity": None, "price": 5.0, "date": date(2024, 3, 1)},
    {"type": "sell", "quantity": 3, "price": 220.0, "date": date(2024, 4, 1)},
]

for tx in transactions_data:
    tx_obj = transaction.Transaction(
        user_id=user_obj.id,
        asset_id=asset_obj.id,
        portfolio_id=portfolio_obj.id,
        type=tx["type"],
        quantity=tx["quantity"],
        price=tx["price"],
        currency="USD",
        date=tx["date"]
    )
    db.add(tx_obj)

db.commit()

# 📉 Price History (today & 7 days ago)
today = date.today()
seven_days_ago = today - timedelta(days=7)

price_history_entries = [
    price_history.PriceHistory(
        asset_id=asset_obj.id,
        date=seven_days_ago,
        price=210.0,
        currency="USD"
    ),
    price_history.PriceHistory(
        asset_id=asset_obj.id,
        date=today,
        price=220.0,
        currency="USD"
    ),
]

db.add_all(price_history_entries)
db.commit()

print("✅ Seed completed successfully.")
db.close()
