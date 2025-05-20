from app.database import SessionLocal
from sqlalchemy import text

def test_db():
    db = SessionLocal()
    try:
        result = db.execute(text("SELECT 1"))
        print("✅ Connexion réussie :", result.scalar())
    finally:
        db.close()

test_db()
