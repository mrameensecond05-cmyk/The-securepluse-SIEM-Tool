import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PORT = int(os.getenv("PORT", 8003))
    
    # Wazuh API
    WAZUH_API_URL = os.getenv("WAZUH_API_URL", "https://wazuh-manager:55000")
    WAZUH_API_USER = os.getenv("WAZUH_API_USER", "wazuh")
    WAZUH_API_PASSWORD = os.getenv("WAZUH_API_PASSWORD", "wazuh") # Default for testing, should be secure
    
    # Auth Service URL (for token validation if needed locally, though API Gateway handles validation)
    AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001")

settings = Settings()
