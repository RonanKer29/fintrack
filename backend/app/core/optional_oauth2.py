"""Custom OAuth2 scheme that allows optional token."""

from fastapi.security import OAuth2PasswordBearer
from fastapi import Request

class OAuth2PasswordBearerOptional(OAuth2PasswordBearer):
    async def __call__(self, request: Request) -> str | None:
        authorization: str | None = request.headers.get("Authorization")
        if not authorization:
            return None  # No token → public access
        return await super().__call__(request)
