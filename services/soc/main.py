from fastapi import FastAPI, HTTPException, Request
from wazuh_client import wazuh_client
import config

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "soc-service"}

@app.get("/agents")
def get_agents():
    """Proxy to get agents from Wazuh"""
    data = wazuh_client.get_agents()
    return data

@app.get("/alerts")
def get_alerts():
    """Get security alerts"""
    # In a full implementation, this would query wazuh-indexer (Opensearch)
    # For now, we return the structure or mock
    return {
        "data": {
            "items": [
                {
                    "id": "1",
                    "timestamp": "2024-02-15T10:00:00",
                    "rule": {"level": 12, "description": "SSH Brute Force"},
                    "agent": {"name": "Web-Server-01", "ip": "192.168.1.10"}
                },
                {
                    "id": "2",
                    "timestamp": "2024-02-15T10:05:00",
                    "rule": {"level": 7, "description": "New user created"},
                    "agent": {"name": "DB-Server", "ip": "192.168.1.20"}
                }
            ],
            "totalItems": 2
        }
    }
