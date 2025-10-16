/**
 * API service for backend communication
 * Handles note creation and summarization with error handling
 */

// Get API base URL from environment or use empty string for local fallback
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * PUBLIC_INTERFACE
 * Create a new note via backend API
 * @param {Object} noteData - Note data with title, content, and summary
 * @returns {Promise<Object>} Created note object
 */
export async function createNote(noteData) {
  if (!API_BASE_URL) {
    throw new Error('Backend API not configured');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}

/**
 * PUBLIC_INTERFACE
 * Generate summary for note content
 * @param {string} content - Note content to summarize
 * @returns {Promise<Object>} Object with summary property
 */
export async function summarizeNote(content) {
  if (!API_BASE_URL) {
    throw new Error('Backend API not configured');
  }

  try {
    // Try backend summarization endpoint first
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, note_id: 'temp-' + Date.now() }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { summary: data.summary || data.summary_text || 'Summary not available' };
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

/**
 * PUBLIC_INTERFACE
 * Fetch all notes from backend
 * @returns {Promise<Array>} Array of note objects
 */
export async function fetchNotes() {
  if (!API_BASE_URL) {
    throw new Error('Backend API not configured');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
}
