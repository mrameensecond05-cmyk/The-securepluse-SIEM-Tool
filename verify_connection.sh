#!/bin/bash

# SecurePulse Connection Verification Script
# This script checks the status of Agent -> Manager -> Dashboard connectivity.

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================================================${NC}"
echo -e "${BLUE}       SecurePulse SIEM - Connection Verification Script        ${NC}"
echo -e "${BLUE}================================================================${NC}"

# 1. Check Docker Containers
echo -e "\n${YELLOW}[1/4] Checking Docker Containers...${NC}"
services=("wazuh-manager" "wazuh-indexer" "wazuh-dashboard" "soc-service")
for service in "${services[@]}"; do
    if sudo docker ps | grep -q "$service"; then
        echo -e "  ${GREEN}✔${NC} $service is running"
    else
        echo -e "  ${RED}✘${NC} $service is NOT running"
    fi
done

# 2. Check Manager Ports
echo -e "\n${YELLOW}[2/4] Checking Manager Ports (1514, 1515, 55000)...${NC}"
ports=(1514 1515 55000)
for port in "${ports[@]}"; do
    if sudo ss -tuln | grep -q ":$port "; then
        echo -e "  ${GREEN}✔${NC} Port $port is listening"
    else
        echo -e "  ${RED}✘${NC} Port $port is NOT listening"
    fi
done

# 3. Check Wazuh API Connectivity
echo -e "\n${YELLOW}[3/4] Testing Wazuh API Credentials...${NC}"
W_USER="wazuh"
W_PASS=$(grep WAZUH_API_PASSWORD .env | cut -d'=' -f2)

TOKEN=$(curl -u "$W_USER:$W_PASS" -k -s -X POST "https://localhost:55000/security/user/authenticate")
if echo "$TOKEN" | grep -q "token"; then
    echo -e "  ${GREEN}✔${NC} Manager API Authentication Successful"
    AUTH_TOKEN=$(echo "$TOKEN" | jq -r '.data.token')
    
    # Check Agents
    AGENT_COUNT=$(curl -k -s -X GET "https://localhost:55000/agents?pretty=true" -H "Authorization: Bearer $AUTH_TOKEN" | jq -r '.data.total_affected_items')
    echo -e "  ${GREEN}✔${NC} Total Connected Agents: $AGENT_COUNT"
    
    # Check Agent 'zoro'
    if curl -k -s -X GET "https://localhost:55000/agents?pretty=true" -H "Authorization: Bearer $AUTH_TOKEN" | grep -q "zoro"; then
        echo -e "  ${GREEN}✔${NC} Agent 'zoro' is registered"
        STATUS=$(curl -k -s -X GET "https://localhost:55000/agents?pretty=true" -H "Authorization: Bearer $AUTH_TOKEN" | jq -r '.data.affected_items[] | select(.name=="zoro") | .status')
        if [ "$STATUS" == "active" ]; then
            echo -e "    ${GREEN}✔${NC} Agent 'zoro' is ACTIVE"
        else
            echo -e "    ${RED}✘${NC} Agent 'zoro' is $STATUS"
        fi
    else
        echo -e "  ${RED}✘${NC} Agent 'zoro' is NOT registered"
    fi
else
    echo -e "  ${RED}✘${NC} Manager API Authentication FAILED"
fi

# 4. Check SOC Service Connectivity
echo -e "\n${YELLOW}[4/4] Checking SOC Service to Manager link...${NC}"
if curl -s http://localhost:8003/health | grep -q "healthy"; then
    echo -e "  ${GREEN}✔${NC} SOC Service is healthy"
    if curl -s http://localhost:8003/agents | grep -q "zoro"; then
        echo -e "  ${GREEN}✔${NC} SOC Service can see agent 'zoro' via Manager proxy"
    else
        echo -e "  ${RED}✘${NC} SOC Service cannot see agents (check credentials in SOC config)"
    fi
else
    echo -e "  ${RED}✘${NC} SOC Service is NOT healthy"
fi

echo -e "\n${BLUE}================================================================${NC}"
echo -e "${BLUE}                      Verification Complete                     ${NC}"
echo -e "${BLUE}================================================================${NC}"
