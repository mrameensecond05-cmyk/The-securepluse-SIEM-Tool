#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  SecurePulse SIEM Tool - Server Setup
#  Run on Ubuntu 20 VM: sudo bash setup.sh
# ═══════════════════════════════════════════════════════════════

set -e

# Colors
GREEN="\033[92m"; YELLOW="\033[93m"; RED="\033[91m"; CYAN="\033[96m"; BOLD="\033[1m"; RESET="\033[0m"

ok()   { echo -e "  ${GREEN}✔ $1${RESET}"; }
warn() { echo -e "  ${YELLOW}⚠ $1${RESET}"; }
fail() { echo -e "  ${RED}✘ $1${RESET}"; }
info() { echo -e "  ${CYAN}ℹ $1${RESET}"; }
header() { echo -e "\n${BOLD}${CYAN}════════════════════════════════════════════════════════════\n  $1\n════════════════════════════════════════════════════════════${RESET}\n"; }
step() { echo -e "${BOLD}[$1]${RESET} $2"; }

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# ─── Step 1: Root Check ──────────────────────────────────────
header "SecurePulse SIEM Tool - Server Setup"
info "Project directory: $PROJECT_DIR"

step 1 "Checking root privileges..."
if [ "$EUID" -ne 0 ]; then
    fail "This script must be run as root (use sudo)"
    info "Run: sudo bash setup.sh"
    exit 1
fi
ok "Running as root"

# ─── Step 2: OS Check ────────────────────────────────────────
step 2 "Checking operating system..."
if [ -f /etc/os-release ]; then
    . /etc/os-release
    ok "OS: $PRETTY_NAME"
else
    warn "Cannot determine OS"
fi

# ─── Step 3: Install Docker ──────────────────────────────────
step 3 "Checking Docker..."
if command -v docker &>/dev/null; then
    ok "Docker: $(docker --version)"
else
    warn "Docker not found. Installing..."
    apt-get update -qq
    apt-get install -y -qq apt-transport-https ca-certificates curl gnupg lsb-release
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io
    systemctl enable docker
    systemctl start docker
    ok "Docker installed!"
fi

# ─── Step 4: Install Docker Compose ──────────────────────────
step 4 "Checking Docker Compose..."
COMPOSE_CMD=""
if docker compose version &>/dev/null; then
    ok "Docker Compose v2: $(docker compose version)"
    COMPOSE_CMD="docker compose"
elif docker-compose --version &>/dev/null; then
    ok "Docker Compose v1: $(docker-compose --version)"
    COMPOSE_CMD="docker-compose"
else
    warn "Docker Compose not found. Installing..."
    apt-get install -y -qq docker-compose-plugin 2>/dev/null || true
    if docker compose version &>/dev/null; then
        ok "Docker Compose v2 plugin installed!"
        COMPOSE_CMD="docker compose"
    else
        apt-get install -y -qq docker-compose 2>/dev/null || true
        if docker-compose --version &>/dev/null; then
            ok "Docker Compose v1 installed!"
            COMPOSE_CMD="docker-compose"
        else
            fail "Failed to install Docker Compose"
            exit 1
        fi
    fi
fi

# ─── Step 5: Firewall Ports ──────────────────────────────────
step 5 "Configuring firewall..."
if command -v ufw &>/dev/null; then
    UFW_STATUS=$(ufw status 2>/dev/null || echo "inactive")
    if echo "$UFW_STATUS" | grep -qi "inactive"; then
        info "UFW is inactive — no rules needed"
    else
        PORTS=(22 80 443 3306 5000 5601 8081 1514 1515 55000 9200 6379 8000 8001 8002 8003 8004 8005 11434)
        for PORT in "${PORTS[@]}"; do
            ufw allow "$PORT/tcp" &>/dev/null && ok "Port $PORT/tcp allowed"
        done
        ufw --force enable &>/dev/null
        ufw reload &>/dev/null
        ok "Firewall configured"
    fi
else
    info "UFW not installed, skipping"
fi

