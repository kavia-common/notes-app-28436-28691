# Notes App - Web Frontend (React, no-auth preview)

A polished, lightweight React UI for managing notes without authentication (preview mode).

- Public routes only (no login/register, no protected routes)
- Notes CRUD: list (search + pagination), create, edit, view, delete
- Optional AI summarize action on detail page (hidden if not available)
- Responsive, accessible layout with consistent buttons, forms, banners, and skeleton loaders
- Environment-driven API base URL

## Quick Start

1) Install dependencies
   npm install

2) Configure environment
   cp .env.example .env
   # Optional:
   # REACT_APP_API_BASE_URL=http://localhost:3001
   # REACT_APP_API_DEBUG=true

   If not set, the app uses CRA proxy to http://localhost:3001 for relative API calls during development.
   Edit .env and set REACT_APP_API_BASE_URL if you need an absolute URL (e.g., deployed backend).

   For preview/container environments, ensure .env.development includes:
   - HOST=0.0.0.0
   - DANGEROUSLY_DISABLE_HOST_CHECK=true
   Optionally set FAST_REFRESH=false if hot reload loops occur.

3) Run the app
   npm start
   Open http://localhost:3000 (or the platform-provided preview URL)

## Environment Variables

- REACT_APP_API_BASE_URL: Base URL of backend API, e.g., http://localhost:8000/api/v1
- REACT_APP_API_DEBUG: If "true", logs API requests/responses to console (dev only)
- AUTH_ENABLED: Ignored in no-auth preview; all routes are public.

## UI/UX Notes

- Search input debounces and automatically updates the list; empty state encourages creation.
- Cards and skeleton loaders improve perception of speed.
- Forms have labels, validation, and primary/secondary actions.
- Error messages use consistent banners.
- Buttons have accessible focus states and aria-labels where appropriate.

## API Endpoints

- GET /notes?search=&page=&page_size=
- POST /notes
- GET /notes/{id}
- PUT /notes/{id}
- DELETE /notes/{id}
- POST /notes/{id}/summarize

## Favicon/Branding

If you want to customize a favicon, add an icon file in public/favicon.ico.
This template does not add heavy assets by default to keep the preview light.

