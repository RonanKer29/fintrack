"""Script pour créer les tables de la base PostgreSQL avec SQLAlchemy."""

from app.database import Base, engine
from app.models import user  # ⚠️ importe tous les modèles ici !

print("📦 Création des tables…")
Base.metadata.create_all(bind=engine)
print("✅ Tables créées.")
