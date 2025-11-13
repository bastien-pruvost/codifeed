# **Codifeed** - AI Coding Assistant Guide

This document provides guidance to AI coding assistants when working in this project.

## Project Overview

This project is the source code for **Codifeed**.

**Codifeed** is a modern and open-source social network.

## Repository Structure

The project is a monorepo with the following root folder structure:

- `api/`: Flask API written in Python (backend)
- `web/`: React frontend written in Typescript (frontend)

### Flask API Structure

- `api/app/`: Flask API source code
  - `api/app/middlewares/`: API middlewares
  - `api/app/routes/`: API routes
  - `api/app/services/`: API services
  - `api/app/utils/`: API utilities
  - `api/app/__init__.py`: API entry point
  - `api/app/config.py`: API configuration
  - `api/app/database.py`: API database connection
  - `api/app/models.py`: API models
  - `api/app/schemas.py`: API schemas
- `api/tests/`: API tests
- `api/pyproject.toml`: API Poetry project file
- `api/dev.py`: API development server
- `api/Dockerfile`: API Production Docker image
- `api/wsgi.py`: API WSGI entry point

### React Frontend Structure

- `web/src/`: React frontend source code
  - `web/src/assets/`: Frontend shared assets
  - `web/src/components/`: Frontend shared components
    - `web/src/components/ui/`: Frontend shared UI components (mostly from Shadcn UI)
  - `web/src/hooks/`: Frontend shared hooks
  - `web/src/routes/`: Frontend Tanstack Router routes
  - `web/src/services/`: Frontend shared services
  - `web/src/styles/`: Frontend shared styles
  - `web/src/types/`: Frontend shared types
  - `web/src/utils/`: Frontend shared utilities
  - `web/src/features/`: Frontend features (auth, marketing, posts, search, users, etc.)
    - `web/src/features/[feature_name]/`: Specific feature folder
      - `web/src/features/[feature_name]/api`: API queries and mutations (Tanstack Query)
      - `web/src/features/[feature_name]/assets`: Feature assets
      - `web/src/features/[feature_name]/components`: Feature components
      - `web/src/features/[feature_name]/hooks`: Feature hooks
      - `web/src/features/[feature_name]/services`: Feature services
      - `web/src/features/[feature_name]/utils.ts`: Feature utilities
  - `web/src/main.tsx`: Frontend entry point
- `web/package.json`: Frontend package.json

## Project Architecture

### Core Components

- The API is a Flask application built with `Flask-OpenAPI3` for automatic OpenAPI specification generation
- The frontend is a React application built with `Tanstack Router` and `Tanstack Query` for data fetching and state management
- The database is a PostgreSQL database

### Types

- The project is fully type-safe, thanks to the OpenAPI3 specification and the generated types
- Typescript types are automatically generated from the OpenAPI3 specification with `openapi-typescript`
- A typescript fetch client is automatically generated with `openapi-fetch` and used to interact with the API

### Data Flow

- Database models in `api/app/models.py` define the data schema
- API uses SQLModel (ORM based on SQLAlchemy and Pydantic) to interact with the database
- API serves data to React frontend via REST endpoints in `api/app/routes/`
- Frontend routes and components consume data from the API using the typed fetch client and Tanstack Query

### Authentication

- The API uses JWT for authentication. JWT is set as an HttpOnly cookie when the user logs in
- The frontend uses the JWT to authenticate requests to the API by sending it in request cookies
- When authenticated, user is stored in Tanstack Query's cache

## Code Conventions

### Python Code Conventions

- Naming
  - Files: snake_case
  - Variables/functions: snake_case
  - Classes: CamelCase
  - Constants: UPPER_CASE
  - Boolean properties: Affirmative (is_visible, NOT is_hidden)
  - Dictionaries: keys_to_values pattern (e.g., ids_to_instances)
- Imports
  - Prefer importing modules, not values or functions (e.g., `import traceback` instead of `from traceback import print_exc`)

### Typescript Code Conventions

- Naming
  - Files: kebab-case
  - Variables/functions: camelCase
  - Constants: UPPER_CASE
  - Boolean properties: Affirmative (isVisible, NOT isHidden)
- Imports
  - Prefer named imports, not default imports (e.g., `import { useEffect } from 'react'` instead of `import React from 'react'`)

## Development Guidelines & Workflow

### UI Components & Styling

- Always use TailwindCSS utility classes for styling.
- Use shared ui components from `web/src/components/ui` when possible.
- Add new shared ui components with `shadcn/ui` when needed.

## Security & Compliance

- Use environment variables for sensitive data.
- Never read or write `*.env` files directly. Use `.env.example` as a reference instead.
- Never commit secrets or sensitive data.

## Testing Strategy

Tests are not implemented yet.

## Development Commands

TODO: Add development commands. (with Makefile)

## Additional Rules

- When stuck, ask a clarifying question to the user or propose a short plan of action to try instead of guessing.
