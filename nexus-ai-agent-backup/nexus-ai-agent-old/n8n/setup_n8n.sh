#!/usr/bin/env bash
# Script to setup and run n8n with PostgreSQL on Ubuntu VPS
set -e

echo "=== Nexus AI Agent: Setting up n8n & PostgreSQL ==="

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check docker availability
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker and Docker Compose first."
    exit 1
fi

echo "Starting n8n containers using docker-compose..."
cd "$SCRIPT_DIR"
docker compose -f docker-compose.n8n.yml up -d

echo "Waiting for n8n to become ready on http://localhost:5678 ..."
sleep 5

echo "=== n8n Setup Complete ==="
echo "Access n8n Web Interface: http://localhost:5678"
echo "Webhook Target Endpoint: http://localhost:5678/webhook/nexus-agent"
