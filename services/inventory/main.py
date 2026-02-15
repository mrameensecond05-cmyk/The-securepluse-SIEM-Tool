from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "inventory-service"}

@app.post("/assets/", response_model=schemas.AssetResponse)
def create_asset(asset: schemas.AssetCreate, db: Session = Depends(database.get_db)):
    db_asset = crud.get_asset_by_ip(db, ip=asset.ip)
    if db_asset:
        raise HTTPException(status_code=400, detail="Asset with this IP already exists")
    return crud.create_asset(db=db, asset=asset)

@app.get("/assets/", response_model=List[schemas.AssetResponse])
def read_assets(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    assets = crud.get_assets(db, skip=skip, limit=limit)
    return assets

@app.get("/assets/{asset_id}", response_model=schemas.AssetResponse)
def read_asset(asset_id: int, db: Session = Depends(database.get_db)):
    db_asset = crud.get_asset(db, asset_id=asset_id)
    if db_asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return db_asset
