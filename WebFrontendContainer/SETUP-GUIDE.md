# Setup and Verification Guide

This guide walks you through setting up the frontend, connecting it to the backend, and verifying everything works.

## Prerequisites

- Node.js 16+ installed
- Backend API running on port 3001
- Backend CORS configured to allow frontend origin

## Step 1: Install Dependencies

```bash
cd WebFrontendContainer
npm install
```

## Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set your backend URL
# For local development:
echo "REACT_APP_API_BASE_URL=http://localhost:3001/api/v1" > .env

# Optional: Enable debug logging
echo "REACT_APP_API_DEBUG=true" >> .env
```

## Step 3: Verify Backend Connectivity

### Option A: Use the Node.js verification script
```bash
node verify-backend.js
```

### Option B: Use the bash script
```bash
chmod +x test-api-connection.sh
./test-api-connection.sh
```

### Option C: Manual verification
```bash
# Health check
curl http://localhost:3001/health

# Auth endpoint (expect 400/422)
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{}'

# Notes endpoint (expect 401)
curl http://localhost:3001/api/v1/notes
```

If all checks pass, the backend is ready!

## Step 4: Start the Frontend

```bash
npm start
```

The app should open at http://localhost:3000

## Step 5: Verify the Integration

Follow the integration checklist in `INTEGRATION-CHECKLIST.md`:

### Quick Smoke Test
1. Navigate to http://localhost:3000
2. Click "Register" in the header
3. Fill in username, email, password
4. Click "Register" button
5. After registration, login with your credentials
6. You should be redirected to the notes page
7. Click "New Note"
8. Create a note with title and content
9. Verify the note appears in the list

If all steps work, the integration is successful! ✓

## Troubleshooting

### Problem: "Network error" on all requests

**Symptoms:**
- All API calls fail immediately
- Console shows network errors
- No requests appear in Network tab

**Solutions:**
1. Verify backend is running:
   ```bash
   curl http://localhost:3001/health
   ```
2. Check `.env` file has correct URL
3. Restart frontend after changing `.env`

### Problem: CORS errors

**Symptoms:**
- Requests blocked by CORS policy
- Console shows: "Access-Control-Allow-Origin" errors

**Solutions:**
1. Backend must allow `http://localhost:3000` origin
2. Check backend CORS middleware:
   ```python
   # FastAPI example
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### Problem: 401 Unauthorized after login

**Symptoms:**
- Login succeeds but subsequent requests fail with 401
- Token exists in localStorage but not accepted

**Solutions:**
1. Check token format in localStorage (should be JWT)
2. Verify Authorization header in requests: `Bearer <token>`
3. Check backend JWT configuration
4. Verify token expiration time

### Problem: Forms not submitting

**Symptoms:**
- Click submit but nothing happens
- No API requests in Network tab

**Solutions:**
1. Check browser console for JavaScript errors
2. Enable debug mode: `REACT_APP_API_DEBUG=true`
3. Verify form validation passes
4. Check network tab for request payload

### Problem: "Invalid Host header" in preview

**Symptoms:**
- Preview URL shows "Invalid Host header" error
- Works on localhost but not preview domain

**Solutions:**
1. `.env.development` should have:
   ```
   HOST=0.0.0.0
   DANGEROUSLY_DISABLE_HOST_CHECK=true
   ```
2. Restart dev server after changes

## Testing Checklist

Use this quick checklist to verify core functionality:

- [ ] User can register
- [ ] User can login
- [ ] Token is stored in localStorage
- [ ] Authenticated requests include Authorization header
- [ ] User can create a note
- [ ] User can view a note
- [ ] User can edit a note
- [ ] User can delete a note
- [ ] Search works
- [ ] Pagination works
- [ ] Error messages are user-friendly
- [ ] Logout works

## Debug Mode

To see detailed API logs:

1. Edit `.env`:
   ```
   REACT_APP_API_DEBUG=true
   ```

2. Restart: `npm start`

3. Open browser console - you'll see:
   ```
   [API REQ] POST http://localhost:3001/api/v1/auth/login {...}
   [API RES] 200 /api/v1/auth/login {...}
   ```

## Production Deployment

1. Build the app:
   ```bash
   npm run build
   ```

2. Set production environment variables:
   ```bash
   REACT_APP_API_BASE_URL=https://your-backend.com/api/v1
   ```

3. Deploy the `build/` folder to your hosting service

4. Verify backend CORS allows production origin

## Need Help?

1. Check `INTEGRATION-CHECKLIST.md` for detailed verification steps
2. Review `README.md` for API endpoint documentation
3. Enable debug mode to see request/response details
4. Check backend logs for error details

## Success!

When you can:
- Register a new account
- Login successfully
- Create, view, edit, and delete notes
- Search and paginate through notes
- See user-friendly error messages

...then your integration is complete! 🎉
