# create_db.py
from app.database import Base, engine
from app.models import user, asset, portfolio  # 👈 très important d'importer les modèles

print("📦 Création des tables…")
Base.metadata.create_all(bind=engine)
print("✅ Tables créées.")
