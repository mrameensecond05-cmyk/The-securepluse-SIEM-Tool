# SecurePulse SIEM Deployment Guide

## Overview
SecurePulse is a comprehensive Security Information and Event Management (SIEM) system that integrates Wazuh for security monitoring, Ollama for AI-powered threat analysis, and a modern React-based dashboard for visualization.

## System Architecture

### Components
- **Frontend**: React + TypeScript + MUI (Port 5173)
- **API Gateway**: Node.js/Express (Port 5000)
- **Microservices**:
  - Auth Service: Python/FastAPI (Port 8001)
  - Inventory Service: Python/FastAPI (Port 8002)
  - SOC Service: Python/FastAPI (Port 8003)
  - AI Service: Python/FastAPI (Port 8004)
  - Reports Service: Python/FastAPI (Port 8005)
- **Infrastructure**:
  - MySQL Database (Port 3306)
  - phpMyAdmin (Port 8081)
  - Redis Cache (Port 6379)
  - Nginx Reverse Proxy (Ports 80, 443)
- **Security Stack**:
  - Wazuh Manager (Ports 1514, 1515, 55000)
  - Wazuh Indexer (Port 9200)
  - Wazuh Dashboard (Port 5601)
- **AI Stack**:
  - Ollama LLM Server (Port 11434)
  - ChromaDB Vector Store (Port 8000)

## Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+ recommended)
- **RAM**: Minimum 16GB (32GB recommended for Wazuh + Ollama)
- **Storage**: 100GB+ available disk space
- **CPU**: 4+ cores (8+ recommended)

### Software Requirements
- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- Node.js 18+ (for local frontend development)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd The\ securepluse-SIEM-Tool
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Database Configuration
DB_ROOT_PASSWORD=SecureRoot123!@#
DB_USER=securepulse_user
DB_PASSWORD=SecureDB456!@#

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Wazuh API Credentials
WAZUH_API_USER=wazuh
WAZUH_API_PASSWORD=wazuh
```

**⚠️ IMPORTANT**: Change all default passwords in production!

### 3. Deploy with Docker Compose

```bash
# Build and start all services
sudo docker-compose up -d --build

# Verify all containers are running
sudo docker ps
```

### 4. Pull Ollama Model

The AI Chatbot requires an Ollama model to be downloaded:

```bash
# Pull the llama3 model (4.7GB download)
sudo docker exec -it thesecurepluse-siem-tool-ollama-1 ollama pull llama3

# Verify model is available
sudo docker exec -it thesecurepluse-siem-tool-ollama-1 ollama list
```

**Alternative models**:
- `tinyllama` (smaller, faster, less accurate)
- `mistral` (balanced performance)
- `codellama` (optimized for code analysis)

### 5. Initialize Database

The database will auto-initialize on first startup using:
- `database/init.sql` - Schema creation
- `database/seed_data.sql` - Sample data

**Default credentials**:
- Username: `admin`
- Password: `admin123`

### 6. Access the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| **SecurePulse Dashboard** | http://localhost:5173 | admin / admin123 |
| **Wazuh Dashboard** | https://localhost:5601 | admin / SecretPassword |
| **phpMyAdmin** | http://localhost:8081 | root / SecureRoot123!@# |
| **API Gateway** | http://localhost:5000 | - |

## Wazuh Agent Configuration

### Installing Wazuh Agent on Monitored Systems

```bash
# Download and install agent (Ubuntu/Debian)
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import && chmod 644 /usr/share/keyrings/wazuh.gpg
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | tee -a /etc/apt/sources.list.d/wazuh.list
apt-get update
apt-get install wazuh-agent

# Configure agent to connect to manager
WAZUH_MANAGER="<your-server-ip>" WAZUH_AGENT_NAME="<hostname>" /var/ossec/bin/agent-auth
systemctl daemon-reload
systemctl enable wazuh-agent
systemctl start wazuh-agent
```

Replace `<your-server-ip>` with the IP address of your SecurePulse server.

## Verification

### 1. Check Service Health

```bash
# API Gateway
curl http://localhost:5000/health

