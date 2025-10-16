# WebFrontendContainer (Notes App - no-auth preview)

A lightweight React app with a polished, responsive UI for managing notes without authentication.

## Run locally

1) Install dependencies
   npm install

2) Configure environment
   cp .env.example .env
   # Optional: edit .env to set REACT_APP_API_BASE_URL=http://localhost:3001
   # If not set, the app uses CRA proxy to http://localhost:3001 for relative API calls.

3) Start the dev server
   npm start
   App runs at http://localhost:3000

## Preview/Container environments

If you access the CRA dev server via a preview domain or reverse proxy and see "Invalid Host header":

- Use the provided .env.development which includes:
  - HOST=0.0.0.0 (bind to all interfaces)
  - DANGEROUSLY_DISABLE_HOST_CHECK=true (allow preview host)
- If hot reloading behaves inconsistently, you can also set FAST_REFRESH=false.

Commands:
- npm start will pick up .env.development automatically in development mode.

Security note: These flags apply to development only and should not be used in production builds.

## Notes

- All routes are public. No auth remnants should affect the UI.
- API base URL and optional debug logging are configured via environment variables.
- Development proxy is configured to http://localhost:3001 to avoid CORS for relative paths.
- The UI uses a tiny utility stylesheet at src/styles/utilities.css for consistent spacing, buttons, and layout.

Refer to README-NOTES-APP.md for more details about features and endpoints.
