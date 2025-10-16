# Notes App - Web Frontend (React)

This is the web React frontend for the multi-container Notes App. It provides:
- User authentication (Register, Login, Logout)
- Protected routes
- Notes CRUD (list with pagination + search, create, edit, view, delete)
- Generate and display summary for a note
- Environment-driven API base URL
- Global error handling and loading states

## Getting Started

1) Install dependencies
   npm install

2) Configure environment
   cp .env.example .env
   Edit .env and set REACT_APP_API_BASE_URL to your backend API (e.g., http://localhost:8000/api/v1)

3) Run the app
   npm start
   App will run on http://localhost:3000

## Environment Variables

- REACT_APP_API_BASE_URL: Base URL of backend API, e.g., http://localhost:8000/api/v1
- REACT_APP_API_DEBUG: If "true", logs API requests/responses to console in development

## API Endpoints (per OpenAPI)
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- GET /notes?search=&page=&page_size=
- POST /notes
- GET /notes/{id}
- PUT /notes/{id}
- DELETE /notes/{id}
- POST /notes/{id}/summarize

## Notes

- Tokens are stored in localStorage for persistence. On logout, token is cleared.
- Axios interceptors attach Authorization header and handle 401 by redirecting to login.
- UI is minimal and accessible.

