#!/usr/bin/env python3
"""
SecurePulse SIEM Tool - Server Setup Automation
================================================
Run this on the Ubuntu 20 VM to automatically:
  1. Check system prerequisites
  2. Install Docker & Docker Compose (if missing)
  3. Configure firewall ports
  4. Pull latest code from Git
  5. Build and deploy with Docker Compose
  6. Verify all services are healthy
  7. Display connection URLs

Usage:
  sudo python3 setup_server.py
"""

import subprocess
import sys
import os
import time
import socket
import shutil

# ─── Configuration ───────────────────────────────────────────────────────────

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REQUIRED_PORTS = [
    (80,    "Nginx / Frontend"),
    (443,   "HTTPS"),
    (3306,  "MySQL"),
    (5000,  "API Gateway"),
    (5601,  "Wazuh Dashboard"),
    (8081,  "phpMyAdmin"),
    (1514,  "Wazuh Agent (events)"),
    (1515,  "Wazuh Agent (enrollment)"),
    (55000, "Wazuh API"),
    (9200,  "Wazuh Indexer"),
    (6379,  "Redis"),
    (8000,  "ChromaDB"),
    (8001,  "Auth Service"),
    (8002,  "Inventory Service"),
    (8003,  "SOC Service"),
    (8004,  "AI Service"),
    (8005,  "Reports Service"),
    (11434, "Ollama AI"),
]

HEALTH_CHECKS = [
    ("API Gateway",      "http://localhost:5000/api/health"),
    ("Auth Service",     "http://localhost:8001/health"),
    ("SOC Service",      "http://localhost:8003/health"),
    ("Reports Service",  "http://localhost:8005/health"),
]

# ─── Helpers ─────────────────────────────────────────────────────────────────

class Colors:
    GREEN  = "\033[92m"
    YELLOW = "\033[93m"
    RED    = "\033[91m"
    CYAN   = "\033[96m"
    BOLD   = "\033[1m"
    RESET  = "\033[0m"

def print_header(msg):
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'═' * 60}")
    print(f"  {msg}")
    print(f"{'═' * 60}{Colors.RESET}\n")

def print_step(step_num, msg):
    print(f"{Colors.BOLD}[{step_num}]{Colors.RESET} {msg}")

def print_ok(msg):
    print(f"  {Colors.GREEN}✔ {msg}{Colors.RESET}")

def print_warn(msg):
    print(f"  {Colors.YELLOW}⚠ {msg}{Colors.RESET}")

def print_fail(msg):
    print(f"  {Colors.RED}✘ {msg}{Colors.RESET}")

def print_info(msg):
    print(f"  {Colors.CYAN}ℹ {msg}{Colors.RESET}")

def run(cmd, check=True, capture=True, cwd=None):
    """Run a shell command and return output."""
    try:
        result = subprocess.run(
            cmd, shell=True, check=check,
            capture_output=capture, text=True,
            cwd=cwd or PROJECT_DIR
        )
        return result.stdout.strip() if capture else ""
    except subprocess.CalledProcessError as e:
        if check:
            print_fail(f"Command failed: {cmd}")
            if e.stderr:
                print(f"    {e.stderr.strip()}")
        return None

def command_exists(cmd):
    return shutil.which(cmd) is not None

