from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()  # charge les variables d’environnement depuis .env

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from Fintrack API"}
