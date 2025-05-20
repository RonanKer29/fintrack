import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Charger les variables d’environnement depuis .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Création du moteur SQLAlchemy
engine = create_engine(DATABASE_URL)

# Création d'une session de base
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe de base pour les modèles ORM
Base = declarative_base()