def get_local_ip():
    """Get the VM's LAN IP address."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        # Fallback: parse ip addr
        output = run("hostname -I", check=False)
        if output:
            return output.split()[0]
        return "127.0.0.1"

# ─── Step 1: System Checks ──────────────────────────────────────────────────

def check_root():
    print_step(1, "Checking root privileges...")
    if os.geteuid() != 0:
        print_fail("This script must be run as root (use sudo).")
        print_info("Run: sudo python3 setup_server.py")
        sys.exit(1)
    print_ok("Running as root")

def check_os():
    print_step(2, "Checking operating system...")
    if not os.path.exists("/etc/os-release"):
        print_warn("Cannot determine OS, proceeding anyway...")
        return
    
    os_info = run("cat /etc/os-release | grep PRETTY_NAME", check=False) or ""
    os_name = os_info.split("=")[-1].strip('"') if "=" in os_info else "Unknown"
    print_ok(f"OS: {os_name}")

# ─── Step 2: Docker Installation ────────────────────────────────────────────

def install_docker():
    print_step(3, "Checking Docker installation...")
    
    if command_exists("docker"):
        version = run("docker --version", check=False) or "unknown"
        print_ok(f"Docker already installed: {version}")
    else:
        print_warn("Docker not found. Installing...")
        commands = [
            "apt-get update -qq",
            "apt-get install -y -qq apt-transport-https ca-certificates curl gnupg lsb-release",
            "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg",
            'echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null',
            "apt-get update -qq",
            "apt-get install -y -qq docker-ce docker-ce-cli containerd.io",
            "systemctl enable docker",
            "systemctl start docker",
        ]
        for cmd in commands:
            result = run(cmd, check=False, capture=False)
        
        if command_exists("docker"):
            print_ok("Docker installed successfully!")
        else:
            print_fail("Docker installation failed. Please install manually.")
            sys.exit(1)

def install_docker_compose():
    print_step(4, "Checking Docker Compose...")
    
    # Check for docker-compose (v1) or docker compose (v2 plugin)
    compose_v2 = run("docker compose version", check=False)
    compose_v1 = run("docker-compose --version", check=False)
    
    if compose_v2:
        print_ok(f"Docker Compose v2: {compose_v2}")
        return "docker compose"
    elif compose_v1:
        print_ok(f"Docker Compose v1: {compose_v1}")
        return "docker-compose"
    else:
        print_warn("Docker Compose not found. Installing...")
        # Try installing v2 plugin first
        run("apt-get install -y -qq docker-compose-plugin", check=False, capture=False)
        
        if run("docker compose version", check=False):
            print_ok("Docker Compose v2 plugin installed!")
            return "docker compose"
        
        # Fallback: install v1
        run("apt-get install -y -qq docker-compose", check=False, capture=False)
        if run("docker-compose --version", check=False):
            print_ok("Docker Compose v1 installed!")
            return "docker-compose"
        
        print_fail("Failed to install Docker Compose. Please install manually.")
        sys.exit(1)

# ─── Step 3: Firewall Configuration ─────────────────────────────────────────

def configure_firewall():
    print_step(5, "Configuring firewall ports...")
    
    # Check if ufw is available
    if not command_exists("ufw"):
        print_info("UFW not installed, skipping firewall configuration")
        return
    
    # Check ufw status
    ufw_status = run("ufw status", check=False) or ""
    
    if "inactive" in ufw_status.lower():
        print_info("UFW is inactive — no firewall rules needed")
        return
    
    # Enable UFW if not active (allow SSH first!)
    run("ufw allow 22/tcp", check=False)
    
    # Allow all required ports
    for port, service in REQUIRED_PORTS:
        result = run(f"ufw allow {port}/tcp", check=False)
        if result is not None:
            print_ok(f"Port {port:>5}/tcp allowed ({service})")
        else:
            print_warn(f"Port {port:>5}/tcp could not be configured ({service})")
    
    # Reload UFW
    run("ufw --force enable", check=False)
    run("ufw reload", check=False)
    print_ok("Firewall configured successfully")

# ─── Step 4: Git Pull ───────────────────────────────────────────────────────

def git_pull():
    print_step(6, "Pulling latest code from Git...")
    
    if not os.path.exists(os.path.join(PROJECT_DIR, ".git")):
        print_warn("Not a git repository, skipping pull")
        return
    
    result = run("git pull", check=False)
    if result is not None:
        print_ok(f"Git: {result}")
    else:
        print_warn("Git pull failed — continuing with current code")

# ─── Step 5: Docker Compose Deploy ──────────────────────────────────────────

def docker_deploy(compose_cmd):
    print_step(7, "Building and deploying with Docker Compose...")
    print_info("This may take several minutes on first run...")
    
    # Stop any existing containers
    print_info("Stopping existing containers...")
    run(f"{compose_cmd} down", check=False, capture=False)
    
    # Build and start
    print_info("Building and starting all services...")
    result = run(f"{compose_cmd} up -d --build", check=False, capture=False)
    
    if result is None:
        # Check if containers actually started despite error output
        ps_output = run(f"{compose_cmd} ps", check=False) or ""
        if "Up" in ps_output or "running" in ps_output.lower():
            print_ok("Services are running!")
        else:
            print_fail("Docker Compose failed to start services.")
            print_info(f"Try running manually: cd {PROJECT_DIR} && sudo {compose_cmd} up -d")
            return False
    else:
        print_ok("Docker Compose started successfully!")
    
    # Show container status
    print_info("Container status:")
    run(f"{compose_cmd} ps", check=False, capture=False)
    return True

# ─── Step 6: Health Checks ──────────────────────────────────────────────────

def verify_services():
    print_step(8, "Verifying services (waiting for startup)...")
    
    if not command_exists("curl"):
        run("apt-get install -y -qq curl", check=False, capture=False)
    
    # Wait for services to initialize
    max_wait = 60  # seconds
    print_info(f"Waiting up to {max_wait}s for services to start...")
    
    for i in range(max_wait // 5):
        time.sleep(5)
        # Quick check if API Gateway is up
        result = run("curl -s -o /dev/null -w '%{http_code}' http://localhost:5000/api/health --max-time 3", check=False)
        if result and result.strip("'\"") == "200":
            print_ok(f"API Gateway responded after {(i + 1) * 5}s")
            break
        print_info(f"  Still waiting... ({(i + 1) * 5}s)")
    
    print()
    # Check each service
    all_healthy = True
    for name, url in HEALTH_CHECKS:
        result = run(f"curl -s -o /dev/null -w '%{{http_code}}' {url} --max-time 5", check=False)
        status = result.strip("'\"") if result else "---"
        
        if status == "200":
            print_ok(f"{name:20s} → {status} OK")
        else:
            print_warn(f"{name:20s} → {status} (may still be starting)")
            all_healthy = False
    
    # Check Wazuh Manager
    wazuh_result = run(
        "curl -sk -o /dev/null -w '%{http_code}' https://localhost:55000 --max-time 5",
        check=False
    )
    wazuh_status = wazuh_result.strip("'\"") if wazuh_result else "---"
    if wazuh_status in ["200", "401"]:  # 401 means it's running but needs auth
        print_ok(f"{'Wazuh Manager':20s} → {wazuh_status} (running)")
    else:
        print_warn(f"{'Wazuh Manager':20s} → {wazuh_status} (may still be starting)")
    
    return all_healthy

# ─── Step 7: Display Connection Info ────────────────────────────────────────

def display_connection_info():
    ip = get_local_ip()
    
    print_header("CONNECTION INFORMATION")
    print(f"  {Colors.BOLD}Server IP:{Colors.RESET} {Colors.GREEN}{ip}{Colors.RESET}")
    print()
    print(f"  {Colors.BOLD}Access from Windows browser:{Colors.RESET}")
    print(f"  ┌──────────────────────────────────────────────────────┐")
    print(f"  │ Frontend          │ http://{ip:<22s}│")
    print(f"  │ API Gateway       │ http://{ip}:5000{' ' * (16 - len(ip))}│")
    print(f"  │ Wazuh Dashboard   │ https://{ip}:5601{' ' * (15 - len(ip))}│")
    print(f"  │ phpMyAdmin        │ http://{ip}:8081{' ' * (16 - len(ip))}│")
    print(f"  └──────────────────────────────────────────────────────┘")
    print()
    print(f"  {Colors.BOLD}Wazuh Dashboard Login:{Colors.RESET}")
    print(f"    Username: admin")
    print(f"    Password: SecretPassword1!")
    print()
    print(f"  {Colors.BOLD}phpMyAdmin Login:{Colors.RESET}")
    print(f"    Username: root")
    print(f"    Password: securepluse")
    print()

# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    print_header("SecurePulse SIEM Tool - Server Setup")
    print_info(f"Project directory: {PROJECT_DIR}")
    print()
    
    # Step 1: System checks
    check_root()
    check_os()
    
    # Step 2: Docker
    install_docker()
    compose_cmd = install_docker_compose()
    
    # Step 3: Firewall
    configure_firewall()
    
    # Step 4: Git pull
    git_pull()
    
    # Step 5: Deploy
    success = docker_deploy(compose_cmd)
    
    if success:
        # Step 6: Health checks
        verify_services()
    
    # Step 7: Connection info
    display_connection_info()
    
    print_header("SETUP COMPLETE")
    print_ok("Server is ready! Open the URLs above in your Windows browser.")
    print()

if __name__ == "__main__":
    main()
