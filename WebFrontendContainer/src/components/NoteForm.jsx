import React, { useState } from 'react';
import { summarizeText, saveNote } from '../api';

/**
// PUBLIC_INTERFACE
Component: NoteForm
A minimal form to create a note with title and content, generate a summary, and save.
Props:
- onSaved(note): callback when a note is successfully saved, receives the saved note object.
*/
export default function NoteForm({ onSaved }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    // auto-hide
    setTimeout(() => setToast(null), 2500);
  };

  const handleSummarize = async () => {
    if (!content.trim()) {
      showToast('Please enter content to summarize.', 'warn');
      return;
    }
    setLoading(true);
    try {
      const s = await summarizeText(content);
      setSummary(s || '');
      if (!s) {
        showToast('Summary unavailable; showing fallback.', 'warn');
      }
    } catch {
      showToast('Failed to summarize. Using fallback.', 'warn');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      showToast('Title and Content are required.', 'warn');
      return;
    }
    setLoading(true);
    try {
      const note = await saveNote({ title, content, summary });
      if (onSaved) onSaved(note);
      showToast('Saved!', 'success');
      setTitle('');
      setContent('');
      setSummary('');
    } catch {
      showToast('Failed to save note.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.h2}>New Note</h2>
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            ...styles.toast,
            ...(toast.type === 'success'
              ? styles.toastSuccess
              : toast.type === 'error'
              ? styles.toastError
              : styles.toastInfo),
          }}
        >
          {toast.msg}
        </div>
      )}
      <label style={styles.label}>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        Content
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note content..."
          rows={6}
          style={styles.textarea}
        />
      </label>
      <div style={styles.actions}>
        <button onClick={handleSummarize} disabled={loading} style={styles.button}>
          {loading ? 'Working…' : 'Summarize'}
        </button>
        <button onClick={handleSave} disabled={loading} style={{ ...styles.button, ...styles.primary }}>
          {loading ? 'Saving…' : 'Save'}
        </button>
      </div>
      <div style={styles.summaryBox}>
        <div style={styles.summaryHeader}>Summary</div>
        <div style={styles.summaryBody}>
          {summary ? summary : <span style={styles.muted}>No summary yet. Click Summarize.</span>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  h2: { margin: '0 0 12px 0', fontSize: 18 },
  label: { display: 'block', marginBottom: 12, color: '#374151', fontSize: 14 },
  input: {
    width: '100%',
    marginTop: 6,
    padding: '10px 12px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    marginTop: 6,
    padding: '10px 12px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    outline: 'none',
    resize: 'vertical',
  },
  actions: { display: 'flex', gap: 8, marginTop: 8, marginBottom: 12 },
  button: {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #d1d5db',
    background: '#f9fafb',
    cursor: 'pointer',
  },
  primary: {
    background: '#3b82f6',
    color: '#fff',
    borderColor: '#3b82f6',
  },
  summaryBox: {
    border: '1px dashed #d1d5db',
    borderRadius: 6,
    padding: 12,
    background: '#fafafa',
  },
  summaryHeader: { fontWeight: 600, marginBottom: 6, color: '#374151' },
  summaryBody: { color: '#111827', whiteSpace: 'pre-wrap' },
  muted: { color: '#6b7280' },
  toast: {
    marginBottom: 12,
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid transparent',
    fontSize: 14,
  },
  toastSuccess: { background: '#ecfdf5', borderColor: '#10b981', color: '#065f46' },
  toastError: { background: '#fef2f2', borderColor: '#ef4444', color: '#7f1d1d' },
  toastInfo: { background: '#eff6ff', borderColor: '#60a5fa', color: '#1e3a8a' },
};
