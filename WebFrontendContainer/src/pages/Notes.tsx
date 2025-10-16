import React, { useState, useRef } from "react";
import NotesList from "../components/Notes/NotesList";
import { importNoteFromFile } from "../services/api";

const NotesPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check no-auth mode at runtime
  const NO_AUTH_MODE = process.env.REACT_APP_NO_AUTH === 'true';

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      setError('Please select a .txt or .md file');
      return;
    }

    setImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const note = await importNoteFromFile(file);
      setSuccess(`Successfully imported: ${note.title}`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Trigger refresh of notes list after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error('Import error:', err);
      const errorMessage = err?.message || 'Failed to import note';
      setError(errorMessage);
    } finally {
      setImporting(false);
    }
  };

  const triggerFileInput = () => {
    if (!NO_AUTH_MODE) {
      setError('File import is only available in no-auth mode');
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div>
      {error && (
        <div className="container" style={{ paddingTop: 12 }}>
          <div className="banner banner-error" role="alert">{error}</div>
        </div>
      )}
      {success && (
        <div className="container" style={{ paddingTop: 12 }}>
          <div className="banner banner-success" role="alert">{success}</div>
        </div>
      )}
      
      {NO_AUTH_MODE && (
        <div className="container" style={{ paddingTop: 12 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Import Notes</strong>
                <p className="muted" style={{ marginTop: 4, marginBottom: 0, fontSize: 13 }}>
                  Upload .txt or .md files to import notes with automatic summaries
                </p>
              </div>
              <button 
                onClick={triggerFileInput} 
                disabled={importing}
                className="btn btn-primary"
                aria-label="Import note from file"
              >
                {importing ? 'Importing...' : 'Import File'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md"
                onChange={handleImport}
                style={{ display: 'none' }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      )}
      
      <NotesList onError={(msg) => setError(msg)} />
    </div>
  );
};

export default NotesPage;
