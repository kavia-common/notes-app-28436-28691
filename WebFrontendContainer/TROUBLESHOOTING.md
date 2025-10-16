# Quick Troubleshooting Reference

## Registration/Login Not Working?

### Check #1: Is Backend Running?
```bash
curl https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/health
```

**Expected:** HTTP 200 with response
**If fails:** Backend is not running or not accessible

**Fix:**
1. Start the BackendAPIContainer
2. Verify it's listening on port 3001
3. Check firewall/network allows connections

### Check #2: Is Frontend Configuration Correct?
```bash
npm run verify:config
```

**This checks:**
- `.env` file exists
- `REACT_APP_API_BASE_URL` is set correctly
- Debug logging enabled
- Host configuration for preview

**If issues found:** Follow the recommendations in the output

### Check #3: CORS Configuration
Open browser DevTools > Network tab, try registering, look for:

```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:** Backend must allow frontend origin in CORS middleware:
```python
allow_origins=["https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000"]
```

## Common Error Messages

### "Cannot reach backend registration service"

**Means:** Frontend can't connect to backend
**Check:**
1. Backend is running
2. Backend URL in `.env` is correct
3. Network connectivity
4. Firewall rules

**Debug:**
```bash
# Check .env
cat .env | grep REACT_APP_API_BASE_URL

# Try reaching backend directly
curl https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/health

# Check browser console for detailed error
```

### "Invalid Host header"

**Means:** CRA dev server rejecting preview domain
**Fix:** Already configured in `.env`:
```env
DANGEROUSLY_DISABLE_HOST_CHECK=true
HOST=0.0.0.0
```

**If still failing:**
```bash
# Restart dev server
npm start
```

### CORS Error in Console

**Means:** Backend not allowing frontend origin
**Check backend CORS:**
```python
# In backend main.py or app.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000"  # MUST include frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 401 Unauthorized (After Login)

**Means:** Token not being sent or accepted
**Check:**
1. Token in localStorage: DevTools > Application > Local Storage
2. Authorization header: DevTools > Network > Request Headers
3. Backend JWT validation

**Debug:**
```javascript
// In browser console
localStorage.getItem('token')
// Should show JWT token
```

### Registration Success But Login Fails

**Means:** User created but authentication failing
**Check:**
1. Backend returns correct token format: `{ access_token, expires_in }`
2. Password hashing/verification in backend
3. Backend logs for authentication errors

## Quick Fixes

### Reset Everything
```bash
# Clear browser data
# DevTools > Application > Clear Storage > Clear site data

# Restart frontend
npm start
```

### Check Current Config
```bash
npm run verify:config
```

### Test Backend Directly
```bash
# Health check
curl https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/health

# Try registration (should fail with validation error, but shows backend is up)
curl -X POST https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Enable Verbose Logging
```bash
# In .env
echo "REACT_APP_API_DEBUG=true" >> .env

# Restart
npm start

# Check browser console for detailed logs:
# [API CONFIG] Mode: ...
# [API CONFIG] Base URL: ...
# [API REQ] POST ...
# [API RES] 200 ...
```

## URLs Reference

| Service | URL |
|---------|-----|
| Frontend | `https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3000` |
| Backend API | `https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1` |
| Backend Health | `https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/health` |
| Backend Docs | `https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/docs` |

## Verification Commands

```bash
# Check configuration
npm run verify:config

# Test backend connectivity
npm run verify

# Start frontend
npm start
```

## Still Having Issues?

1. Check `PREVIEW-CONFIG-GUIDE.md` for detailed setup
2. Review `INTEGRATION-CHECKLIST.md` for step-by-step verification
3. See `CHANGES.md` for all configuration changes
4. Check browser console with debug mode enabled
5. Review backend logs for errors

## Expected Behavior

### When Backend is Available:
✅ Registration form submits successfully
✅ User redirected to notes page after registration
✅ Login works with created credentials
✅ No CORS errors in console
✅ Network tab shows successful API calls

### When Backend is NOT Available:
✅ Clear error message displayed
✅ Backend URL shown in error
✅ Troubleshooting steps provided
✅ Retry button available
✅ No crashes or undefined errors
