/**
 * No-auth API client that uses localStorage for note persistence.
 * This allows the app to function without backend authentication.
 * 
 * Features:
 * - Local storage for notes
 * - Client-side summarization (first N sentences)
 * - Pagination and search support
 */

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  summary?: string;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'notes_app_notes';
const NO_AUTH_MODE = process.env.REACT_APP_NO_AUTH === 'true';

// Helper to get notes from localStorage
function getNotesFromStorage(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to read notes from localStorage:', e);
    return [];
  }
}

// Helper to save notes to localStorage
function saveNotesToStorage(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes to localStorage:', e);
    throw new Error('Failed to save note. Storage may be full.');
  }
}

// Generate a simple summary (first 3 sentences or 150 chars)
function generateLocalSummary(content: string): string {
  if (!content || content.trim().length === 0) {
    return '';
  }
  
  // Try to get first few sentences
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length > 0) {
    const summary = sentences.slice(0, 3).join(' ').trim();
    if (summary.length > 150) {
      return summary.substring(0, 150) + '...';
    }
    return summary;
  }
  
  // Fallback: first 150 characters
  if (content.length > 150) {
    return content.substring(0, 150) + '...';
  }
  return content;
}

// PUBLIC_INTERFACE
export async function listNotes(params: { page?: number; page_size?: number; search?: string } = {}): Promise<Note[]> {
  /** Lists notes from localStorage with optional search filtering. */
  if (!NO_AUTH_MODE) {
    throw new Error('No-auth mode not enabled');
  }

  let notes = getNotesFromStorage();
  
  // Apply search filter
  if (params.search && params.search.trim()) {
    const searchLower = params.search.toLowerCase();
    notes = notes.filter(note => 
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by updated_at descending
  notes.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  
  // Apply pagination
  const page = params.page || 1;
  const pageSize = params.page_size || 9;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return notes.slice(start, end);
}

// PUBLIC_INTERFACE
export async function createNote(payload: { title: string; content: string }): Promise<Note> {
  /** Creates a new note in localStorage. */
  if (!NO_AUTH_MODE) {
    throw new Error('No-auth mode not enabled');
  }

  // Validate inputs
  if (!payload.title || payload.title.trim().length === 0) {
    throw new Error('Title is required');
  }
  
  if (!payload.content || payload.content.trim().length === 0) {
    throw new Error('Content is required');
  }

  const notes = getNotesFromStorage();
  const now = new Date().toISOString();
  
  const newNote: Note = {
    id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: 'local_user',
    title: payload.title.trim(),
    content: payload.content.trim(),
    summary: generateLocalSummary(payload.content.trim()),
    created_at: now,
    updated_at: now,
  };
  
  notes.push(newNote);
  saveNotesToStorage(notes);
  
  return newNote;
}

// PUBLIC_INTERFACE
export async function getNote(id: string): Promise<Note> {
  /** Retrieves a note by ID from localStorage. */
  if (!NO_AUTH_MODE) {
    throw new Error('No-auth mode not enabled');
  }

  if (!id) {
    throw new Error('Note ID is required');
  }

  const notes = getNotesFromStorage();
  const note = notes.find(n => n.id === id);
  
  if (!note) {
    throw new Error('Note not found');
  }
  
  return note;
}

// PUBLIC_INTERFACE
export async function updateNote(id: string, payload: { title: string; content: string }): Promise<Note> {
  /** Updates a note in localStorage. */
  if (!NO_AUTH_MODE) {
    throw new Error('No-auth mode not enabled');
  }

  // Validate inputs
  if (!id) {
    throw new Error('Note ID is required');
  }
  
  if (!payload.title || payload.title.trim().length === 0) {
    throw new Error('Title is required');
  }
  
  if (!payload.content || payload.content.trim().length === 0) {
    throw new Error('Content is required');
  }

  const notes = getNotesFromStorage();
  const index = notes.findIndex(n => n.id === id);
  
  if (index === -1) {
    throw new Error('Note not found');
  }
  
  notes[index] = {
    ...notes[index],
    title: payload.title.trim(),
    content: payload.content.trim(),
    summary: generateLocalSummary(payload.content.trim()),
    updated_at: new Date().toISOString(),
  };
  
  saveNotesToStorage(notes);
  return notes[index];
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string): Promise<void> {
  /** Deletes a note from localStorage. */
  if (!NO_AUTH_MODE) {
    throw new Error('No-auth mode not enabled');
  }

  if (!id) {
    throw new Error('Note ID is required');
  }

  const notes = getNotesFromStorage();
  const filtered = notes.filter(n => n.id !== id);
  
  if (notes.length === filtered.length) {
    throw new Error('Note not found');
  }
  
  saveNotesToStorage(filtered);
}

// PUBLIC_INTERFACE
export async function summarizeNote(id: string): Promise<{ summary: string }> {
  /** Generates a local summary for a note using simple heuristics. */
  if (!NO_AUTH_MODE) {
    throw new Error('No-auth mode not enabled');
  }

  if (!id) {
    throw new Error('Note ID is required');
  }

  const notes = getNotesFromStorage();
  const note = notes.find(n => n.id === id);
  
  if (!note) {
    throw new Error('Note not found');
  }
  
  const summary = generateLocalSummary(note.content);
  
  // Update note with summary
  const index = notes.findIndex(n => n.id === id);
  notes[index].summary = summary;
  saveNotesToStorage(notes);
  
  return { summary };
}

// PUBLIC_INTERFACE
export async function importNoteFromFile(file: File): Promise<Note> {
  /** Imports a note from a text/markdown file. */
  if (!NO_AUTH_MODE) {
    throw new Error('No-auth mode not enabled');
  }

  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
    throw new Error('Only .txt and .md files are supported');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        
        if (!content || content.trim().length === 0) {
          reject(new Error('File is empty'));
          return;
        }
        
        const fileName = file.name.replace(/\.(txt|md)$/, '');
        
        const note = await createNote({
          title: fileName || 'Imported Note',
          content: content.trim(),
        });
        
        resolve(note);
      } catch (error: any) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