# Auth Service
curl http://localhost:8001/health

# Inventory Service
curl http://localhost:8002/health

# SOC Service
curl http://localhost:8003/health

# AI Service
curl http://localhost:8004/health

# Reports Service
curl http://localhost:8005/health
```

All should return: `{"status":"healthy","service":"<service-name>"}`

### 2. Test AI Chatbot

```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}], "model": "llama3"}'
```

### 3. Verify Wazuh Connection

```bash
# Check Wazuh Manager status
sudo docker exec thesecurepluse-siem-tool-wazuh-manager-1 /var/ossec/bin/wazuh-control status

# List connected agents
sudo docker exec thesecurepluse-siem-tool-wazuh-manager-1 /var/ossec/bin/agent_control -l
```

## Troubleshooting

### Container Won't Start

```bash
# View container logs
sudo docker logs <container-name>

# Restart specific service
sudo docker-compose restart <service-name>

# Rebuild and restart
sudo docker-compose up -d --build --force-recreate
```

### Database Connection Issues

```bash
# Access MySQL directly
sudo docker exec -it thesecurepluse-siem-tool-mysql-1 mysql -u root -p

# Check database exists
SHOW DATABASES;
USE securepulse;
SHOW TABLES;
```

### Ollama Model Issues

```bash
# Check Ollama service logs
sudo docker logs thesecurepluse-siem-tool-ollama-1

# Re-pull model
sudo docker exec -it thesecurepluse-siem-tool-ollama-1 ollama pull llama3

# Test Ollama directly
sudo docker exec -it thesecurepluse-siem-tool-ollama-1 ollama run llama3 "Hello"
```

### Port Conflicts

If ports are already in use, modify `docker-compose.yml`:

```yaml
services:
  phpmyadmin:
    ports:
      - "8082:80"  # Change from 8081 to 8082
```

## Maintenance

### Backup Database

```bash
# Create backup
sudo docker exec thesecurepluse-siem-tool-mysql-1 mysqldump -u root -p<password> securepulse > backup_$(date +%Y%m%d).sql

# Restore backup
sudo docker exec -i thesecurepluse-siem-tool-mysql-1 mysql -u root -p<password> securepulse < backup_20240215.sql
```

### Update Services

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
sudo docker-compose down
sudo docker-compose up -d --build
```

### View Logs

```bash
# All services
sudo docker-compose logs -f

# Specific service
sudo docker-compose logs -f ai-service

# Last 100 lines
sudo docker-compose logs --tail=100 api-gateway
```

## Security Hardening

### Production Checklist

- [ ] Change all default passwords in `.env`
- [ ] Configure SSL/TLS certificates for Nginx
- [ ] Enable firewall (UFW) and restrict ports
- [ ] Set up regular database backups
- [ ] Configure log rotation
- [ ] Enable Wazuh active response
- [ ] Review and harden Wazuh rules
- [ ] Implement rate limiting on API Gateway
- [ ] Set up monitoring and alerting
- [ ] Regular security updates

### Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 1514/tcp  # Wazuh Agent
sudo ufw allow 1515/tcp  # Wazuh Agent
sudo ufw enable
```

## Performance Tuning

### Ollama GPU Acceleration

If you have an NVIDIA GPU:

```yaml
# In docker-compose.yml
ollama:
  image: ollama/ollama:latest
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

### Wazuh Indexer Memory

```yaml
# In docker-compose.yml
wazuh-indexer:
  environment:
    - "OPENSEARCH_JAVA_OPTS=-Xms1g -Xmx1g"  # Adjust based on available RAM
```

## Support

For issues and questions:
- Check logs: `sudo docker-compose logs -f`
- Review Wazuh documentation: https://documentation.wazuh.com/
- Ollama documentation: https://ollama.ai/docs

## License

[Your License Here]
