# Notes App - Web Frontend (React)

A polished, lightweight React UI for managing notes with authentication and AI summarization.

## Features

- **Authentication**: Register, login, logout with JWT tokens
- **Notes CRUD**: Create, read, update, delete notes with pagination and search
- **AI Summarization**: Generate summaries for notes (if backend AI service is available)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessible**: WCAG-compliant with keyboard navigation and screen reader support
- **Real-time Updates**: Immediate feedback on all operations

## Quick Start

1) **Install dependencies**
   ```bash
   npm install
   ```

2) **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend URL:
   ```
   REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
   ```
   
   **Important:** The `/api/v1` path is required! The backend API is mounted at this prefix.

3) **Verify backend connectivity (optional)**
   ```bash
   node verify-backend.js
   ```
   
   This script checks if the backend is accessible and responding correctly.

4) **Run the app**
   ```bash
   npm start
   ```
   
   Open http://localhost:3000 (or the platform-provided preview URL)

## Environment Variables

### Required
- **REACT_APP_API_BASE_URL**: Backend API base URL (e.g., `http://localhost:3001/api/v1`)

### Optional
- **REACT_APP_API_DEBUG**: Set to `"true"` to enable API request/response logging
- **HOST**: Dev server bind address (use `0.0.0.0` for container environments)
- **DANGEROUSLY_DISABLE_HOST_CHECK**: Set to `true` for preview domains (dev only)
- **FAST_REFRESH**: Set to `false` if hot reload causes issues

## Backend API Requirements

The frontend expects the backend to provide these endpoints:

### Authentication
- `POST /api/v1/auth/register` - Register new user
  - Body: `{ username, email, password }`
  - Returns: User object
  
- `POST /api/v1/auth/login` - Login
  - Body: `{ email, password }`
  - Returns: `{ access_token, expires_in }`
  
- `POST /api/v1/auth/logout` - Logout (requires auth)

### Notes
- `GET /api/v1/notes` - List notes (requires auth)
  - Query params: `page`, `page_size`, `search`
  - Returns: Array of notes
  
- `POST /api/v1/notes` - Create note (requires auth)
  - Body: `{ title, content }`
  - Returns: Created note
  
- `GET /api/v1/notes/{id}` - Get single note (requires auth)
  - Returns: Note object
  
- `PUT /api/v1/notes/{id}` - Update note (requires auth)
  - Body: `{ title, content }`
  - Returns: Updated note
  
- `DELETE /api/v1/notes/{id}` - Delete note (requires auth)
  - Returns: 204 No Content

- `POST /api/v1/notes/{id}/summarize` - Generate summary (requires auth)
  - Returns: `{ summary }`

### Authentication Flow
1. User registers or logs in
2. Backend returns `access_token` in response
3. Frontend stores token in localStorage
4. All subsequent API requests include `Authorization: Bearer <token>` header

## CORS Configuration

The backend must allow CORS from the frontend origin. For local development:
- Frontend origin: `http://localhost:3000`
- Backend should allow this origin in CORS middleware

## UI/UX Features

- **Search**: Debounced search input that automatically filters notes
- **Pagination**: Navigate through notes with prev/next buttons
- **Skeleton Loaders**: Improve perceived performance during loading
- **Error Banners**: User-friendly error messages for all failures
- **Form Validation**: Client-side validation with clear error messages
- **Accessible Navigation**: Keyboard shortcuts and ARIA labels
- **Responsive Grid**: Adapts to screen size (1/2/3 columns)

## Troubleshooting

### "Network error" or API calls failing
1. Verify backend is running: `curl http://localhost:3001/health`
2. Check `.env` file has correct `REACT_APP_API_BASE_URL`
3. Ensure backend CORS allows `http://localhost:3000`
4. Run verification script: `node verify-backend.js`

### "Invalid Host header" in preview
- Make sure `.env.development` has `DANGEROUSLY_DISABLE_HOST_CHECK=true`
- Verify `HOST=0.0.0.0` is set

### Forms not submitting
1. Open browser DevTools > Network tab
2. Check if API calls are being made
3. Look for error responses (401, 400, 500)
4. Enable debug logging: Set `REACT_APP_API_DEBUG=true` in `.env`

### Authentication not working
1. Verify `/auth/login` returns `{ access_token, expires_in }`
2. Check browser localStorage for saved token
3. Ensure token is valid JWT format
4. Check backend JWT secret is configured

## Testing

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

## Architecture Notes

- **No Auth Bypass**: All note endpoints require authentication
- **Token Management**: Tokens stored in localStorage, attached automatically
- **Error Handling**: All API errors are caught and displayed to users
- **State Management**: React hooks (useState, useEffect, useContext)
- **Routing**: React Router v6 with protected routes
- **Styling**: CSS utility classes in `src/styles/utilities.css`
