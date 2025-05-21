from pydantic import BaseModel

class AssetRealtimePerformance(BaseModel):
    ticker: str
    type: str
    quantity: float
    average_price: float
    current_price: float
    value: float
    gain: float
    percentage_gain: float
