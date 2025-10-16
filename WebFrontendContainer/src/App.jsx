import React, { useEffect, useState } from 'react';
import NoteForm from './components/NoteForm';
import NotesList from './components/NotesList';
import { getNotes } from './api';
import './styles.css';

/**
// PUBLIC_INTERFACE
Component: App
Single-page demo for creating notes, summarizing, saving, and listing without auth.
*/
export default function App() {
  const [notes, setNotes] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const loadNotes = async () => {
    setLoadingList(true);
    try {
      const list = await getNotes();
      setNotes(Array.isArray(list) ? list : []);
    } catch {
      // fail silently; leave notes as-is
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSaved = (note) => {
    setNotes((prev) => [note, ...prev]);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1}>InkWell</h1>
        <p style={styles.subtitle}>
          Create a note, generate a quick summary, and save. Data persists locally for preview reliability.
        </p>
      </header>

      <main style={styles.main}>
        <NoteForm onSaved={handleSaved} />
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.h2}>Saved Notes</h2>
            <button onClick={loadNotes} disabled={loadingList} style={styles.refreshBtn}>
              {loadingList ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          <NotesList notes={notes} />
        </section>
      </main>

      <footer style={styles.footer}>
        <small>
          Backend URL: {process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : 'not set (using local fallback)'}
        </small>
      </footer>
    </div>
  );
}

const styles = {
  container: { maxWidth: 860, margin: '0 auto', padding: 16 },
  header: { marginBottom: 12 },
  h1: { margin: '0 0 6px 0', fontSize: 22 },
  subtitle: { margin: 0, color: '#6b7280' },
  main: { marginTop: 12 },
  section: {
    background: 'var(--color-surface)',
    borderRadius: 8,
    border: '1px solid var(--color-border)',
    padding: 16,
  },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  h2: { margin: 0, fontSize: 18 },
  refreshBtn: {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid var(--color-border)',
    background: '#262626',
    color: 'var(--color-text)',
    cursor: 'pointer',
  },
  footer: { marginTop: 16, color: 'var(--color-muted)', textAlign: 'center' },
};
