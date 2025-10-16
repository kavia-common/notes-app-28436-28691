# WebFrontendContainer (Notes App)

A lightweight React app with a polished, responsive UI for managing notes with optional authentication.

## No-Auth Mode (NEW)

The app now supports a **no-auth mode** that allows you to use all features without backend authentication:

- ✅ Notes stored in localStorage (persists across sessions)
- ✅ Import notes from .txt or .md files
- ✅ Client-side summarization using simple heuristics
- ✅ Full CRUD operations without login
- ✅ Search and pagination support

### Enable No-Auth Mode

1. Set the environment variable:
   ```bash
   REACT_APP_NO_AUTH=true
   ```

2. Start the app:
   ```bash
   npm start
   ```

3. Access at http://localhost:3000 - you'll go directly to the notes interface!

## Run locally

1) Install dependencies
   ```bash
   npm install
   ```

2) Configure environment
   ```bash
   cp .env.example .env
   ```
   
   **For no-auth mode (recommended for preview):**
   ```env
   REACT_APP_NO_AUTH=true
   ```
   
   **For backend mode:**
   ```env
   REACT_APP_NO_AUTH=false
   REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
   ```

3) Start the dev server
   ```bash
   npm start
   ```
   App runs at http://localhost:3000

## Features

### No-Auth Mode
- Direct access to notes interface
- Import notes from files (.txt, .md)
- Local storage persistence
- Client-side summarization
- No backend required

### Backend Mode (when REACT_APP_NO_AUTH=false)
- Full authentication with JWT
- Backend API integration
- AI-powered summarization
- Multi-user support

## Configuration Modes

### Mode 1: No-Auth Mode (Recommended for Preview)

Set in `.env`:
```env
REACT_APP_NO_AUTH=true
```

**Use when:**
- Testing without backend
- Demo/preview environments
- Local development without backend setup
- Want to try features quickly

### Mode 2: Backend Mode

Set in `.env`:
```env
REACT_APP_NO_AUTH=false
REACT_APP_API_BASE_URL=https://vscode-internal-14543-qa.qa01.cloud.kavia.ai:3001/api/v1
```

**Use when:**
- Backend is available
- Need authentication
- Want AI summarization
- Production deployment

## Preview/Container environments

If you access the CRA dev server via a preview domain or reverse proxy:

- Use the provided `.env` which includes:
  - `HOST=0.0.0.0` (bind to all interfaces)
  - `DANGEROUSLY_DISABLE_HOST_CHECK=true` (allow preview host)
  - `REACT_APP_NO_AUTH=true` (no-auth mode enabled)

## Import Notes Feature

In no-auth mode, you can import notes from files:

1. Click "Import File" button on the home page
2. Select a .txt or .md file
3. The file name becomes the note title
4. The file content becomes the note content
5. Note is saved to localStorage

## Local Summarization

In no-auth mode, summarization uses simple heuristics:
- Extracts first 3 sentences, or
- Truncates to 150 characters
- Click "Generate Summary" on any note

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_NO_AUTH` | `false` | Enable no-auth mode (localStorage) |
| `REACT_APP_API_BASE_URL` | `http://localhost:3001/api/v1` | Backend API URL (backend mode only) |
| `REACT_APP_USE_PROXY` | `false` | Enable proxy mode (backend mode only) |
| `REACT_APP_API_DEBUG` | `false` | Enable verbose logging |
| `HOST` | `localhost` | Dev server bind address |
| `DANGEROUSLY_DISABLE_HOST_CHECK` | `false` | Allow preview domains |

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

The build output will be in the `build/` directory.

For no-auth mode deployment:
- Set `REACT_APP_NO_AUTH=true` during build
- All data stored client-side
- No backend required

For backend mode deployment:
- Set `REACT_APP_NO_AUTH=false`
- Set `REACT_APP_API_BASE_URL` to production URL
- Ensure CORS configured on backend

## Troubleshooting

### Notes not persisting?
- Check browser localStorage is enabled
- Try clearing localStorage: `localStorage.clear()` in console

### Import not working?
- Ensure file is .txt or .md format
- Check file size (very large files may fail)
- Verify no-auth mode is enabled

### Features not working?
- Verify `REACT_APP_NO_AUTH=true` in .env
- Restart dev server after changing .env
- Clear browser cache

Refer to CHANGES.md for detailed technical documentation.
