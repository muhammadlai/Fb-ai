#!/usr/bin/env bash

# ==============================================================================
# NEXUS AI AGENT - PERSISTENT DATA BACKUP & RESTORE UTILITY
# ==============================================================================

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_ARCHIVE="${BACKUP_DIR}/nexus_backup_${TIMESTAMP}.tar.gz"

mkdir -p "${BACKUP_DIR}"

if [ "$1" == "restore" ]; then
    if [ -z "$2" ]; then
        echo "Usage: ./backup.sh restore <path_to_backup_archive.tar.gz>"
        exit 1
    fi
    RESTORE_FILE="$2"
    echo "Restoring Nexus AI Agent data from ${RESTORE_FILE}..."
    docker compose down
    tar -xzf "${RESTORE_FILE}" -C ./
    docker compose up -d
    echo "[✓] Data restored successfully!"
    exit 0
fi

echo "Starting automated backup of Nexus AI Agent persistent assets..."

# 1. Export n8n persistent volume data
echo "[1/3] Backing up n8n workflow volume..."
docker run --rm -v nexus_n8n_data:/n8n_vol -v $(pwd)/${BACKUP_DIR}:/backup alpine tar -czf /backup/n8n_volume_${TIMESTAMP}.tar.gz -C /n8n_vol .

# 2. Backup configuration and environment files
echo "[2/3] Archiving configurations & environment keys..."
tar -czf "${BACKUP_ARCHIVE}" \
    .env \
    nginx.conf \
    docker-compose.yml \
    ${BACKUP_DIR}/n8n_volume_${TIMESTAMP}.tar.gz 2>/dev/null || true

rm -f ${BACKUP_DIR}/n8n_volume_${TIMESTAMP}.tar.gz

echo "===================================================="
echo "[✓] Backup Completed Successfully!"
echo "Archive location: ${BACKUP_ARCHIVE}"
echo "To restore on a new VPS, run:"
echo "  ./backup.sh restore ${BACKUP_ARCHIVE}"
echo "===================================================="
