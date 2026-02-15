from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime

def get_asset(db: Session, asset_id: int):
    return db.query(models.Asset).filter(models.Asset.id == asset_id).first()

def get_asset_by_ip(db: Session, ip: str):
    return db.query(models.Asset).filter(models.Asset.ip == ip).first()

def get_assets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Asset).offset(skip).limit(limit).all()

def create_asset(db: Session, asset: schemas.AssetCreate):
    db_asset = models.Asset(
        name=asset.name,
        ip=asset.ip,
        type=asset.type,
        os=asset.os,
        status=asset.status,
        last_seen=datetime.utcnow()
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def update_asset_status(db: Session, ip: str, status: str):
    db_asset = get_asset_by_ip(db, ip)
    if db_asset:
        db_asset.status = status
        db_asset.last_seen = datetime.utcnow()
        db.commit()
        db.refresh(db_asset)
    return db_asset
