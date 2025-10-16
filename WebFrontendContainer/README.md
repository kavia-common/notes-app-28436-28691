# WebFrontendContainer (Notes App)

A lightweight React app with a polished, responsive UI for managing notes with authentication.

## Run locally

1) Install dependencies
   ```bash
   npm install
   ```

2) Configure environment
   ```bash
   cp .env.example .env
   ```
   
   **IMPORTANT:** Edit `.env` and set the backend API URL:
   ```
   REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
   ```
   
   For preview/production environments, use the actual backend URL:
   ```
   REACT_APP_API_BASE_URL=https://your-backend-domain.com/api/v1
   ```

   Optional debug logging:
   ```
   REACT_APP_API_DEBUG=true
   ```

3) Start the dev server
   ```bash
   npm start
   ```
   App runs at http://localhost:3000

## Preview/Container environments

If you access the CRA dev server via a preview domain or reverse proxy and see "Invalid Host header":

- Use the provided `.env.development` which includes:
  - `HOST=0.0.0.0` (bind to all interfaces)
  - `DANGEROUSLY_DISABLE_HOST_CHECK=true` (allow preview host)
- If hot reloading behaves inconsistently, you can also set `FAST_REFRESH=false`.

Commands:
- `npm start` will pick up `.env.development` automatically in development mode.

Security note: These flags apply to development only and should not be used in production builds.

## Backend API Connection

The frontend connects to the backend API at the URL specified in `REACT_APP_API_BASE_URL`. 

**Expected backend endpoints:**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/notes` - List notes (with pagination/search)
- `POST /api/v1/notes` - Create note
- `GET /api/v1/notes/{id}` - Get note
- `PUT /api/v1/notes/{id}` - Update note
- `DELETE /api/v1/notes/{id}` - Delete note
- `POST /api/v1/notes/{id}/summarize` - Generate summary

All authenticated endpoints require `Authorization: Bearer <token>` header, which is automatically added by the API client when a user is logged in.

## CORS Configuration

The backend must allow CORS from the frontend origin. In development:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

Ensure the backend CORS middleware allows the frontend origin.

## Environment Variables

- `REACT_APP_API_BASE_URL`: **Required** - Base URL of backend API (e.g., http://localhost:3001/api/v1)
- `REACT_APP_API_DEBUG`: If "true", logs API requests/responses to console (dev only)
- `HOST`: Dev server bind address (use 0.0.0.0 for containers)
- `DANGEROUSLY_DISABLE_HOST_CHECK`: Allow access via preview domains (dev only)
- `FAST_REFRESH`: Enable/disable hot reload (set false if issues occur)

## Testing

The frontend expects:
1. Backend running on the URL specified in `REACT_APP_API_BASE_URL`
2. CORS properly configured on backend
3. JWT authentication working
4. All CRUD endpoints returning expected response formats per OpenAPI spec

Refer to README-NOTES-APP.md for more details about features and UI/UX.
