# Preview Environment Configuration Guide

This guide explains how to configure the WebFrontendContainer to work properly in preview environments with the BackendAPIContainer.

## Quick Setup for Preview

The frontend is already configured to work with the preview backend. Here's what's set up:

### 1. Environment Configuration (.env)

The `.env` file is configured with:
```env
REACT_APP_API_BASE_URL=https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1
REACT_APP_API_DEBUG=true
HOST=0.0.0.0
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

**What this means:**
- ✅ Frontend will connect to backend at port 3001
- ✅ Debug logging enabled for troubleshooting
- ✅ Dev server accessible from preview domain
- ✅ Host header checking disabled for reverse proxy

### 2. Configuration Mode: Absolute URL

We're using **Absolute URL mode** (recommended for preview):
- API requests go directly to: `https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1`
- No proxy required
- Clear, explicit backend URL
- Easy to troubleshoot

## Frontend URL
```
https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000
```

## Backend URL (Expected)
```
https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001
```

## Backend API Endpoints
All endpoints should be accessible at:
```
https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1/*
```

Required endpoints:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/notes` - List notes
- `POST /api/v1/notes` - Create note
- `GET /api/v1/notes/{id}` - Get note
- `PUT /api/v1/notes/{id}` - Update note
- `DELETE /api/v1/notes/{id}` - Delete note
- `POST /api/v1/notes/{id}/summarize` - Generate summary

## CORS Configuration Required

The backend MUST allow CORS from the frontend origin:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000",
        "http://localhost:3000"  # For local testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Issue: "Cannot reach backend"

**What you'll see:**
- Registration form shows detailed error with backend URL
- Error message includes troubleshooting steps
- Retry button available

**Solutions:**
1. **Check if backend is running:**
   ```bash
   curl https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/health
   ```
   
2. **Verify backend URL in browser:**
   - Open: `https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/docs`
   - Should see FastAPI documentation

3. **Check CORS configuration:**
   - Open browser DevTools > Network tab
   - Look for failed requests
   - Check response headers for CORS errors

4. **Verify environment configuration:**
   ```bash
   cat .env
   # Should show: REACT_APP_API_BASE_URL=https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1
   ```

### Issue: CORS Errors in Browser Console

**Symptoms:**
```
Access to XMLHttpRequest at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

**Solution:**
1. Backend must explicitly allow the frontend origin
2. Check backend CORS middleware configuration
3. Ensure backend includes these headers:
   - `Access-Control-Allow-Origin: https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000`
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type, Authorization`
   - `Access-Control-Allow-Credentials: true`

### Issue: "Invalid Host header"

**Solution:**
This is already fixed in `.env.development`:
```env
HOST=0.0.0.0
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

If still seeing this error, restart the dev server:
```bash
npm start
```

### Issue: Network requests timeout

**Check:**
1. Backend is actually running on port 3001
2. Firewall/network allows connections to port 3001
3. Preview domain is accessible
4. No proxy/VPN interfering

## Testing the Setup

### 1. Start Frontend
```bash
cd WebFrontendContainer
npm start
```

### 2. Open Preview URL
```
https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000
```

### 3. Test Registration
1. Click "Register" button
2. Fill in form:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
3. Click "Register"

**Expected behavior:**
- If backend is running: Registration succeeds, redirects to notes page
- If backend is NOT running: Clear error message with troubleshooting steps

### 4. Check Browser Console
With `REACT_APP_API_DEBUG=true`, you should see:
```
[API CONFIG] Mode: ABSOLUTE_URL
[API CONFIG] Base URL: https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1
[API REQ] POST https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1/auth/register {...}
```

## Alternative: Proxy Mode

If you prefer to use proxy mode (not recommended for preview, but available):

1. Edit `.env`:
   ```env
   REACT_APP_USE_PROXY=true
   # Comment out or remove REACT_APP_API_BASE_URL
   ```

2. Update `package.json` proxy (if backend is on different host):
   ```json
   "proxy": "https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001"
   ```

3. Restart dev server

**Note:** Absolute URL mode is simpler and more explicit for preview environments.

## Health Check Feature

The frontend includes a built-in health check component that:
- Automatically checks backend availability
- Displays clear error messages when backend is down
- Shows backend URL and troubleshooting steps
- Provides retry functionality
- Includes detailed diagnostics

You'll see this when:
- Backend is not running
- Backend is not accessible
- Network connection fails
- CORS blocks the request

## Environment Variables Reference

| Variable | Current Value | Purpose |
|----------|--------------|---------|
| `REACT_APP_API_BASE_URL` | `https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1` | Backend API base URL |
| `REACT_APP_API_DEBUG` | `true` | Enable verbose logging |
| `HOST` | `0.0.0.0` | Bind to all interfaces |
| `DANGEROUSLY_DISABLE_HOST_CHECK` | `true` | Allow preview domain |
| `REACT_APP_USE_PROXY` | Not set (false) | Proxy mode disabled |

## Success Checklist

- [x] `.env` configured with correct backend URL
- [x] Debug logging enabled
- [x] Host checking disabled for preview
- [x] Dev server binds to all interfaces
- [x] Error messages include troubleshooting guidance
- [x] Health check component available
- [x] CORS requirements documented
- [ ] Backend is running and accessible
- [ ] Backend CORS allows frontend origin
- [ ] Registration form works without errors

## Next Steps

1. **Ensure backend is running** on port 3001
2. **Verify backend CORS** allows frontend origin
3. **Test registration** to confirm connectivity
4. **Check browser console** for any errors
5. **Use health check** to verify backend availability

For more details, see:
- `README.md` - General setup and usage
- `CHANGES.md` - All integration changes
- `INTEGRATION-CHECKLIST.md` - Verification steps
