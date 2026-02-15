import requests
import json
import base64
from config import settings
import urllib3

# Disable insecure request warnings for self-signed certs
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class WazuhClient:
    def __init__(self):
        self.base_url = settings.WAZUH_API_URL
        self.user = settings.WAZUH_API_USER
        self.password = settings.WAZUH_API_PASSWORD
        self.token = None

    def authenticate(self):
        """Get JWT token from Wazuh API"""
        url = f"{self.base_url}/security/user/authenticate"
        # Basic Auth for getting token
        auth_str = f"{self.user}:{self.password}"
        b64_auth = base64.b64encode(auth_str.encode()).decode()
        
        headers = {
            "Authorization": f"Basic {b64_auth}"
        }
        
        try:
            response = requests.get(url, headers=headers, verify=False)
            response.raise_for_status()
            self.token = response.json()["data"]["token"]
            return self.token
        except Exception as e:
            print(f"Error authenticating with Wazuh: {e}")
            return None

    def _get_headers(self):
        if not self.token:
            self.authenticate()
        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    def get_agents(self):
        """Fetch all agents"""
        url = f"{self.base_url}/agents"
        try:
            response = requests.get(url, headers=self._get_headers(), verify=False)
            
            # If token expired (401), retry once
            if response.status_code == 401:
                self.authenticate()
                response = requests.get(url, headers=self._get_headers(), verify=False)
                
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching agents: {e}")
            return {"error": str(e), "data": {"items": []}} # Return empty structure on error for safety

    def get_alerts(self):
        """
        Fetch alerts. 
        Note: Wazuh API usually provides configuration/manager info. 
        Alerts are typically indexed in OpenSearch/Elasticsearch.
        However, newer Wazuh APIs might expose query capabilities.
        If strictly API, we might look at `/manager/logs` or similar if alerts are not directly exposed.
        Actually, typical Wazuh setup reads alerts from Indexer (OpenSearch).
        For this MVP, we might Mock this or try to hit Indexer if possible.
        
        Let's try to query the Wazuh Manager for 'alerts' if available, otherwise return mock 
        or implement direct OpenSearch query later.
        
        Wait, standard pattern is:
        Wazuh Manager -> Filebeat/Fluentd -> Indexer
        Frontend/API -> Indexer (Port 9200)
        
        But the user asked for "SOC Service" to connect to "Wazuh Manager".
        Let's assume for now we just get Agents from Manager.
        For Alerts, we might need to query the Indexer (wazuh-indexer:9200).
        
        Let's implement a basic 'get_alerts' that returns dummy data or queries Indexer if requested.
        For now, let's keep it simple: Agents from Manager. Alerts... we'll mock or query Indexer.
        Let's add a placeholder for Indexer query.
        """
        # Placeholder for Alert retrieval
        return {"data": {"items": []}}

wazuh_client = WazuhClient()
