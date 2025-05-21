"""Base route for health check and root info."""

from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_root():
    """
    Root endpoint to check if the API is running.
    """
    return {"message": "Hello from Fintrack API"}
