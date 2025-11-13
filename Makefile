# Codifeed - Makefile for API and Frontend development

.PHONY: help install dev build test format lint typecheck clean openapi-gen db-migrate db-upgrade db-downgrade

# Colors for output
BLUE := \033[34m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# Default target
help: ## Show this help message
	@echo "$(BLUE)Codifeed Development Commands$(RESET)"
	@echo "$(YELLOW)Usage: make <target>$(RESET)"
	@echo ""
	@echo "$(GREEN)Installation:$(RESET)"
	@echo "  install              Install all dependencies (API + Frontend)"
	@echo "  install-api          Install API dependencies only"
	@echo "  install-web          Install Frontend dependencies only"
	@echo ""
	@echo "$(GREEN)Development:$(RESET)"
	@echo "  dev                  Start both API and Frontend in development mode"
	@echo "  dev-api              Start API development server"
	@echo "  dev-web              Start Frontend development server"
	@echo ""
	@echo "$(GREEN)Build:$(RESET)"
	@echo "  build                Build both API and Frontend"
	@echo "  build-api            Build API only"
	@echo "  build-web            Build Frontend only"
	@echo ""
	@echo "$(GREEN)Testing:$(RESET)"
	@echo "  test                 Run all tests (API + Frontend)"
	@echo "  test-api             Run API tests"
	@echo "  test-web             Run Frontend tests"
	@echo ""
	@echo "$(GREEN)Code Quality:$(RESET)"
	@echo "  format               Format all code (API + Frontend)"
	@echo "  format-api           Format API code only"
	@echo "  format-web           Format Frontend code only"
	@echo "  lint                 Lint all code (API + Frontend)"
	@echo "  lint-api             Lint API code only"
	@echo "  lint-web             Lint Frontend code only"
	@echo "  typecheck            Type check all code (API + Frontend)"
	@echo "  typecheck-api        Type check API code only"
	@echo "  typecheck-web        Type check Frontend code only"
	@echo "  check                Run format, lint, and typecheck for all"
	@echo "  check-api            Run format, lint, and typecheck for API"
	@echo "  check-web            Run format, lint, and typecheck for Frontend"
	@echo ""
	@echo "$(GREEN)Database:$(RESET)"
	@echo "  db-migrate           Create a new database migration"
	@echo "  db-upgrade           Apply pending migrations"
	@echo "  db-downgrade         Downgrade database by one migration"
	@echo "  db-fake-data         Ensure fake data in database"
	@echo "  db-test-setup        Setup test database"
	@echo ""
	@echo "$(GREEN)OpenAPI:$(RESET)"
	@echo "  openapi-gen          Generate TypeScript types from OpenAPI spec"
	@echo "  openapi-watch        Watch for API changes and regenerate types"
	@echo ""
	@echo "$(GREEN)Maintenance:$(RESET)"
	@echo "  clean                Clean build artifacts and caches"
	@echo "  clean-api            Clean API artifacts only"
	@echo "  clean-web            Clean Frontend artifacts only"

# =============================================================================
# Installation
# =============================================================================

install: install-api install-web ## Install all dependencies

install-api: ## Install API dependencies
	@echo "$(BLUE)Installing API dependencies...$(RESET)"
	cd api && mise exec -- poetry install

install-web: ## Install Frontend dependencies
	@echo "$(BLUE)Installing Frontend dependencies...$(RESET)"
	cd web && pnpm install

# =============================================================================
# Development
# =============================================================================

dev: ## Start both API and Frontend in development mode
	@echo "$(BLUE)Starting development servers...$(RESET)"
	@echo "$(YELLOW)API will be available at: http://localhost:8000$(RESET)"
	@echo "$(YELLOW)Frontend will be available at: http://localhost:3000$(RESET)"
	@echo "$(YELLOW)Press Ctrl+C to stop both servers$(RESET)"
	@trap 'kill %1; kill %2' INT; \
	cd api && mise exec -- poetry run python dev.py & \
	cd web && pnpm dev & \
	wait

dev-api: ## Start API development server
	@echo "$(BLUE)Starting API development server...$(RESET)"
	cd api && mise exec -- poetry run python dev.py

dev-web: ## Start Frontend development server
	@echo "$(BLUE)Starting Frontend development server...$(RESET)"
	cd web && pnpm dev

# =============================================================================
# Build
# =============================================================================

build: build-api build-web ## Build both API and Frontend

build-api: ## Build API
	@echo "$(BLUE)Building API...$(RESET)"
	@echo "$(YELLOW)API build completed (using Docker for production)$(RESET)"

build-web: ## Build Frontend
	@echo "$(BLUE)Building Frontend...$(RESET)"
	cd web && pnpm build

# =============================================================================
# Testing
# =============================================================================

test: test-api test-web ## Run all tests

test-api: ## Run API tests
	@echo "$(BLUE)Running API tests...$(RESET)"
	cd api && mise exec -- poetry run pytest

test-web: ## Run Frontend tests
	@echo "$(BLUE)Running Frontend tests...$(RESET)"
	cd web && pnpm test

# =============================================================================
# Code Quality
# =============================================================================

format: format-api format-web ## Format all code

format-api: ## Format API code
	@echo "$(BLUE)Formatting API code...$(RESET)"
	cd api && mise exec -- poetry run ruff format .

format-web: ## Format Frontend code
	@echo "$(BLUE)Formatting Frontend code...$(RESET)"
	cd web && pnpm format

lint: lint-api lint-web ## Lint all code

lint-api: ## Lint API code
	@echo "$(BLUE)Linting API code...$(RESET)"
	cd api && mise exec -- poetry run ruff check --fix .

lint-web: ## Lint Frontend code
	@echo "$(BLUE)Linting Frontend code...$(RESET)"
	cd web && pnpm lint

typecheck: typecheck-api typecheck-web ## Type check all code

typecheck-api: ## Type check API code
	@echo "$(BLUE)Type checking API code...$(RESET)"
	cd api && mise exec -- poetry run pyright

typecheck-web: ## Type check Frontend code
	@echo "$(BLUE)Type checking Frontend code...$(RESET)"
	cd web && pnpm typecheck

check: check-api check-web ## Run format, lint, and typecheck for all

check-api: format-api lint-api typecheck-api ## Run format, lint, and typecheck for API
	@echo "$(GREEN)API code quality checks completed$(RESET)"

check-web: ## Run format, lint, and typecheck for Frontend
	@echo "$(BLUE)Running Frontend code quality checks...$(RESET)"
	cd web && pnpm check

# =============================================================================
# Database
# =============================================================================

db-migrate: ## Create a new database migration
	@echo "$(BLUE)Creating database migration...$(RESET)"
	@read -p "Enter migration message: " message; \
	cd api && mise exec -- poetry run alembic revision --autogenerate -m "$$message"

db-upgrade: ## Apply pending migrations
	@echo "$(BLUE)Applying database migrations...$(RESET)"
	cd api && mise exec -- poetry run alembic upgrade head

db-downgrade: ## Downgrade database by one migration
	@echo "$(BLUE)Downgrading database...$(RESET)"
	cd api && mise exec -- poetry run alembic downgrade -1

db-fake-data: ## Ensure fake data in database
	@echo "$(BLUE)Ensuring fake data in database...$(RESET)"
	cd api && mise exec -- poetry run python scripts/ensure_fake_data.py

db-test-setup: ## Setup test database
	@echo "$(BLUE)Setting up test database...$(RESET)"
	cd api && bash scripts/setup_test_db.sh

# =============================================================================
# OpenAPI
# =============================================================================

openapi-gen: ## Generate TypeScript types from OpenAPI spec
	@echo "$(BLUE)Generating TypeScript types from OpenAPI spec...$(RESET)"
	@echo "$(YELLOW)Make sure the API server is running on localhost:8000$(RESET)"
	cd web && pnpm openapi-ts

openapi-watch: ## Watch for API changes and regenerate types
	@echo "$(BLUE)Watching for API changes and regenerating types...$(RESET)"
	@echo "$(YELLOW)Make sure the API server is running on localhost:8000$(RESET)"
	cd web && pnpm openapi-ts:watch

# =============================================================================
# Maintenance
# =============================================================================

clean: clean-api clean-web ## Clean build artifacts and caches

clean-api: ## Clean API artifacts
	@echo "$(BLUE)Cleaning API artifacts...$(RESET)"
	cd api && find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	cd api && find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	cd api && find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	cd api && find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	cd api && find . -name "*.pyc" -delete 2>/dev/null || true

clean-web: ## Clean Frontend artifacts
	@echo "$(BLUE)Cleaning Frontend artifacts...$(RESET)"
	cd web && rm -rf dist/ .turbo/ node_modules/.cache/ 2>/dev/null || true
	cd web && pnpm store prune 2>/dev/null || true

# =============================================================================
# Docker (Production)
# =============================================================================

docker-build: ## Build production Docker image for API
	@echo "$(BLUE)Building production Docker image...$(RESET)"
	cd api && docker build -t codifeed-api .

docker-run: ## Run production Docker container
	@echo "$(BLUE)Running production Docker container...$(RESET)"
	docker run -p 8000:8000 codifeed-api

# =============================================================================
# Shortcuts for convenience
# =============================================================================

api: dev-api ## Shortcut for dev-api
web: dev-web ## Shortcut for dev-web
