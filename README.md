# Codifeed

**A modern, open-source, social network**

---

## 📖 About the Project

Codifeed is a modern and open-source social network. Built as the capstone project for Harvard's CS50x course, it demonstrates how to create a type-safe full-stack application using React (TypeScript) and Flask (Python).

This project showcases complete type safety between a Python backend and TypeScript frontend through OpenAPI specifications, advanced security patterns, and professional-grade architecture suitable for scaling.

### Project Goals

- **CS50x Validation**: Demonstrate mastery of full-stack development concepts
- **Type Safety**: Achieve 100% type safety between Python backend and TypeScript frontend
- **Best Practices**: Showcase modern web development patterns and security practices
- **Open Source**: Provide a reference implementation for the community

---

## ✨ Features

### Authentication & Security

- **JWT Authentication** - Secure registration and login system
- **Password Security** - Argon2 password hashing and validation
- **Session Management** - Automatic token refresh and secure logout

### Developer Profiles

- **Personal Profiles** - View your own and other user' profiles
- **Developer Identity** - Clean, professional profile layout for the dev community

### Posts & Content Creation

- **Text Posts** - Create and edit posts with text content
- **Post Management** - Delete your own posts

### Social Interactions

- **Engagement System** - Like posts
- **Follow Network** - Follow/unfollow other users to build your network

### Feed & Discovery

- **Feed System** - See posts from users you follow
- **Search Functionality** - Find users by name or username

### User Experience

- **Mobile-First Design** - Responsive layout optimized for all devices
- **Performance Optimized** - Fast loading with modern React patterns
- **Accessibility** - WCAG compliant design for inclusive user experience

---

## 🏗️ Infrastructure

### Enterprise-Grade Security

- **JWT Authentication** - Secure cookie-based authentication with auto-refresh
- **CSRF Protection** - Complete CSRF protection with double-submit cookie pattern
- **Input Validation** - Comprehensive input validation using Pydantic models and Zod schemas
- **SQL Injection Protection** - SQLModel ORM with safe queries

### Complete Type Safety

- **OpenAPI Integration** - Automatic API documentation and client generation with Flask-OpenAPI3 and openapi-typescript
- **Generated Types** - TypeScript types auto-generated from OpenAPI specification
- **Runtime Validation** - Request/response validation at runtime using Zod schemas
- **End-to-End Type Safety** - From database to UI components

### Developer Experience

- **Hot Reload** - Instant development feedback with Vite and Flask dev server
- **Code Quality** - Automated linting, formatting, and type checking with Ruff, Pyright, ESLint and Prettier
- **Database Migrations** - Alembic migrations with version control
- **API Documentation** - Interactive Swagger UI for API exploration

---

## 🛠️ Tech Stack

### Frontend

- **[React 19](https://react.dev/)** - Modern UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript development
- **[TanStack Router](https://tanstack.com/router)** - Type-safe routing with file-based routing
- **[TanStack Query](https://tanstack.com/query)** - Powerful data fetching and state management
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - High-quality accessible components
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Backend

- **[Python 3.13](https://www.python.org/)** - Latest Python with performance improvements
- **[Flask-OpenAPI3](https://flask-openapi3.readthedocs.io/)** - Flask with automatic OpenAPI documentation
- **[SQLModel](https://sqlmodel.tiangolo.com/)** - Modern ORM with Pydantic integration
- **[Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)** - JWT authentication for Flask
- **[Alembic](https://alembic.sqlalchemy.org/)** - Database migration tool

### Database & Storage

- **[PostgreSQL](https://www.postgresql.org/)** - Reliable relational database

### Hosting & Deployment

- **[Vercel](https://vercel.com/)** - Frontend hosting with global CDN
- **[Railway](https://railway.app/)** - Backend API hosting with automatic deployments
- **[Neon](https://neon.tech/)** - Serverless PostgreSQL hosting

### Development Tools

- **[Poetry](https://python-poetry.org/)** - Python dependency management
- **[Ruff](https://docs.astral.sh/ruff/)** - Lightning-fast Python linter and formatter
- **[Pyright](https://github.com/microsoft/pyright)** - Static type checker for Python
- **[ESLint](https://eslint.org/)** - TypeScript/React linting
- **[Prettier](https://prettier.io/)** - Code formatting

---

## 🔗 Type Safety

One of the key features of Codifeed is **complete type safety** between the backend and frontend.

### How it works

1. **Backend Models** - SQLModel defines database models with full type hints
2. **Pydantic Validation** - Automatic request/response validation
3. **OpenAPI Generation** - Flask-OpenAPI3 generates OpenAPI specification
4. **Type Generation** - `openapi-typescript` creates TypeScript types from OpenAPI
5. **Type-Safe Client** - `openapi-fetch` provides fully typed API calls
6. **Runtime Safety** - Zod schemas validate data at component boundaries

This ensures that any changes to the backend API are immediately reflected in the frontend types, catching errors at compile time rather than runtime.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 22+** and **pnpm 10+**
- **Python 3.13+** and **Poetry**
- **PostgreSQL** (or use Neon for cloud database)

### 1. Clone the repository

```bash
git clone https://github.com/bastien-limbour/codifeed.git
cd codifeed
```

### 2. Environment Setup

Copy example environment files and fill required values.

```bash
cp api/.env.example api/.env.local
cp web/.env.example web/.env.local
```

### 3. Backend Setup

```bash
cd api
poetry install
poetry run python dev.py
```

### 4. Frontend Setup

> Note: Ensure the API from the previous step is running before generating types.

```bash
cd web
pnpm install
pnpm run openapi-ts  # Generate types from API
pnpm run dev
```

### 5. Database Setup (optional)

Option A: Start a local PostgreSQL instance

```bash
docker compose -f database/docker-compose.yml up -d
```

Option B: Apply Alembic migrations

```bash
cd api
poetry run alembic upgrade head
```

Note: For local development, tables are also created automatically at app startup via SQLModel. Migrations are recommended for team/production environments.

The application will be available at:

- **Frontend**: <http://localhost:3000>
- **API**: <http://localhost:8000>
- **API Documentation**: <http://localhost:8000/openapi/swagger>

---

## 🌐 Deployment

### Production Environment

The application is designed for cloud-native deployment:

- **Frontend** → Vercel (Automatic deployments from `main` branch)
- **Backend** → Railway (Docker-based deployment)
- **Database** → Neon PostgreSQL (Serverless, auto-scaling)

---

## 🤝 Contributing

We welcome contributions! This project serves as a learning resource for developers interested in modern full-stack development.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with full type safety
4. Run tests: `pnpm test` (frontend) and `poetry run pytest` (backend)
5. Submit a pull request

### Code Standards

- **Type Safety**: All code must be fully typed
- **Testing**: New features require tests
- **Documentation**: Update docs for API changes
- **Security**: Follow OWASP security guidelines

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Harvard CS50x** for providing excellent computer science education
- **Open Source Community** for the amazing tools and libraries
- **Developer Community** for inspiration and feedback
