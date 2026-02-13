#!/usr/bin/env bash

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/venue-booking-backend"
PID_FILE="$PROJECT_DIR/.frontend.pid"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     🏢 Stopping Venue Booking...        ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"

# ── Stop Frontend ───────────────────────────
if [[ -f "$PID_FILE" ]]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo -e "${YELLOW}⏹  Stopping frontend (PID $PID)...${NC}"
        kill "$PID" 2>/dev/null || true
        # Also kill any child node processes
        pkill -P "$PID" 2>/dev/null || true
        sleep 1
        echo -e "${GREEN}✅ Frontend stopped.${NC}"
    else
        echo -e "${YELLOW}ℹ  Frontend was not running.${NC}"
    fi
    rm -f "$PID_FILE"
else
    # Try to find and kill any vite dev server
    VITE_PID=$(lsof -ti:5173 2>/dev/null || true)
    if [[ -n "$VITE_PID" ]]; then
        echo -e "${YELLOW}⏹  Stopping frontend on port 5173 (PID $VITE_PID)...${NC}"
        kill $VITE_PID 2>/dev/null || true
        echo -e "${GREEN}✅ Frontend stopped.${NC}"
    else
        echo -e "${YELLOW}ℹ  Frontend was not running.${NC}"
    fi
fi

# ── Stop Backend ────────────────────────────
echo -e "${YELLOW}⏹  Stopping Docker containers...${NC}"
cd "$BACKEND_DIR"
docker compose down
echo -e "${GREEN}✅ Backend stopped.${NC}"

# ── Cleanup ─────────────────────────────────
rm -f "$PROJECT_DIR/.frontend.log"

echo ""
echo -e "${GREEN}✅ Everything stopped.${NC}"
