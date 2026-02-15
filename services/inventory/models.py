from sqlalchemy import Column, Integer, String, DateTime, Enum
from database import Base
import datetime

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    ip = Column(String(50), unique=True, index=True)
    type = Column(String(50)) # server, workstation, mobile
    os = Column(String(50)) # linux, windows, macos
    status = Column(Enum('online', 'offline', 'warning', name='status_enum'), default='offline')
    last_seen = Column(DateTime, default=datetime.datetime.utcnow)
