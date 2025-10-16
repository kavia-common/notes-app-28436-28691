# Frontend API Integration Changes

This document summarizes all changes made to align the frontend with the backend API.

## Overview

The frontend has been updated to properly connect to the backend API running on port 3001 with base path `/api/v1`. All authentication flows, CORS handling, error messages, and form submissions have been fixed. **NEW:** Added support for preview environments with automatic detection, proxy mode, and comprehensive backend health checking.

## Latest Updates (Preview Environment Support & Health Checks)

### Backend Health Monitoring
- **NEW:** Added `BackendHealthCheck` component for runtime backend availability verification
- Displays clear, actionable error messages when backend is unreachable
- Shows backend URL, troubleshooting steps, and retry functionality
- Provides detailed network diagnostics in error states
- Automatically checks backend health on component mount

### Enhanced Error Messages
- Registration/login forms now show detailed troubleshooting information on network errors
- Error messages include backend URL, CORS guidance, and connectivity steps
- Multi-line formatted error display with proper whitespace handling
- Technical details (status, URL) included when available for debugging

### Preview Environment Configuration
- API client now supports both **proxy mode** (relative URLs) and **absolute URL mode**
- Automatically detects environment via `REACT_APP_USE_PROXY` flag
- Enhanced error messages specifically for `/auth/register` and `/auth/login` endpoints
- Added runtime logging when `REACT_APP_API_DEBUG=true` to show resolved URLs
- Updated `.env` to use preview backend URL: `https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1`

### Configuration Clarity
- **NEW:** Clear distinction between absolute URL mode (recommended for preview) and proxy mode
- Updated README with specific guidance for preview environment setup
- Added troubleshooting section for common preview issues
- Documented CORS requirements for preview domains

### Proxy Mode Configuration
- Added `"proxy": "http://localhost:3001"` to `package.json` for CRA dev server
- When `REACT_APP_USE_PROXY=true`, uses empty baseURL for same-origin requests
- Prevents CORS issues by proxying through CRA dev server
- Works alongside environment-based absolute URL configuration

### Error Handling Improvements
- Network errors now show: "Cannot reach backend. Please ensure Backend API is running."
- Registration errors include backend URL and CORS guidance with troubleshooting steps
- Added status text display when available from request object
- Form submit buttons properly disabled during submission to prevent double-submit
- Error banners support multi-line formatting with `whiteSpace: "pre-wrap"`

### Updated Files
- `src/services/api.ts` - Added proxy mode detection and enhanced error context
- `src/components/BackendHealthCheck.tsx` - **NEW:** Health check component with retry logic
- `src/components/withBackendCheck.tsx` - **NEW:** HOC for wrapping components with health check
- `package.json` - Added proxy field for preview environments
- `.env` - Updated to use preview backend URL
- `.env.example` - Comprehensive guide for proxy vs absolute URL modes
- `.env.development` - Preview-specific guidance with commented examples
- `src/pages/Register.tsx` - Enhanced error display with detailed troubleshooting
- `src/pages/Login.tsx` - Matching error handling improvements with troubleshooting
- `README.md` - **NEW:** Clear preview configuration section with mode comparison

## Changes Made

### 1. API Client Configuration (`src/services/api.ts`)

**What changed:**
- **NEW:** Added proxy mode support via `REACT_APP_USE_PROXY` flag
- **NEW:** Runtime environment detection logs resolved base URL when debug enabled
- Set default base URL to `http://localhost:3001/api/v1` (with env override)
- Added automatic Authorization header attachment from localStorage token
- Enhanced error handling with user-friendly messages
- **NEW:** Specific error messages for `/auth/register` and `/auth/login` endpoints
- Added request/response interceptors for debugging
- Fixed all API endpoints to match OpenAPI spec
- **NEW:** Network error messages include backend URL for troubleshooting

**Why:**
- Backend requires `/api/v1` prefix on all endpoints
- Preview environments need flexible configuration (proxy or absolute)
- JWT tokens must be sent in Authorization header
- Users need clear error messages, especially about backend connectivity
- Supports both development and production deployment scenarios
- **NEW:** Troubleshooting guidance helps users diagnose connection issues

### 2. Authentication Service (`src/services/auth.ts` & `.jsx`)

**What changed:**
- Updated login to properly extract and store `access_token` from response
- Added token persistence to localStorage
- Enhanced error propagation with user-friendly messages
- Fixed token attachment to all authenticated requests

**Why:**
- Backend returns `{ access_token, expires_in }` per OpenAPI spec
- Token must persist across page refreshes
- All authenticated endpoints require Bearer token

### 3. Environment Configuration

**Files updated:**
- `.env` - **NEW:** Updated to use preview backend URL
- `.env.example` - **NEW:** Complete guide for proxy vs absolute URL modes
- `.env.development` - **NEW:** Preview-specific guidance with backend URL examples

