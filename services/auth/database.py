from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DB_USER = os.getenv("DB_USER", "securepulse_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "securepulse_password")
DB_HOST = os.getenv("DB_HOST", "mysql")
DB_NAME = "securepulse"

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def wait_for_db(engine):
    import time
    from sqlalchemy.exc import OperationalError
    
    print("Waiting for database connection...")
    retries = 30
    delay = 2
    
    for i in range(retries):
        try:
            connection = engine.connect()
            connection.close()
            print("Database connected!")
            return
        except OperationalError:
            print(f"Database not ready. Retrying in {delay} seconds... ({i+1}/{retries})")
            time.sleep(delay)
    
    raise Exception("Could not connect to database after multiple retries.")
