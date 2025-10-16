import React from 'react';

/**
// PUBLIC_INTERFACE
Component: NotesList
A minimal list view for notes.
Props:
- notes: array of { id, title, content, summary }
*/
export default function NotesList({ notes }) {
  if (!notes || notes.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={styles.muted}>No notes yet. Create your first note above.</span>
      </div>
    );
  }

  return (
    <div style={styles.list}>
      {notes.map((n) => (
        <div key={n.id} style={styles.item}>
          <div style={styles.title}>{n.title || 'Untitled'}</div>
          {n.summary ? (
            <div style={styles.summary} title={n.summary}>
              {n.summary}
            </div>
          ) : (
            <div style={styles.summaryMuted}>No summary</div>
          )}
          <details style={styles.details}>
            <summary>Show content</summary>
            <pre style={styles.content}>{n.content}</pre>
          </details>
        </div>
      ))}
    </div>
  );
}

const styles = {
  list: { display: 'grid', gap: 12 },
  item: {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 12,
    background: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  title: { fontWeight: 600, marginBottom: 6 },
  summary: { color: '#111827', whiteSpace: 'pre-wrap', marginBottom: 8 },
  summaryMuted: { color: '#6b7280', marginBottom: 8 },
  details: { cursor: 'pointer' },
  content: {
    margin: 0,
    padding: 8,
    background: '#f9fafb',
    borderRadius: 6,
    border: '1px solid #e5e7eb',
    whiteSpace: 'pre-wrap',
  },
  empty: {
    padding: 16,
    borderRadius: 8,
    background: '#f9fafb',
    border: '1px dashed #d1d5db',
  },
  muted: { color: '#6b7280' },
};
