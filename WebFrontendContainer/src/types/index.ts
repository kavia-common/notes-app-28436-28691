/**
 * Shared TypeScript interfaces for the app.
 * Import from "types" (baseUrl points to src).
 */

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  summary?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthToken {
  access_token: string;
  expires_in: number;
}

export interface ApiError {
  code?: number;
  message: string;
  details?: string;
}

export interface PaginatedNotesParams {
  page?: number;
  page_size?: number;
  search?: string;
}

// PUBLIC_INTERFACE
export type { Note as default };
