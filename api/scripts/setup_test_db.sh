#!/bin/bash
# Script to setup the test database for Codifeed API

set -e

# Colors for output
BLUE='\033[34m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
RESET='\033[0m'

echo -e "${BLUE}Setting up test database...${RESET}"

# Database configuration
CONTAINER_NAME="${POSTGRES_CONTAINER:-codifeed-postgres}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
TEST_DB_NAME="${TEST_DB_NAME:-codifeed_test}"

# Check if PostgreSQL container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}Error: PostgreSQL container '${CONTAINER_NAME}' is not running${RESET}"
    echo -e "${YELLOW}Make sure to start PostgreSQL first:${RESET}"
    echo -e "  docker-compose -f database/docker-compose.yml up -d"
    exit 1
fi

echo -e "${GREEN}PostgreSQL container is running${RESET}"

# Check if test database already exists
if docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$TEST_DB_NAME"; then
    echo -e "${YELLOW}Test database '$TEST_DB_NAME' already exists${RESET}"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Dropping existing test database...${RESET}"
        docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -c "DROP DATABASE $TEST_DB_NAME;" || true
    else
        echo -e "${GREEN}Keeping existing test database${RESET}"
        exit 0
    fi
fi

# Create test database
echo -e "${BLUE}Creating test database '$TEST_DB_NAME'...${RESET}"
docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -c "CREATE DATABASE $TEST_DB_NAME;"

echo -e "${GREEN}✅ Test database setup complete!${RESET}"
echo -e "${YELLOW}Test database URL:${RESET} postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$TEST_DB_NAME"
echo ""
echo -e "${BLUE}You can now run tests with:${RESET}"
echo -e "  make test-api"
echo -e "  cd api && poetry run pytest"
