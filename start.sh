#!/usr/bin/env bash
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/venue-booking-backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
PID_FILE="$PROJECT_DIR/.frontend.pid"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

# ── Check if already running ────────────────
if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo -e "${YELLOW}⚠  Frontend is already running (PID $(cat "$PID_FILE")). Run ${NC}bash stop.sh${YELLOW} first.${NC}"
    exit 1
fi

echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     🏢 Venue Booking — Full Stack       ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"

# ── Backend ─────────────────────────────────
echo -e "\n${GREEN}▶ Starting backend (Docker Compose)...${NC}"
cd "$BACKEND_DIR"
docker compose up -d --build

echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
for i in $(seq 1 30); do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/venues/ 2>/dev/null | grep -q "200"; then
        echo -e "${GREEN}✅ Backend is ready!${NC}"
        break
    fi
    if [[ $i -eq 30 ]]; then
        echo -e "${YELLOW}⚠  Backend not responding yet — check: docker compose logs web${NC}"
    fi
    sleep 1
done

# ── Frontend ────────────────────────────────
echo -e "\n${GREEN}▶ Starting frontend (Vite dev server)...${NC}"
cd "$FRONTEND_DIR"

# Install deps if node_modules is missing
if [[ ! -d "node_modules" ]]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

# Start frontend in background, log to file
nohup npm run dev > "$PROJECT_DIR/.frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "$FRONTEND_PID" > "$PID_FILE"

sleep 2

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         🚀 Everything is running!        ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  Frontend:  ${GREEN}http://localhost:5173${CYAN}        ║${NC}"
echo -e "${CYAN}║  Backend:   ${GREEN}http://localhost:8000${CYAN}        ║${NC}"
echo -e "${CYAN}║  Swagger:   ${GREEN}http://localhost:8000/api/docs/${CYAN}║${NC}"
echo -e "${CYAN}║  Admin:     ${GREEN}http://localhost:8000/admin/${CYAN}  ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  Run ${YELLOW}bash stop.sh${CYAN} to stop everything   ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Frontend log: ${NC}tail -f $PROJECT_DIR/.frontend.log"
