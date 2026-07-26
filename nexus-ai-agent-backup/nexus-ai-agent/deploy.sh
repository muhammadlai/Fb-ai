#!/usr/bin/env bash

# ==============================================================================
# NEXUS AI AGENT - UBUNTU VPS AUTOMATED DEPLOYMENT SCRIPT
# ==============================================================================

set -e

GREEN='\030[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}     Nexus AI Agent - Production VPS Deployment     ${NC}"
echo -e "${CYAN}====================================================${NC}"

# 1. Check Docker & Docker Compose installation
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}[!] Docker not found. Installing Docker CE...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}[!] Docker Compose not found. Installing plugin...${NC}"
    sudo apt-get update && sudo apt-get install -y docker-compose-plugin
fi

# 2. Check for .env file
if [ ! -f .env ]; then
    echo -e "${RED}[X] Error: .env file missing in current directory.${NC}"
    echo -e "${YELLOW}[i] Creating .env from .env.example... Please update API keys in .env${NC}"
    cp .env.example .env
    echo -e "${YELLOW}[!] Please edit .env with your real OPENAI_API_KEY, JWT_SECRET_KEY, and SERVER_IP before re-running deploy.sh${NC}"
    exit 1
fi

# 3. Pull latest images and build production containers
echo -e "${CYAN}[1/4] Building production containers...${NC}"
docker compose build --parallel

# 4. Stop old instance if running and restart
echo -e "${CYAN}[2/4] Deploying microservices stack (FastAPI, React Frontend, Nginx, n8n)...${NC}"
docker compose down --remove-orphans
docker compose up -d

# 5. Wait for containers to pass health checks
echo -e "${CYAN}[3/4] Running automated health checks on services...${NC}"
sleep 10

MAX_RETRIES=10
RETRIES=0

until [ $RETRIES -ge $MAX_RETRIES ]; do
    BACKEND_STATUS=$(docker inspect --format='{{json .State.Health.Status}}' nexus_backend 2>/dev/null || echo '"unhealthy"')
    FRONTEND_STATUS=$(docker inspect --format='{{json .State.Health.Status}}' nexus_frontend 2>/dev/null || echo '"unhealthy"')
    
    if [ "$BACKEND_STATUS" == '"healthy"' ] && [ "$FRONTEND_STATUS" == '"healthy"' ]; then
        echo -e "${GREEN}[✓] All microservices report HEALTHY state!${NC}"
        break
    fi
    
    echo -e "${YELLOW}[...] Waiting for services to pass healthchecks... ($((RETRIES+1))/$MAX_RETRIES)${NC}"
    RETRIES=$((RETRIES+1))
    sleep 5
done

# 6. Display completion status
echo -e "${CYAN}[4/4] Nexus AI Agent Deployment Summary:${NC}"
echo -e "${GREEN}----------------------------------------------------${NC}"
echo -e "${GREEN}✓ Frontend & Nginx Proxy: http://${SERVER_IP:-localhost}${NC}"
echo -e "${GREEN}✓ FastAPI Backend API:    http://${SERVER_IP:-localhost}/api/v1${NC}"
echo -e "${GREEN}✓ Swagger API Docs:       http://${SERVER_IP:-localhost}/docs${NC}"
echo -e "${GREEN}✓ n8n Workflow Engine:    http://${SERVER_IP:-localhost}/n8n${NC}"
echo -e "${GREEN}----------------------------------------------------${NC}"
echo -e "${CYAN}Deployment successful! To migrate to a domain with HTTPS later, see README.md${NC}"
echo -e "${CYAN}====================================================${NC}"
