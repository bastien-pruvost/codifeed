# Codifeed - Roadmap

This document outlines the development plan for Codifeed, a full-stack social network for developers.

## Phase 1: MVP Foundation - Backend & Frontend Setup

### Backend (Flask API - `api/`)

- [x] Set up initial Flask project structure ([api/app/**init**.py](mdc:api/app/__init__.py), [api/run.py](mdc:api/run.py)).
- [ ] Integrate **SQLModel** as the ORM with an **SQLite** database.
- [ ] Implement database migrations (e.g., Alembic, or manual SQLModel sync for early dev).
- [ ] Create User model (id, username, email, hashed_password, created_at, **role** (admin, user, guest)) in [api/app/models](mdc:api/app/models).
- [ ] Implement JWT-based authentication (e.g., Flask-JWT-Extended):
  - [ ] Registration endpoint (`/auth/register`) in [api/app/routes](mdc:api/app/routes).
  - [ ] Login endpoint (`/auth/login`) in [api/app/routes](mdc:api/app/routes).
- [ ] Implement role-based access control for API endpoints.
- [ ] Set up OpenAPI specification generation.
- [ ] Basic User Profile model (linked to User, bio, **avatar_url (S3)**, location, **skills string/list**) in [api/app/models](mdc:api/app/models).
- [ ] CRUD API endpoints for User Profiles (`/profiles/{username}`) in [api/app/routes](mdc:api/app/routes).
- [ ] Set up AWS S3 bucket and credentials for image uploads.
- [ ] Implement avatar upload endpoint (receives image, uploads to S3, stores URL in profile).

### Frontend (React + TanStack Router - `web/`)

- [ ] Set up React project with Vite ([web/src/main.tsx](mdc:web/src/main.tsx)).
- [ ] Integrate TanStack Router and define basic route structure in [web/src/routes](mdc:web/src/routes).
- [ ] Set up **Tailwind CSS** for styling.
- [ ] Integrate **shadcn/ui** for UI components (e.g., in [web/src/components](mdc:web/src/components)).
- [ ] Create basic layout components (Navbar, Footer, Sidebar if needed) in [web/src/components](mdc:web/src/components).
- [ ] Implement pages:
  - [ ] Login page.
  - [ ] Registration page.
  - [ ] User Profile page (display only for now, including avatar, bio, skills).
  - [ ] Settings page for profile updates.
- [ ] Set up `openapi-typescript` to generate types ([web/src/types/api.gen.ts](mdc:web/src/types/api.gen.ts)).
- [ ] Set up `openapi-fetch` for type-safe API calls (likely in [web/src/services/api](mdc:web/src/services/api)).
- [ ] Implement authentication flow (login, register, storing JWT, handling roles).
- [ ] Implement protected routes/pages based on user roles (guest, user, admin).
- [ ] Implement UI for profile editing, including avatar upload to the backend.
- [ ] Basic state management for user session (e.g., Zustand, Jotai, or React Context).

## Phase 2: MVP Core Social - Posts & Interactions

### Backend

- [ ] Create Post model (id, user_id, content (Markdown), created_at, updated_at) in [api/app/models](mdc:api/app/models).
- [ ] API endpoint to create a post.
- [ ] API endpoint to read a post.
- [ ] API endpoint to update a post.
- [ ] API endpoint to delete a post.
- [ ] API endpoint for a chronological feed (`/feed`).
- [ ] API endpoint to get posts by a specific user (`/users/{username}/posts`).
- [ ] Create Like model (user_id, post_id, created_at) in [api/app/models](mdc:api/app/models).
- [ ] API endpoint to like/vote a post.
- [ ] API endpoint to unlike/unvote a post.
- [ ] Create Comment model (id, user_id, post_id, content (Markdown), created_at, updated_at) in [api/app/models](mdc:api/app/models).
- [ ] API endpoint to create a comment on a post.
- [ ] API endpoint to read comments for a post.
- [ ] API endpoint to update a comment.
- [ ] API endpoint to delete a comment.
      All new API endpoints will be in [api/app/routes](mdc:api/app/routes).

### Frontend

- [ ] Component to display a single post in [web/src/components](mdc:web/src/components).
- [ ] Implement a **Markdown editor** for creating/editing posts and comments.
- [ ] UI for creating a new post.
- [ ] Display user's posts on their profile page.
- [ ] Create a Feed page (`/feed`) in [web/src/routes](mdc:web/src/routes).
- [ ] Implement like/vote functionality on posts.
- [ ] Display like counts on posts.
- [ ] UI for viewing comments on a post.
- [ ] UI for creating new comments on a post.

## Phase 3: MVP Social Dynamics & Discovery

### Backend

- [ ] Create Follow model (follower_id, followed_id, created_at) in [api/app/models](mdc:api/app/models).
- [ ] API endpoint to follow a user.
- [ ] API endpoint to unfollow a user.
- [ ] API endpoint to list a user's followers.
- [ ] API endpoint to list users a user is following.
- [ ] Update feed logic (`/feed`).
- [ ] Basic search API:
  - [ ] Endpoint to search users.
  - [ ] Endpoint to search posts.
- [ ] Create Notification model (recipient_id, actor_id, type, post_id, read_status, created_at) in [api/app/models](mdc:api/app/models).
- [ ] Logic to create notifications.
- [ ] API endpoint to get a user's notifications.
- [ ] API endpoint to mark notifications as read.
      All new API endpoints will be in [api/app/routes](mdc:api/app/routes).

### Frontend

- [ ] Add follow/unfollow buttons to user profiles.
- [ ] Display follower/following counts on profiles.
- [ ] (Optional) Pages to list followers/following.
- [ ] Update Feed page.
- [ ] Basic search UI.
- [ ] Search results page.
- [ ] UI for displaying notifications.
- [ ] Indicate unread notifications.

## Phase 4: Developer-Specific Features (Post-MVP)

### Projects Showcase

- [ ] **Backend**: Project model in [api/app/models](mdc:api/app/models). CRUD APIs, Like/Comment models for Projects in [api/app/routes](mdc:api/app/routes) and [api/app/models](mdc:api/app/models).
- [ ] **Frontend**: UI for projects on profile, add/edit projects, view/like/comment on projects in [web/src/components](mdc:web/src/components) and [web/src/routes](mdc:web/src/routes).

### Stacks and Technologies

- [ ] **Backend**: Technology/Stack model, UserInterestInTechnology model in [api/app/models](mdc:api/app/models). APIs in [api/app/routes](mdc:api/app/routes). Like/Comment models for Stacks/Technologies.
- [ ] **Frontend**: UI for Stacks/Technologies in [web/src/components](mdc:web/src/components) and [web/src/routes](mdc:web/src/routes).

### Code Snippets

- [ ] **Backend**: CodeSnippet model in [api/app/models](mdc:api/app/models). CRUD APIs in [api/app/routes](mdc:api/app/routes).
- [ ] **Frontend**: UI for Code Snippets in [web/src/components](mdc:web/src/components) and [web/src/routes](mdc:web/src/routes).

## Phase 5: Polish, Testing & Deployment Prep

- [ ] **General Polish**
  - [ ] Refine UI/UX.
  - [ ] Improve error handling.
  - [ ] Accessibility review.
  - [ ] Performance optimizations.
- [ ] **Testing**
  - [ ] Backend: Unit and integration tests (pytest).
  - [ ] Frontend: Component tests (Vitest/Jest), E2E tests (Cypress/Playwright).
- [ ] **Deployment**
  - [ ] Dockerize backend and frontend.
  - [ ] Set up CI/CD pipelines.
  - [ ] Deploy backend.
  - [ ] Deploy frontend.
  - [ ] Set up database for production.
  - [ ] Configure S3 for production.
  - [ ] Domain name and SSL setup.
