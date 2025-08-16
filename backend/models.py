from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# Website Status Models
class WebsiteStatusCreate(BaseModel):
    website: str
    status: str
    responseTime: int
    statusCode: int

class WebsiteStatus(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    website: str
    status: str  # online, offline, degraded
    responseTime: int
    statusCode: int
    checkedAt: datetime = Field(default_factory=datetime.utcnow)
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class WebsiteStatusResponse(BaseModel):
    website: str
    status: str
    responseTime: int
    lastChecked: datetime
    statusCode: int

class UptimeHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    website: str
    hour: int  # 0-23
    date: str  # YYYY-MM-DD
    uptime: float
    incidents: int
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class WebsiteStatusOverview(BaseModel):
    websites: Dict[str, WebsiteStatusResponse]
    overall: str  # operational, degraded, outage
    lastUpdated: datetime

class UptimeData(BaseModel):
    hour: int
    percentage: float
    incidents: int

class UptimeResponse(BaseModel):
    uptime: List[UptimeData]