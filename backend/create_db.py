from app.database import Base, engine
from app.models import user, asset, portfolio, portfolio_asset, transaction, price_history  # 👈 très important d'importer les modèles

print("📦 Création des tables…")
Base.metadata.create_all(bind=engine)
print("✅ Tables créées.")
