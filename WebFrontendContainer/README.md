# WebFrontendContainer (Notes App - no-auth preview)

A lightweight React app with a polished, responsive UI for managing notes without authentication.

## Run locally

1) Install dependencies
   npm install

2) Configure environment
   cp .env.example .env
   # then edit .env to set:
   # REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
   # Note: The base URL must include /api/v1 to match backend OpenAPI paths.

3) Start the dev server
   npm start
   App runs at http://localhost:3000

## Notes

- All routes are public. No auth remnants should affect the UI.
- API base URL and optional debug logging are configured via environment variables.
- The UI uses a tiny utility stylesheet at src/styles/utilities.css for consistent spacing, buttons, and layout.

Refer to README-NOTES-APP.md for more details about features and endpoints.