# ─── Step 6: Git Pull ────────────────────────────────────────
step 6 "Pulling latest code..."
if [ -d "$PROJECT_DIR/.git" ]; then
    GIT_OUTPUT=$(git pull 2>&1 || echo "pull failed")
    ok "Git: $GIT_OUTPUT"
else
    warn "Not a git repo, skipping"
fi

# ─── Step 7: Create .env ─────────────────────────────────────
step 7 "Checking .env file..."
ENV_FILE="$PROJECT_DIR/.env"

if [ -f "$ENV_FILE" ] && grep -q "WAZUH_INDEXER_USERNAME" "$ENV_FILE" && grep -q "WAZUH_INDEXER_PASSWORD" "$ENV_FILE"; then
    ok ".env exists with all required variables"
else
    if [ -f "$ENV_FILE" ]; then
        warn ".env missing Wazuh Indexer creds, recreating..."
    else
        warn ".env not found (gitignored), creating..."
    fi
    
    cat > "$ENV_FILE" <<'EOF'
# Database Configuration
DB_ROOT_PASSWORD=securepluse
DB_USER=securepulse
DB_PASSWORD=securepluse

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Wazuh API Credentials
WAZUH_API_USER=wazuh-wui
WAZUH_API_PASSWORD=wazuh-wui

# Wazuh Indexer Credentials (used by wazuh-indexer and wazuh-dashboard)
WAZUH_INDEXER_USERNAME=admin
WAZUH_INDEXER_PASSWORD=SecretPassword1!
EOF
    ok ".env file created"
fi

# ─── Step 8: Docker Compose Deploy ───────────────────────────
step 8 "Deploying with Docker Compose..."
info "Stopping existing containers and cleaning Wazuh data..."
$COMPOSE_CMD down -v 2>/dev/null || true
info "Old volumes removed to ensure clean Wazuh security index initialization"

info "Building and starting all services (this may take a few minutes)..."
$COMPOSE_CMD build --no-cache
$COMPOSE_CMD up -d

info "Container status:"
$COMPOSE_CMD ps

# ─── Step 9: Health Checks (App Services) ────────────────────
step 9 "Verifying application services..."
info "Waiting for app services to start (up to 90s)..."

for i in $(seq 1 18); do
    sleep 5
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health --max-time 3 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        ok "API Gateway responded after $((i * 5))s"
        break
    fi
    info "  Still waiting... ($((i * 5))s)"
done

echo ""
declare -A SERVICES=(
    ["API Gateway"]="http://localhost:5000/api/health"
    ["Auth Service"]="http://localhost:8001/health"
    ["SOC Service"]="http://localhost:8003/health"
    ["Reports Service"]="http://localhost:8005/health"
)

for NAME in "${!SERVICES[@]}"; do
    URL="${SERVICES[$NAME]}"
    CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL" --max-time 5 2>/dev/null || echo "000")
    if [ "$CODE" = "200" ]; then
        ok "$(printf '%-20s' "$NAME") → $CODE OK"
    else
        warn "$(printf '%-20s' "$NAME") → $CODE (may still be starting)"
    fi
done

# ─── Step 10: Wazuh Startup (takes 3-7 minutes) ─────────────
step 10 "Waiting for Wazuh components to initialize..."
echo ""
info "Wazuh has 3 components that start in sequence:"
info "  ① Wazuh Manager   → loads 3000+ security rules"
info "  ② Wazuh Indexer   → starts OpenSearch JVM & builds indices"
info "  ③ Wazuh Dashboard → connects to Manager + Indexer"
info ""
info "This typically takes 3-7 minutes on a VM. Please be patient..."
echo ""

MAX_WAIT=420  # 7 minutes max
ELAPSED=0
INTERVAL=15
MANAGER_READY=false
INDEXER_READY=false
DASHBOARD_READY=false