**What changed:**
- **NEW:** Set `REACT_APP_API_BASE_URL=https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1`
- **NEW:** Enabled `REACT_APP_API_DEBUG=true` for troubleshooting
- **NEW:** Added `REACT_APP_USE_PROXY` flag for proxy mode
- Added clear comments explaining each variable and mode
- Documented production deployment requirements
- **NEW:** Preview environment configuration examples
- **NEW:** Clear mode comparison (absolute URL vs proxy)

**Why:**
- React requires `REACT_APP_` prefix for custom env vars
- `/api/v1` path is mandatory for backend routes
- Preview environments need HOST and DANGEROUSLY_DISABLE_HOST_CHECK
- Proxy mode avoids CORS issues in certain deployment scenarios
- **NEW:** Users need clear guidance on which mode to use

### 4. Package Configuration (`package.json`)

**What changed:**
- **NEW:** Added `"proxy": "http://localhost:3001"` setting for CRA proxy
- Added `verify` and `verify:bash` npm scripts

**Why:**
- Supports proxy mode alongside absolute URL mode
- Proxy eliminates CORS issues during development
- Environment variable can override to use absolute URLs
- Makes it easier to test backend connectivity

### 5. Application Routes (`src/App.tsx`)

**What changed:**
- Added `/login` and `/register` public routes
- Wrapped all note routes in `<PrivateRoute>`
- Proper redirect to login when not authenticated

**Why:**
- Authentication is required per OpenAPI spec
- All note endpoints return 401 without valid token
- Better user experience with proper auth flow

### 6. Header Component (`src/components/Layout/Header.tsx`)

**What changed:**
- Added login/register links for unauthenticated users
- Added logout button for authenticated users
- Show different navigation based on auth state

**Why:**
- Users need access to login/register
- Clear indication of auth state
- Easy logout functionality

### 7. Login & Register Pages

**What changed:**
- Enhanced styling with card layout
- **NEW:** Detailed error message display with backend connectivity context and troubleshooting
- **NEW:** Form validation and disabled states during submission
- **NEW:** Prevent double-submit by disabling button while processing
- **NEW:** Added autocomplete attributes for better UX
- **NEW:** Multi-line error display with troubleshooting guidance
- **NEW:** Network errors show backend URL and actionable steps
- Auto-login after successful registration

**Why:**
- Better UX with polished forms
- Clear error feedback from backend with actionable guidance
- Prevent accidental double submissions
- Seamless flow from register to notes
- **NEW:** Users need clear guidance when backend is unavailable

### 8. Documentation

**New files:**
- `README.md` - **NEW:** Updated with preview configuration section
- `README-NOTES-APP.md` - Complete feature documentation
- `SETUP-GUIDE.md` - Step-by-step setup instructions
- `INTEGRATION-CHECKLIST.md` - Verification checklist
- `CHANGES.md` - This file (**updated with health check and preview support**)
- `verify-backend.js` - Node.js connectivity test
- `test-api-connection.sh` - Bash connectivity test
- `src/components/BackendHealthCheck.tsx` - **NEW:** Health check component
- `src/components/withBackendCheck.tsx` - **NEW:** HOC for health checking

**Why:**
- Clear instructions for setup and troubleshooting
- Verification tools to ensure backend connectivity
- Comprehensive integration checklist
- **NEW:** Guide for preview environment configuration
- **NEW:** Runtime health checking for better UX

## API Endpoint Mapping

### Authentication Endpoints

| Frontend Call | Backend Endpoint | Method | Auth Required |
|--------------|------------------|--------|---------------|
| `login(email, password)` | `/api/v1/auth/login` | POST | No |
| `register(username, email, password)` | `/api/v1/auth/register` | POST | No |
| `logout()` | `/api/v1/auth/logout` | POST | Yes |

### Notes Endpoints

| Frontend Call | Backend Endpoint | Method | Auth Required |
|--------------|------------------|--------|---------------|
| `listNotes({ page, page_size, search })` | `/api/v1/notes` | GET | Yes |
| `createNote({ title, content })` | `/api/v1/notes` | POST | Yes |
| `getNote(id)` | `/api/v1/notes/{id}` | GET | Yes |
| `updateNote(id, { title, content })` | `/api/v1/notes/{id}` | PUT | Yes |
| `deleteNote(id)` | `/api/v1/notes/{id}` | DELETE | Yes |
| `summarizeNote(id)` | `/api/v1/notes/{id}/summarize` | POST | Yes |

## Error Handling

The frontend now properly handles these error scenarios:

### Network Errors
- **Cause:** Backend not running or unreachable
- **Message:** "Cannot reach backend. Please ensure Backend API is running."
- **NEW:** Includes endpoint-specific context (registration vs login vs notes)
- **NEW:** Shows backend URL when available for debugging
- **NEW:** Provides detailed troubleshooting steps including CORS guidance

### Authentication Errors (401)
- **Cause:** Invalid or missing token
- **Message:** Backend error message or "Unauthorized"
- **Action:** Redirect to login page

