#!/usr/bin/env bash

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/venue-booking-backend"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

PHONE="${1:-}"

if [[ -z "$PHONE" ]]; then
    echo -e "${CYAN}Usage:${NC} bash otp.sh <phone_number>"
    echo -e "${CYAN}Example:${NC} bash otp.sh +998901090019"
    exit 1
fi

OTP=$(cd "$BACKEND_DIR" && docker compose exec -T redis redis-cli GET ":1:otp:${PHONE}" 2>/dev/null)

if [[ -z "$OTP" || "$OTP" == "(nil)" ]]; then
    echo -e "${RED}❌ No OTP found for ${PHONE}${NC}"
    echo -e "${YELLOW}   Either no OTP was requested or it has expired.${NC}"
    exit 1
fi

echo -e "${GREEN}📱 OTP for ${CYAN}${PHONE}${GREEN}: ${YELLOW}${OTP}${NC}"
