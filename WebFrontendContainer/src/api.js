//
// Minimal API client for demo mode with graceful fallbacks.
// Reads REACT_APP_BACKEND_URL but works without it. No auth used.
//
const BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * Build full URL for backend endpoint if BASE_URL exists.
 */
function buildUrl(path) {
  if (!BASE_URL) return null;
  const trimmedBase = BASE_URL.replace(/\/+$/, '');
  const trimmedPath = path.replace(/^\/+/, '');
  return `${trimmedBase}/${trimmedPath}`;
}

/**
 * Simple local summary fallback: take first 2 sentences or first 160 chars.
 */
export function localSummarize(text) {
  if (!text) return '';
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const firstTwo = sentences.slice(0, 2).join(' ');
  const candidate = firstTwo || text.slice(0, 160);
  return candidate.length > 180 ? `${candidate.slice(0, 177)}...` : candidate;
}

/**
 * Attempt to call a backend health endpoint to quickly detect availability.
 */
async function isBackendReachable() {
  const url = buildUrl('');
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * PUBLIC_INTERFACE
 * Try to summarize using backend if available, else local fallback.
 * Returns a string summary. Never throws; will return local summary on errors.
 */
export async function summarizeText(content) {
  /** Attempt to use backend summarize if a compatible endpoint exists.
   * Since actual endpoint may vary per project, try a couple of common paths.
   */
  const fallback = () => localSummarize(content);

  // Fast exit if no backend configured.
  const reachable = await isBackendReachable();
  if (!reachable) return fallback();

  const candidatePaths = [
    // BackendAPI typical pattern in spec provided: notes/{id}/summarize (needs id) – we don't have id yet
    // For demo, try a generic summarize path if exposed.
    '/summarize',
    '/notes/summarize',
  ];

  for (const path of candidatePaths) {
    const url = buildUrl(path);
    if (!url) continue;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Demo payload: many services accept { content }
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        // Common shapes: {summary: string} or {result: {summary: string}}
        const summary =
          (data && (data.summary || (data.result && data.result.summary))) || '';
        if (summary) return summary;
      }
    } catch {
      // try next
    }
  }

  // AISummarization interface might be async job; skip polling for demo reliability
  return fallback();
}

/**
 * PUBLIC_INTERFACE
 * Save note to backend if available; otherwise store in localStorage.
 * Returns the saved note object with id.
 */
export async function saveNote(note) {
  const storageKey = 'demo_notes_v1';
  const readLocal = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };
  const writeLocal = (arr) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(arr));
    } catch {
      // ignore
    }
  };

  const reachable = await isBackendReachable();
  if (reachable) {
    const url = buildUrl('/notes');
    if (url) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // In a fully wired backend, summary may be server-side; we include for demo.
          body: JSON.stringify({
            title: note.title,
            content: note.content,
            summary: note.summary,
          }),
        });
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.id) {
            return {
              id: String(data.id),
              title: data.title ?? note.title,
              content: data.content ?? note.content,
              summary: data.summary ?? note.summary,
              created_at: data.created_at,
              updated_at: data.updated_at,
            };
          }
        }
      } catch {
        // fallback to local
      }
    }
  }

  // Local fallback path
  const list = readLocal();
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const toSave = {
    id,
    title: note.title,
    content: note.content,
    summary: note.summary,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  list.unshift(toSave);
  writeLocal(list);
  return toSave;
}

/**
 * PUBLIC_INTERFACE
 * Get saved notes. Tries backend first (no auth), otherwise localStorage.
 */
export async function getNotes() {
  const storageKey = 'demo_notes_v1';
  const readLocal = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const reachable = await isBackendReachable();
  if (reachable) {
    const url = buildUrl('/notes');
    if (url) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json().catch(() => []);
          if (Array.isArray(data)) {
            // Normalize minimal fields
            return data.map((n) => ({
              id: String(n.id ?? `${Date.now()}`),
              title: n.title ?? '',
              content: n.content ?? '',
              summary: n.summary ?? '',
              created_at: n.created_at,
              updated_at: n.updated_at,
            }));
          }
        }
      } catch {
        // use local
      }
    }
  }
  return readLocal();
}
