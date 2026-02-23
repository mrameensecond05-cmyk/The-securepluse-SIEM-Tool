from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import models, schemas, crud, utils, database

database.wait_for_db(database.engine)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud.create_user(db=db, user=user)

@app.post("/login")
def login(credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    """Simple login - no JWT token, just credential check"""
    user = crud.get_user_by_username(db, username=credentials.username)
    if not user or not utils.verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    # Return a simple token (not JWT) and user info
    access_token = utils.create_access_token(
        data={"sub": user.username, "role": user.role.value}
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role.value}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "auth-service"}
