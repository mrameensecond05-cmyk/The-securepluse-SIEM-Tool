#!/bin/bash

# Configuration
CONTAINER_NAME="securepulse_simulation_server"
IMAGE_NAME="ubuntu:20.04"
PROJECT_DIR=$(pwd)
CONTAINER_PROJECT_DIR="/home/securepulse/project"

echo "=== SecurePulse Simulation: Ubuntu Server (Docker-in-Docker) ==="
echo "Host Project Dir: $PROJECT_DIR"
echo "Target Container: $CONTAINER_NAME"

# Check if container exists and remove it
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Removed existing container..."
    docker rm -f $CONTAINER_NAME
fi

# 1. Start the Ubuntu container in privileged mode (required for Docker-in-Docker)
echo "Starting Ubuntu container..."
docker run -d --privileged --name $CONTAINER_NAME \
    -v "$PROJECT_DIR:$CONTAINER_PROJECT_DIR" \
    $IMAGE_NAME sleep infinity

# 2. Install Dependencies inside the container
echo "Installing Docker and dependencies inside the container..."
docker exec $CONTAINER_NAME bash -c "
    apt-get update && \
    apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        Software-properties-common

    # Install Docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository 'deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable'
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io

    # Install Docker Compose
    curl -L \"https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
"

# 3. Start Docker Daemon inside container
echo "Starting Docker Daemon inside container..."
docker exec -d $CONTAINER_NAME dockerd

# Wait for Docker Daemon to be ready
echo "Waiting for internal Docker Daemon..."
docker exec $CONTAINER_NAME bash -c "while ! docker info > /dev/null 2>&1; do sleep 1; done"
echo "Docker Daemon is ready!"

# 4. Build and Run the Project
echo "Deploying SecurePulse inside the simulated server..."
docker exec -w $CONTAINER_PROJECT_DIR $CONTAINER_NAME docker-compose up -d --build

echo "=== Simulation Deployed ==="
echo "Container IP: $(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $CONTAINER_NAME)"
echo "You can access the simulated environment via:"
echo "  docker exec -it $CONTAINER_NAME bash"
