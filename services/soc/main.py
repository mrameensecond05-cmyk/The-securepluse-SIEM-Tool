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
                    "timestamp": "2024-02-21T12:00:00Z",
                    "rule": {"level": 12, "description": "SSH Brute Force"},
                    "agent": {"name": "Web-Server-01", "ip": "internal-srv-10"}
                },
                {
                    "id": "2",
                    "timestamp": "2024-02-21T12:05:00Z",
                    "rule": {"level": 7, "description": "New user created in /etc/passwd"},
                    "agent": {"name": "DB-Server", "ip": "internal-db-20"}
                },
                {
                    "id": "3",
                    "timestamp": "2024-02-21T12:15:00Z",
                    "rule": {"level": 15, "description": "Kernel exploit attempt (CVE-2024-XXXX)"},
                    "agent": {"name": "Gateway-Firewall", "ip": "external-gw-vpn"}
                },
                {
                    "id": "4",
                    "timestamp": "2024-02-21T12:30:00Z",
                    "rule": {"level": 10, "description": "Unauthorized SQL dump detected"},
                    "agent": {"name": "Backup-Vault", "ip": "internal-backup-30"}
                },
                {
                    "id": "5",
                    "timestamp": "2024-02-21T12:45:00Z",
                    "rule": {"level": 5, "description": "Anomalous outbound traffic to unknown ASN"},
                    "agent": {"name": "Marketing-VM", "ip": "marketing-vlan-15"}
                }
            ],
            "totalItems": 5
        }
    }
