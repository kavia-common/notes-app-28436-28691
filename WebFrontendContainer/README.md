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
   REACT_APP_API_BASE_URL=https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1
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

## Configuration Modes

### Mode 1: Absolute URL (Recommended for Preview)

Set the full backend URL in `.env`:
```env
REACT_APP_API_BASE_URL=https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1
```

**Use when:**
- Backend is on different domain/port
- Preview environment with separate services
- Production deployments

### Mode 2: Proxy Mode (Alternative)

Enable proxy mode in `.env`:
```env
REACT_APP_USE_PROXY=true
```

The `package.json` already has `"proxy": "http://localhost:3001"` configured.

**Use when:**
- Backend and frontend on same domain
- Want to avoid CORS configuration
- Local development with both services running

**Note:** For preview environments, absolute URL mode is preferred as it's more explicit and easier to troubleshoot.

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

The backend must allow CORS from the frontend origin:

**Development:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

**Preview:**
- Frontend: https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000
- Backend: https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001

Ensure the backend CORS middleware allows the frontend origin and includes:
- `Access-Control-Allow-Origin: <frontend-url>`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- `Access-Control-Allow-Credentials: true`

## Troubleshooting

### Backend Not Responding

The app includes a built-in health check that will display a clear error message if the backend is unavailable:

- **Error message:** Shows exactly what URL is being used and why connection failed
- **Troubleshooting steps:** Provides actionable guidance
- **Retry option:** Allows users to retry connection after fixing issues

If you see "Cannot reach backend":
1. Verify backend is running: `curl https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/health`
2. Check `.env` file has correct `REACT_APP_API_BASE_URL`
3. Ensure backend CORS allows the frontend origin
4. Verify network connectivity and firewall rules

### CORS Errors

If you see CORS errors in the browser console:
- Verify backend CORS allows `https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000`
- Check browser Network tab for CORS headers in response
- Ensure backend includes proper `Access-Control-Allow-*` headers

### Registration/Login Fails

1. Open browser DevTools > Network tab
2. Try submitting the form
3. Check the request details:
   - URL should be: `https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1/auth/register`
   - Method should be: POST
   - Body should include: `{ username, email, password }`
4. Check response status and error message
5. Enable debug mode: Set `REACT_APP_API_DEBUG=true` in `.env` and restart

### "Invalid Host header" in preview

- Make sure `.env.development` has `DANGEROUSLY_DISABLE_HOST_CHECK=true`
- Verify `HOST=0.0.0.0` is set
- Restart dev server

## Environment Variables

- `REACT_APP_API_BASE_URL`: **Required** - Base URL of backend API (must include `/api/v1` path)
- `REACT_APP_USE_PROXY`: Enable proxy mode (uses relative paths)
- `REACT_APP_API_DEBUG`: Enable verbose API logging (helpful for troubleshooting)
- `HOST`: Dev server bind address (use `0.0.0.0` for containers)
- `DANGEROUSLY_DISABLE_HOST_CHECK`: Allow access via preview domains (dev only)
- `FAST_REFRESH`: Enable/disable hot reload

## Testing

The frontend expects:
1. Backend running on the URL specified in `REACT_APP_API_BASE_URL`
2. CORS properly configured on backend
3. JWT authentication working
4. All CRUD endpoints returning expected response formats per OpenAPI spec

Run tests with:
```bash
npm test
```

Linting:
```bash
npm run lint
```

## Production Build

```bash
npm run build
```

The build output will be in the `build/` directory, ready for deployment to any static hosting service.

Remember to:
- Set `REACT_APP_API_BASE_URL` to production backend URL
- Ensure backend CORS allows production frontend origin
- Use HTTPS for all communications
- Verify JWT tokens have appropriate expiry times

Refer to README-NOTES-APP.md for more details about features and UI/UX.
