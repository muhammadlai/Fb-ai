# ⚡ Nexus AI Agent - Autonomous Engineering & Workflow Automation Platform

Nexus AI Agent is an autonomous full-stack AI engineering platform powered by a **FastAPI Python Core**, **Vite React Frontend**, **OpenAI & Gemini 2.5 AI Models**, and an **n8n Workflow Automation Hub**.

---

## 🏗️ System Architecture & Technology Stack

```
                                 ┌─────────────────────────────────┐
                                 │      Nginx Reverse Proxy        │
                                 │   (HTTPS / Rate Limiting)       │
                                 └────────────────┬────────────────┘
                                                  │
                 ┌────────────────────────────────┼────────────────────────────────┐
                 │                                │                                │
                 ▼                                ▼                                ▼
  ┌─────────────────────────────┐  ┌─────────────────────────────┐  ┌─────────────────────────────┐
  │     Vite React Frontend     │  │   FastAPI Python Backend    │  │    n8n Automation Hub       │
  │  (Tailwind CSS + Lucide)    │  │   (JWT Auth + AI Layer)     │  │  (Webhook Orchestration)   │
  └─────────────────────────────┘  └──────────────┬──────────────┘  └─────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │     AI Intelligence Layer       │
                                 │   (Gemini 2.5 + OpenAI GPT-4o)  │
                                 └─────────────────────────────────┘
```

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend API**: FastAPI (Python 3.11), JWT Authentication, Security Layer, Rate Limiting
- **AI Engine**: Google Gemini API (`gemini-3.6-flash`), OpenAI API (`gpt-4o`) with intelligent fallback
- **Automation Engine**: n8n Webhook Hub with HMAC SHA256 Signature Security
- **Deployment**: Docker, Docker Compose, Nginx Reverse Proxy, Let's Encrypt SSL (Certbot)

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/your-username/nexus-ai-agent.git
cd nexus-ai-agent

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment Keys (`.env`)
Edit `.env` and set your secret credentials:
```env
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_OPENAI_KEY
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_KEY
JWT_SECRET_KEY=nexus_super_secret_jwt_key_2026
N8N_WEBHOOK_URL=http://localhost:5678/webhook/nexus-agent
```

### 3. Start Development Server
```bash
npm run dev
```
Access app in browser: `http://localhost:3000`

---

## 🐳 Production Deployment (Ubuntu VPS / IP Address Deployment)

### 1. VPS Environment Setup & Deployment
Upload the repository to your Ubuntu VPS (or run directly on server) and run the automated deployment script:
```bash
chmod +x deploy.sh backup.sh
./deploy.sh
```

### 2. Manual Docker Compose Deployment
```bash
# Build containers
docker compose build

# Launch microservices (Nginx, FastAPI Backend, React Frontend, n8n)
docker compose up -d
```

Access your platform directly via your server IP or localhost:
- **Frontend App**: `http://<YOUR_SERVER_IP>`
- **FastAPI Backend API**: `http://<YOUR_SERVER_IP>/api/v1`
- **Interactive Swagger Docs**: `http://<YOUR_SERVER_IP>/docs`
- **n8n Automation Engine**: `http://<YOUR_SERVER_IP>/n8n`

---

## 🌐 Migrating to a Custom Domain & HTTPS in the Future

When you acquire a custom domain name later:
1. Point your domain's **A Record** to your Ubuntu VPS Public IP address.
2. In `.env`, change `SERVER_IP="YOUR_DOMAIN"` (e.g., `nexus.yourdomain.com`).
3. In `nginx.conf`, change `server_name nexus.yourdomain.com;`.
4. Add Certbot SSL container to `docker-compose.yml` to request Let's Encrypt certificates:
   ```bash
   docker run --rm -v certbot_etc:/etc/letsencrypt -v certbot_var:/var/www/certbot certbot/certbot certonly --webroot --webroot-path=/var/www/certbot -d nexus.yourdomain.com
   ```
5. Uncomment the HTTPS `server` block in `nginx.conf` and reload Nginx:
   ```bash
   docker compose exec frontend nginx -s reload
   ```

---

## 📡 API Routing & Endpoints

| Service | Path | Description |
| :--- | :--- | :--- |
| **Frontend App** | `/` | Vite React Dashboard & Chat Interface |
| **API Root** | `/api/v1` | FastAPI Base System Status |
| **Auth Register** | `/api/v1/auth/register` | User Registration & Password Hashing |
| **Auth Login** | `/api/v1/auth/login` | User Authentication & JWT Issuance |
| **Auth Profile** | `/api/v1/auth/me` | Current Authenticated User Info |
| **AI Chat** | `/api/v1/chat/completions` | AI Conversation with Memory & n8n Trigger |
| **Swagger Docs** | `/docs` | Interactive OpenAPI Swagger Documentation |
| **n8n Engine** | `/n8n` | n8n Workflow Visual Canvas |
| **n8n Webhook** | `/webhook/*` | Inbound & Outbound Webhook Receiver |

---

## 💾 Persistent Data Backup & Restore

### Create Backup
```bash
./backup.sh
```
This generates a timestamped tarball in `./backups/nexus_backup_YYYYMMDD_HHMMSS.tar.gz`.

### Restore Backup
```bash
./backup.sh restore ./backups/nexus_backup_YYYYMMDD_HHMMSS.tar.gz
```

---

## 🔐 Default Access Credentials

- **Admin Account**: Username: `admin` | Password: `admin123`
- **User Account**: Username: `nexususer` | Password: `user123`
- **n8n Basic Auth**: Username: `admin` | Password: `nexus_n8n_password_2026`

---

## 📄 License & Status

**Phase 1, Phase 2, Phase 3, and Phase 4** are 100% complete and production-ready.
