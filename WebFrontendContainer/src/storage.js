/**
 * Local storage service for offline note persistence
 * Provides CRUD operations for notes in browser localStorage
 */

const STORAGE_KEY = 'notes-app-data';

/**
 * PUBLIC_INTERFACE
 * Retrieve all notes from localStorage
 * @returns {Array} Array of note objects
 */
export function getNotesFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    const notes = JSON.parse(data);
    return Array.isArray(notes) ? notes : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * Save a new note to localStorage
 * @param {Object} noteData - Note data with title, content, and summary
 * @returns {Object} Saved note object with id and timestamp
 */
export function saveNoteToStorage(noteData) {
  try {
    const notes = getNotesFromStorage();
    const newNote = {
      id: generateId(),
      title: noteData.title,
      content: noteData.content,
      summary: noteData.summary,
      createdAt: new Date().toISOString(),
    };
    notes.unshift(newNote); // Add to beginning of array
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return newNote;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Failed to save note to local storage');
  }
}

/**
 * PUBLIC_INTERFACE
 * Delete a note from localStorage by ID
 * @param {string} noteId - ID of the note to delete
 * @returns {boolean} True if deleted successfully
 */
export function deleteNoteFromStorage(noteId) {
  try {
    const notes = getNotesFromStorage();
    const filteredNotes = notes.filter((note) => note.id !== noteId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
    return true;
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    return false;
  }
}

/**
 * Generate a unique ID for notes
 * @returns {string} Unique identifier
 */
function generateId() {
  return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * PUBLIC_INTERFACE
 * Clear all notes from localStorage
 */
export function clearAllNotes() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}