### Validation Errors (400/422)
- **Cause:** Invalid request payload
- **Message:** Backend validation error details
- **Display:** User-friendly field-specific errors

### Server Errors (500)
- **Cause:** Backend internal error
- **Message:** Backend error message or generic fallback
- **Display:** Error banner with retry option

## Configuration Modes

### Mode 1: Absolute URL (Recommended for Preview)
```env
REACT_APP_API_BASE_URL=https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1
```

**Use when:**
- Backend is on different domain/port
- CORS is properly configured on backend
- Preview/production deployments
- **Easier troubleshooting with explicit URLs**

### Mode 2: Proxy (Alternative)
```env
REACT_APP_USE_PROXY=true
```
**Requires:** `package.json` has `"proxy": "http://localhost:3001"`

**Use when:**
- Backend and frontend on same domain
- Want to avoid CORS configuration in development
- Preview environment routes through same origin

## CORS Requirements

For the frontend to communicate with the backend, the backend must:

1. Allow origin: `https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000` (preview) or `http://localhost:3000` (local)
2. Allow methods: `GET, POST, PUT, DELETE, OPTIONS`
3. Allow headers: `Content-Type, Authorization`
4. Allow credentials: `true`

Example FastAPI CORS configuration:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing the Integration

### Quick Test
```bash
# 1. Verify backend is accessible
npm run verify

# 2. Start frontend
npm start

# 3. Open https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000
# 4. Click "Register" and create account
# 5. Login with new credentials
# 6. Create a note
# 7. Verify note appears in list
```

### Preview Environment Test
```bash
# 1. Backend URL already set in .env
cat .env

# 2. Debug logging already enabled
# Check browser console for resolved URL

# 3. Start and check browser console for resolved URL
npm start

# 4. Test registration with network tab open
# 5. Check console logs show correct backend URL
# 6. If backend unavailable, see clear error with troubleshooting steps
```

### Complete Test
Follow the checklist in `INTEGRATION-CHECKLIST.md`

## Environment Variables Summary

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_BASE_URL` | Yes | `http://localhost:3001/api/v1` | Backend API base URL |
| `REACT_APP_USE_PROXY` | No | `false` | Enable proxy mode (relative URLs) |
| `REACT_APP_API_DEBUG` | No | `false` | Enable API request logging |
| `HOST` | No | `localhost` | Dev server bind address |
| `DANGEROUSLY_DISABLE_HOST_CHECK` | No | `false` | Allow preview domains |
| `FAST_REFRESH` | No | `true` | Enable hot reload |

## Troubleshooting

### Backend not responding
```bash
# Check if backend is running
curl https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/health

# If not, start the backend
cd ../BackendAPIContainer
# Follow backend startup instructions
```

### CORS errors
- Verify backend CORS allows frontend origin (check preview URL)
- Check browser Network tab for CORS headers
- Ensure backend includes `Access-Control-Allow-Origin` header
- **NEW:** Error messages now include CORS troubleshooting guidance

### Authentication not working
- Check localStorage for token
- Verify Authorization header in requests
- Try logging in again to get fresh token
- Check backend JWT configuration

### Form submissions fail (Network Error)
- Enable debug mode: `REACT_APP_API_DEBUG=true`
- Check browser console for resolved base URL
- Verify request payload matches OpenAPI spec
- Check backend logs for errors
- **NEW:** Error messages show backend URL and troubleshooting steps
- **NEW:** Try proxy mode if CORS is causing issues

### Preview environment issues
- Check `.env` has correct backend preview URL
- Enable debug logging to see resolved URLs
- Verify backend is accessible from preview domain
- Consider using proxy mode if same-origin
- **NEW:** Health check component will show clear error with guidance

## Success Criteria

The integration is successful when:

- [ ] User can register with username, email, password
- [ ] User can login and receives JWT token
- [ ] Token is stored in localStorage
- [ ] All note CRUD operations work
- [ ] Search and pagination work
- [ ] Error messages are user-friendly and actionable
- [ ] No CORS errors in console
- [ ] Authorization header sent on all authenticated requests
- [ ] **NEW:** Registration shows helpful error when backend unavailable with troubleshooting
- [ ] **NEW:** Debug mode shows resolved API base URL
- [ ] **NEW:** Health check component displays on backend failure
- [ ] **NEW:** Error messages include backend URL and CORS guidance

## Next Steps

After verifying the integration:

1. Run the full test suite: `npm test`
2. Check code quality: `npm run lint`
3. Test in preview environment with debug enabled
4. Build for production: `npm run build`
5. Deploy to hosting service

For production deployment, remember to:
- Set `REACT_APP_API_BASE_URL` to production backend URL
- Ensure backend CORS allows production frontend origin
- Use HTTPS for all communications
- Verify JWT tokens have appropriate expiry times
- Disable debug logging
