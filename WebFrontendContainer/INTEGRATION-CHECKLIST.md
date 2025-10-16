# Frontend-Backend Integration Checklist

Use this checklist to verify that the frontend is properly connected to the backend API.

## Pre-Flight Checks

- [ ] Backend is running on port 3001
- [ ] Backend health endpoint responds: `curl http://localhost:3001/health`
- [ ] Backend has CORS configured to allow `http://localhost:3000`
- [ ] Frontend `.env` file exists and has `REACT_APP_API_BASE_URL=http://localhost:3001/api/v1`

## Backend API Verification

Run these commands to verify backend is responding:

```bash
# Health check
curl http://localhost:3001/health

# Auth endpoint (should return 400/422 for empty body)
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{}'

# Notes endpoint (should return 401 unauthorized without token)
curl http://localhost:3001/api/v1/notes
```

Or run the verification script:
```bash
node verify-backend.js
```

## Frontend Integration Tests

### 1. Registration Flow
- [ ] Navigate to `/register` page
- [ ] Fill in username, email, password
- [ ] Click "Register" button
- [ ] Check Network tab - should see `POST /api/v1/auth/register`
- [ ] Should see 201 Created response
- [ ] Should be redirected to login or notes page

### 2. Login Flow
- [ ] Navigate to `/login` page
- [ ] Enter email and password
- [ ] Click "Login" button
- [ ] Check Network tab - should see `POST /api/v1/auth/login`
- [ ] Response should include `{ "access_token": "...", "expires_in": ... }`
- [ ] Token should be saved in localStorage (check DevTools > Application > Local Storage)
- [ ] Should be redirected to `/notes` page

### 3. Notes List
- [ ] After login, should see notes list page
- [ ] Check Network tab - should see `GET /api/v1/notes` with `Authorization: Bearer <token>` header
- [ ] Should see notes grid or "No notes yet" message
- [ ] Search box should be visible and functional

### 4. Create Note
- [ ] Click "New Note" button
- [ ] Fill in title and content
- [ ] Click "Create" button
- [ ] Check Network tab - should see `POST /api/v1/notes` with title/content in body
- [ ] Should receive 201 Created response with note object
- [ ] Should be redirected to note detail page

### 5. View Note
- [ ] Click on a note from the list
- [ ] Should navigate to `/notes/{id}` page
- [ ] Check Network tab - should see `GET /api/v1/notes/{id}`
- [ ] Note title and content should be displayed

### 6. Edit Note
- [ ] From note detail page, click "Edit" button
- [ ] Modify title or content
- [ ] Click "Save Changes"
- [ ] Check Network tab - should see `PUT /api/v1/notes/{id}` with updated data
- [ ] Should receive 200 OK with updated note
- [ ] Should be redirected back to note detail page

### 7. Delete Note
- [ ] From notes list, click "Delete" button on a note
- [ ] Confirm deletion in prompt
- [ ] Check Network tab - should see `DELETE /api/v1/notes/{id}`
- [ ] Should receive 204 No Content
- [ ] Note should be removed from list

### 8. Search Notes
- [ ] Type in search box on notes list page
- [ ] After debounce (350ms), should see `GET /api/v1/notes?search=<query>`
- [ ] Results should filter based on search term

### 9. Pagination
- [ ] Click "Next" button on notes list
- [ ] Check Network tab - should see `GET /api/v1/notes?page=2`
- [ ] Should load next page of notes

### 10. Summarize (if AI service available)
- [ ] Open a note detail page
- [ ] Click "Generate Summary" button
- [ ] Check Network tab - should see `POST /api/v1/notes/{id}/summarize`
- [ ] Summary should appear below note content

## Error Handling Tests

### Network Errors
- [ ] Stop backend server
- [ ] Try any operation in frontend
- [ ] Should see user-friendly error message: "Network error. Please check your connection..."

### Authentication Errors
- [ ] Clear localStorage token
- [ ] Try to access `/notes` page
- [ ] Should see 401 Unauthorized error
- [ ] Should be redirected to `/login` page (if PrivateRoute is enabled)

### Validation Errors
- [ ] Try to create note with empty title
- [ ] Should see validation error before API call
- [ ] Try to register with invalid email
- [ ] Backend should return 400/422 with error message
- [ ] Frontend should display the error message

### CORS Errors
- [ ] If you see CORS errors in console:
  - Backend CORS middleware is not configured correctly
  - Check backend allows origin `http://localhost:3000`
  - Verify `Access-Control-Allow-Origin` header in response

## Common Issues and Solutions

### Issue: "Network error" on all API calls
**Solution:**
1. Verify backend is running: `curl http://localhost:3001/health`
2. Check `.env` has correct URL: `REACT_APP_API_BASE_URL=http://localhost:3001/api/v1`
3. Restart frontend: `npm start`

### Issue: CORS errors in console
**Solution:**
1. Backend CORS must allow `http://localhost:3000`
2. Check backend CORS middleware configuration
3. Verify backend includes these headers:
   - `Access-Control-Allow-Origin: http://localhost:3000`
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type, Authorization`

### Issue: 401 Unauthorized on all authenticated endpoints
**Solution:**
1. Verify token is stored in localStorage
2. Check Authorization header in Network tab: `Authorization: Bearer <token>`
3. Verify backend JWT secret is configured
4. Try logging in again to get fresh token

### Issue: Form submissions don't work
**Solution:**
1. Open DevTools > Network tab
2. Try submitting form
3. Check if API request is made
4. Look at request payload - verify it matches OpenAPI spec:
   - Register: `{ username, email, password }`
   - Login: `{ email, password }`
   - Create note: `{ title, content }`
5. Check response status and error message

### Issue: "Invalid Host header" in preview
**Solution:**
1. Verify `.env.development` has `DANGEROUSLY_DISABLE_HOST_CHECK=true`
2. Ensure `HOST=0.0.0.0` is set
3. Restart dev server

## Debug Mode

Enable debug logging to see all API requests/responses:

1. Edit `.env`:
   ```
   REACT_APP_API_DEBUG=true
   ```

2. Restart frontend: `npm start`

3. Open browser console - you'll see logs like:
   ```
   [API REQ] POST http://localhost:3001/api/v1/auth/login { email: "...", password: "..." }
   [API RES] 200 /api/v1/auth/login { access_token: "...", expires_in: 3600 }
   ```

## Success Criteria

All checks should pass:
- [ ] User can register successfully
- [ ] User can login and receive token
- [ ] Token is stored in localStorage
- [ ] All note CRUD operations work
- [ ] Search and pagination work
- [ ] All error cases show user-friendly messages
- [ ] No CORS errors in console
- [ ] No network errors (assuming backend is running)

When all criteria are met, the integration is complete! 🎉