while [ $ELAPSED -lt $MAX_WAIT ]; do
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
    MINS=$((ELAPSED / 60))
    SECS=$((ELAPSED % 60))

    # Check Wazuh Manager
    if [ "$MANAGER_READY" = false ]; then
        M_CODE=$(curl -sk -o /dev/null -w "%{http_code}" https://localhost:55000 --max-time 5 2>/dev/null || echo "000")
        if [ "$M_CODE" = "200" ] || [ "$M_CODE" = "401" ]; then
            ok "Wazuh Manager    ready! (${MINS}m ${SECS}s)"
            MANAGER_READY=true
        fi
    fi

    # Check Wazuh Indexer
    if [ "$INDEXER_READY" = false ]; then
        I_CODE=$(curl -sk -o /dev/null -w "%{http_code}" https://localhost:9200 --max-time 5 2>/dev/null || echo "000")
        if [ "$I_CODE" = "200" ] || [ "$I_CODE" = "401" ]; then
            ok "Wazuh Indexer    ready! (${MINS}m ${SECS}s)"
            INDEXER_READY=true
        fi
    fi

    # Check Wazuh Dashboard
    if [ "$DASHBOARD_READY" = false ]; then
        D_CODE=$(curl -sk -o /dev/null -w "%{http_code}" https://localhost:5601 --max-time 5 2>/dev/null || echo "000")
        if [ "$D_CODE" = "200" ] || [ "$D_CODE" = "302" ]; then
            ok "Wazuh Dashboard  ready! (${MINS}m ${SECS}s)"
            DASHBOARD_READY=true
        fi
    fi

    # All ready?
    if [ "$MANAGER_READY" = true ] && [ "$INDEXER_READY" = true ] && [ "$DASHBOARD_READY" = true ]; then
        echo ""
        ok "All Wazuh components are ready!"
        break
    fi

    # Status line
    M_SYM="⏳"; I_SYM="⏳"; D_SYM="⏳"
    [ "$MANAGER_READY" = true ] && M_SYM="✅"
    [ "$INDEXER_READY" = true ] && I_SYM="✅"
    [ "$DASHBOARD_READY" = true ] && D_SYM="✅"
    printf "\r  ${CYAN}⏱ ${MINS}m ${SECS}s elapsed  │  Manager: ${M_SYM}  Indexer: ${I_SYM}  Dashboard: ${D_SYM}${RESET}    "
done

echo ""
if [ "$MANAGER_READY" = false ] || [ "$INDEXER_READY" = false ] || [ "$DASHBOARD_READY" = false ]; then
    warn "Some Wazuh components are still starting after 7 minutes."
    warn "This is normal on low-resource VMs. They will be ready soon."
    info "You can check manually: curl -sk https://localhost:5601"
fi

# ─── Step 11: Connection Info ─────────────────────────────────
# Get the real LAN IP (skip Docker bridge IPs like 172.17.x.x)
SERVER_IP=$(hostname -I | tr ' ' '\n' | grep -v '^172\.17\.' | grep -v '^127\.' | head -1)
if [ -z "$SERVER_IP" ]; then
    SERVER_IP=$(hostname -I | awk '{print $1}')
fi

header "CONNECTION INFORMATION"
echo -e "  ${BOLD}Server IP:${RESET} ${GREEN}${SERVER_IP}${RESET}"
echo ""
echo -e "  ${BOLD}Access from Windows browser:${RESET}"
echo "  ┌────────────────────┬──────────────────────────────────┐"
echo "  │ Frontend           │ http://${SERVER_IP}              │"
echo "  │ API Gateway        │ http://${SERVER_IP}:5000         │"
echo "  │ Wazuh Dashboard    │ https://${SERVER_IP}:5601        │"
echo "  │ phpMyAdmin         │ http://${SERVER_IP}:8081         │"
echo "  └────────────────────┴──────────────────────────────────┘"
echo ""
echo -e "  ${BOLD}Wazuh Dashboard Login:${RESET}"
echo "    Username: admin"
echo "    Password: SecretPassword1!"
echo ""
echo -e "  ${BOLD}phpMyAdmin Login:${RESET}"
echo "    Username: root"
echo "    Password: securepluse"
echo ""

header "SETUP COMPLETE"
ok "Server is ready! Open the URLs above in your Windows browser."
echo ""
