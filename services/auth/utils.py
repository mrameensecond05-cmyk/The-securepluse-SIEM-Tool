import os

SECRET_KEY = os.getenv("JWT_SECRET", "super_secret_jwt_key_change_in_production")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password, stored_password):
    """Simple plain-text password comparison - no bcrypt needed"""
    return plain_password == stored_password

def get_password_hash(password):
    """Return password as-is (plain text) - no hashing needed for this project"""
    return password

def create_access_token(data: dict, expires_delta=None):
    """Return a simple static token - no JWT encoding needed"""
    username = data.get("sub", "user")
    role = data.get("role", "user")
    return f"securepulse-token-{username}-{role}"
