"""Main entrypoint for the FastAPI application."""

from fastapi import FastAPI
from dotenv import load_dotenv
from app.routes import user, base, auth

load_dotenv()  # Load environment variables from .env

app = FastAPI()

# Register routers
app.include_router(base.router)
app.include_router(user.router)
app.include_router(auth.router)
