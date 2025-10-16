# No-Auth Mode Quick Reference

## 🚀 Quick Start

```bash
# 1. Verify configuration
cat .env
# Should show: REACT_APP_NO_AUTH=true

# 2. Start app
npm start

# 3. Access
# http://localhost:3000 or preview URL
```

---

## 🔧 Configuration

### Enable No-Auth Mode
```env
REACT_APP_NO_AUTH=true
```

### Switch to Backend Mode
```env
REACT_APP_NO_AUTH=false
REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
```

---

## 📋 Features

| Feature | Available | How To |
|---------|-----------|--------|
| Create Note | ✅ | Click "New Note" |
| Edit Note | ✅ | Click "Edit" on note card |
| Delete Note | ✅ | Click "Delete" on note card |
| Search | ✅ | Use search box on home |
| Import File | ✅ | Click "Import File" button |
| Summarize | ✅ | Click "Generate Summary" in note |
| Pagination | ✅ | Use Prev/Next buttons |

---

## 💾 Data Storage

### Location
```javascript
localStorage.getItem('notes_app_notes')
```

### View Data
```javascript
// In browser console:
const notes = JSON.parse(localStorage.getItem('notes_app_notes'));
console.table(notes);
```

### Clear Data
```javascript
localStorage.removeItem('notes_app_notes');
window.location.reload();
```

### Export Data
```javascript
const notes = localStorage.getItem('notes_app_notes');
console.log(notes);
// Copy output and save to file
```

---

## 📁 File Import

### Supported Formats
- `.txt` - Plain text
- `.md` - Markdown

### Process
1. Click "Import File" on home page
2. Select file
3. File name → note title
4. File content → note content
5. Auto-save to localStorage

---

## 📊 Summarization

### Algorithm
- Extract first 3 sentences, OR
- Truncate to 150 characters
- No AI/backend required

### Usage
1. Open any note
2. Click "Generate Summary"
3. Summary appears below content
4. Saved with note

---

## 🧪 Testing

### Quick Test
```bash
# 1. Start app
npm start

# 2. Create note
# 3. Refresh page
# 4. Note still there ✅

# 5. Import .txt file ✅
# 6. Generate summary ✅
# 7. Search works ✅
```

### Verify Config
```bash
node test-noauth.js
```

---

## 🐛 Troubleshooting

### App shows login
```bash
# Fix .env
echo "REACT_APP_NO_AUTH=true" > .env
npm start
```

### Notes disappear
```javascript
// Check if localStorage enabled
// Try non-incognito mode
```

### Import fails
- Check file is .txt or .md
- File size < 1MB
- Check console for errors

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| README.md | Overview & quick start |
| NO-AUTH-GUIDE.md | Detailed user guide |
| NO-AUTH-CHANGES.md | Technical details |
| VERIFICATION.md | Test checklist |
| QUICK-REFERENCE.md | This file |

---

## 🔌 API Reference

### No-Auth Mode Functions

```typescript
// List notes
await listNotes({ page: 1, page_size: 9, search: 'query' })

// Create note
await createNote({ title: 'Title', content: 'Content' })

// Get note
await getNote('note_id')

// Update note
await updateNote('note_id', { title: 'New', content: 'New' })

// Delete note
await deleteNote('note_id')

// Summarize
await summarizeNote('note_id')

// Import file
await importNoteFromFile(file)
```

---

## 🌐 Environment Variables

```env
# Required
REACT_APP_NO_AUTH=true

# Preview (optional)
HOST=0.0.0.0
DANGEROUSLY_DISABLE_HOST_CHECK=true

# Debug (optional)
REACT_APP_API_DEBUG=true
```

---

## 📦 NPM Scripts

```bash
# Start (default mode from .env)
npm start

# Start explicitly in no-auth mode
npm run start:noauth

# Start explicitly in backend mode
npm run start:backend

# Build for no-auth
npm run build:noauth

# Test
npm test

# Verify
node test-noauth.js
```

---

## 🎯 Key Files

```
src/
├── App.tsx                  # Routing (no auth guards)
├── index.js                 # Entry (no AuthProvider)
├── services/
│   ├── api.ts              # Mode switching
│   ├── api-noauth.ts       # localStorage implementation
│   ├── auth.ts             # Stubbed (compatibility)
│   └── auth.jsx            # Stubbed (compatibility)
├── pages/
│   ├── Notes.tsx           # Import feature
│   ├── NoteCreate.tsx      # Create notes
│   ├── NoteEdit.tsx        # Edit notes
│   └── NoteDetail.tsx      # View/summarize
└── components/
    ├── Layout/Header.tsx   # No auth UI
    └── Notes/
        ├── NotesList.tsx   # List with search
        ├── NoteForm.tsx    # CRUD form
        └── NoteView.tsx    # Detail view
```

---

## ⚡ Performance

- **Load time:** Instant (no API calls)
- **CRUD:** Instant (localStorage)
- **Search:** Real-time
- **Import:** ~100ms per file
- **Offline:** 100% functional

---

## 🔒 Security Notes

- ⚠️ Data in plain text
- ⚠️ No encryption
- ⚠️ Browser access = data access
- ✅ No network exposure
- ✅ No auth to compromise

---

## 📈 Limits

| Item | Limit |
|------|-------|
| localStorage | ~5-10MB |
| Notes | ~100-200 recommended |
| File import | < 1MB per file |
| Search | Client-side only |
| Users | Single user |

---

## 🔄 Migration

### To Backend Mode

1. Update .env:
   ```bash
   REACT_APP_NO_AUTH=false
   ```

2. Start backend

3. Restart frontend:
   ```bash
   npm start
   ```

4. Register/Login required

---

## ✅ Verification Checklist

- [ ] `REACT_APP_NO_AUTH=true` in .env
- [ ] App loads at `/` without login
- [ ] Can create notes
- [ ] Notes persist on refresh
- [ ] Import button visible
- [ ] Can import .txt file
- [ ] Can import .md file
- [ ] Summary generates
- [ ] Search works
- [ ] Pagination works
- [ ] No console errors

---

## 📞 Support

**Documentation:**
- README.md - Start here
- NO-AUTH-GUIDE.md - Full guide
- NO-AUTH-CHANGES.md - Technical

**Testing:**
- node test-noauth.js
- VERIFICATION.md

**Troubleshooting:**
- Check browser console
- Verify .env configuration
- Review QUICK-REFERENCE.md

---

**Version:** 2.0.0  
**Status:** ✅ Production Ready  
**Mode:** No-Auth (Default)
