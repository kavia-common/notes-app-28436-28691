import React, { useState, useEffect } from 'react';
import './styles.css';
import { createNote, summarizeNote } from './api';
import { saveNoteToStorage, getNotesFromStorage, deleteNoteFromStorage } from './storage';

/**
 * PUBLIC_INTERFACE
 * Main application component for the Notes App.
 * Provides functionality to create notes, generate summaries, save notes, and display saved notes.
 */
function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = getNotesFromStorage();
    setNotes(savedNotes);
  }, []);

  /**
   * Generate summary for the current note content
   */
  const handleGenerateSummary = async () => {
    if (!content.trim()) {
      setError('Please enter some content before generating a summary.');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      // Try to call backend API first
      const result = await summarizeNote(content);
      setSummary(result.summary);
      setSuccessMessage('Summary generated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.warn('Backend summarization failed, using local fallback:', err);
      // Fallback: simple local summarization (first 200 characters)
      const localSummary = content.trim().substring(0, 200) + (content.length > 200 ? '...' : '');
      setSummary(localSummary);
      setSuccessMessage('Summary generated (local fallback)');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save the current note with its summary to localStorage
   */
  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please enter both title and content before saving.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        summary: summary || 'No summary generated'
      };

      // Try to save to backend first
      try {
        await createNote(noteData);
        console.log('Note saved to backend successfully');
      } catch (backendError) {
        console.warn('Backend save failed, saving locally only:', backendError);
      }

      // Always save to localStorage for offline access
      const savedNote = saveNoteToStorage(noteData);
      setNotes(getNotesFromStorage());
      
      // Reset form
      setTitle('');
      setContent('');
      setSummary('');
      setSuccessMessage('Note saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save note: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Select a note from the list to view its details
   */
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setError('');
  };

  /**
   * Delete a note from the list
   */
  const handleDeleteNote = (noteId) => {
    deleteNoteFromStorage(noteId);
    setNotes(getNotesFromStorage());
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote(null);
    }
    setSuccessMessage('Note deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  /**
   * Close the note detail view
   */
  const handleCloseDetail = () => {
    setSelectedNote(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📝 Notes App</h1>
        <p>Create notes and generate AI summaries</p>
      </header>

      <main className="app-main">
        {/* Note Creation Form */}
        <section className="note-form-section">
          <h2>Create New Note</h2>
          
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter note content"
              rows="8"
              disabled={loading}
            />
          </div>

          <div className="button-group">
            <button 
              onClick={handleGenerateSummary} 
              disabled={loading || !content.trim()}
              className="btn btn-primary"
            >
              {loading ? 'Generating...' : '✨ Generate Summary'}
            </button>
            <button 
              onClick={handleSaveNote} 
              disabled={loading || !title.trim() || !content.trim()}
              className="btn btn-success"
            >
              {loading ? 'Saving...' : '💾 Save Note'}
            </button>
          </div>

          {summary && (
            <div className="summary-box">
              <h3>Generated Summary:</h3>
              <p>{summary}</p>
            </div>
          )}
        </section>

        {/* Notes List */}
        <section className="notes-list-section">
          <h2>Saved Notes ({notes.length})</h2>
          
          {notes.length === 0 ? (
            <p className="empty-message">No notes saved yet. Create your first note above!</p>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <div key={note.id} className="note-item">
                  <div className="note-item-content" onClick={() => handleSelectNote(note)}>
                    <h3>{note.title}</h3>
                    <p className="note-preview">
                      {note.content.substring(0, 100)}
                      {note.content.length > 100 ? '...' : ''}
                    </p>
                    <span className="note-date">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button 
                    className="btn btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedNote.title}</h2>
              <button className="btn-close" onClick={handleCloseDetail}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Content:</h3>
                <p className="note-content">{selectedNote.content}</p>
              </div>
              <div className="detail-section">
                <h3>Summary:</h3>
                <p className="note-summary">{selectedNote.summary}</p>
              </div>
              <div className="detail-section">
                <small className="note-metadata">
                  Created: {new Date(selectedNote.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
