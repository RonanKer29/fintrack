from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import yfinance as yf

router = APIRouter()

@router.get("/search-asset")
def search_asset(q: str = Query(...)):
    try:
        ticker = yf.Ticker(q.upper())
        info = ticker.info
        fast_info = ticker.fast_info  # Pour accéder au prix actuel + performant

        # Vérifie qu'on a bien un nom et un symbole
        if not info or not info.get("shortName") or not info.get("symbol"):
            raise ValueError("Informations insuffisantes")

        quote_type = info.get("quoteType", "").lower()
        symbol = info.get("symbol", q.upper())

        # Détection du type de l’asset
        if "etf" in quote_type:
            asset_type = "etf"
        elif "crypto" in quote_type or "-usd" in symbol.lower():
            asset_type = "crypto"
        elif "equity" in quote_type or "stock" in quote_type:
            asset_type = "stock"
        else:
            asset_type = "unknown"

        return {
            "symbol": symbol,
            "name": info.get("shortName", symbol),
            "currency": info.get("currency", "USD"),
            "type": asset_type,
            "current_price": fast_info.get("last_price")  # Prix en temps réel
        }

    except Exception as e:
        return JSONResponse(
            status_code=404,
            content={"error": f"Asset introuvable ou non valide : {str(e)}"}
        )
