import yfinance as yf  # type: ignore

def get_live_price(ticker: str) -> float | None:
    """Récupère le dernier prix connu pour un ticker via yfinance"""
    try:
        data = yf.Ticker(ticker) # type: ignore
        return data.fast_info["last_price"]
    except Exception as e:
        print(f"❌ Erreur récupération prix pour {ticker}: {e}")
        return None
