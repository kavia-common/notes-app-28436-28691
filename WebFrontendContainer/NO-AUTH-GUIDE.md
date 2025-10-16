# No-Auth Mode Guide

This guide explains how to use the Notes App in no-auth mode, where all features work without backend authentication.

## What is No-Auth Mode?

No-auth mode allows you to use the Notes App without:
- ❌ Backend API connection
- ❌ User authentication
- ❌ Database setup
- ❌ External AI service

Instead, the app uses:
- ✅ Browser localStorage for notes
- ✅ Client-side summarization
- ✅ File import/export
- ✅ Full offline functionality

## Quick Start

1. **Enable no-auth mode**
   ```bash
   echo "REACT_APP_NO_AUTH=true" > .env
   ```

2. **Start the app**
   ```bash
   npm start
   ```

3. **Access the app**
   - Open http://localhost:3000
   - You'll see the notes interface immediately
   - No login required!

## Features

### Create Notes
1. Click "New Note" button
2. Enter title and content
3. Click "Create"
4. Note is saved to localStorage

### Import Notes
1. Click "Import File" on home page
2. Select a .txt or .md file
3. File name → note title
4. File content → note content
5. Automatically saved

### Generate Summary
1. Open any note
2. Click "Generate Summary"
3. Simple heuristic extracts key sentences
4. Summary displayed below note

### Search & Filter
- Use search box on home page
- Searches title and content
- Results update automatically

### Edit & Delete
- Click "Edit" to modify note
- Click "Delete" to remove note
- Changes persist in localStorage

## Data Persistence

### Where are notes stored?
- Browser localStorage
- Key: `notes_app_notes`
- Persists across sessions
- Cleared when clearing browser data

### Export your data
```javascript
// In browser console
const notes = localStorage.getItem('notes_app_notes');
console.log(notes); // Copy and save
```

### Import existing data
```javascript
// In browser console
const notes = '[...]'; // Your JSON data
localStorage.setItem('notes_app_notes', notes);
window.location.reload();
```

### Clear all data
```javascript
// In browser console
localStorage.removeItem('notes_app_notes');
window.location.reload();
```

## Summarization Algorithm

The app uses a simple summarization heuristic:

1. **Sentence extraction**: Get first 3 sentences
2. **Length limit**: Cap at 150 characters
3. **Fallback**: First 150 chars if no sentences found

Example:
```
Content: "This is sentence one. This is sentence two. This is sentence three. This is sentence four."

Summary: "This is sentence one. This is sentence two. This is sentence three."
```

## File Import

### Supported formats
- `.txt` - Plain text files
- `.md` - Markdown files

### How it works
1. File is read in browser
2. Filename → note title (without extension)
3. Content → note content
4. New note created in localStorage

### Example
```
File: my-ideas.txt
Content: "This is a great idea..."

Result:
- Title: "my-ideas"
- Content: "This is a great idea..."
```

## Limitations

### No-auth mode does NOT support:
- ❌ User accounts
- ❌ Multi-device sync
- ❌ Backend AI summarization
- ❌ Collaboration
- ❌ Cloud backup

### Browser limitations:
- localStorage ~5-10MB limit
- Data cleared if browser cache cleared
- No cross-browser sync
- No cross-device sync

## Switching to Backend Mode

To use the full backend:

1. **Update .env**
   ```env
   REACT_APP_NO_AUTH=false
   REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
   ```

2. **Start backend**
   ```bash
   # In BackendAPIContainer
   # Follow backend startup instructions
   ```

3. **Restart frontend**
   ```bash
   npm start
   ```

4. **Register/Login**
   - App will show login page
   - Create account or sign in
   - Full authentication enabled

## Troubleshooting

### Notes disappear after browser restart
- Check if localStorage is enabled
- Some browsers disable in private/incognito mode

### Import doesn't work
- Verify file is .txt or .md
- Check file size (keep under 1MB)
- Try creating note manually first

### Summarization returns full content
- Check if content has proper sentences
- Try adding punctuation (. ! ?)
- Content may be too short

### Can't access app
- Verify .env has `REACT_APP_NO_AUTH=true`
- Restart dev server
- Clear browser cache

## Best Practices

### For testing
- Use small notes (< 1000 chars)
- Clear localStorage between tests
- Export data before clearing

### For demos
- Pre-populate sample notes
- Use short, clear content
- Test summarization on each note

### For development
- Keep localStorage size reasonable
- Monitor console for errors
- Test file import with various formats

## FAQ

**Q: Is data secure?**
A: Data is stored in browser localStorage. It's as secure as your browser. Not encrypted by default.

**Q: Can I use this in production?**
A: No-auth mode is for demos/testing. Use backend mode for production.

**Q: What happens if I exceed localStorage limit?**
A: Browser will throw an error. Delete old notes to free space.

**Q: Can I sync across devices?**
A: No. Use backend mode for multi-device sync.

**Q: Is summarization accurate?**
A: It's a simple heuristic, not AI. For better summaries, use backend mode with AI service.

## Support

For issues or questions:
1. Check console for errors
2. Verify environment configuration
3. Review README.md
4. Check CHANGES.md for updates
