# Notes App - Web Frontend (React)

This is the web React frontend for the multi-container Notes App. In this preview build, authentication is disabled:
- No login/register pages or protected routes
- All routes are public and land on the Notes list
- No Authorization headers are attached to requests

It provides:
- Notes CRUD (list with pagination + search, create, edit, view, delete)
- Generate and display summary for a note
- Environment-driven API base URL
- Global error handling and loading states

## Getting Started

1) Install dependencies
   npm install

2) Configure environment
   cp .env.example .env
   Edit .env and set REACT_APP_API_BASE_URL to your backend API (e.g., http://localhost:8000/api/v1).
   Optional: set REACT_APP_API_DEBUG=true to log API calls for troubleshooting.

3) Run the app
   npm start
   App will run on http://localhost:3000

## Environment Variables

- REACT_APP_API_BASE_URL: Base URL of backend API, e.g., http://localhost:8000/api/v1
- REACT_APP_API_DEBUG: If "true", logs API requests/responses to console in development
- AUTH_ENABLED: Feature flag to guard auth code paths (false by default in this preview)

## API Endpoints (per OpenAPI)
- GET /notes?search=&page=&page_size=
- POST /notes
- GET /notes/{id}
- PUT /notes/{id}
- DELETE /notes/{id}
- POST /notes/{id}/summarize

## Notes

- Authentication is disabled in this build. The API client does not attach Authorization headers and does not redirect on 401.
- UI is minimal and accessible.
