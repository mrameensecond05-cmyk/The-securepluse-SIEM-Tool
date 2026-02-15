from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AssetBase(BaseModel):
    name: str
    ip: str
    type: str
    os: str
    status: Optional[str] = "offline"

class AssetCreate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: int
    last_seen: datetime

    class Config:
        from_attributes = True
