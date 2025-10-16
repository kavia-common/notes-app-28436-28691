import axios from "axios";

/**
 * Axios API client configured with:
 * - Base URL from REACT_APP_API_BASE_URL
 * - Authorization header from localStorage token
 * - 401 handling to redirect to /login
 * - Optional debug logging via REACT_APP_API_DEBUG
 */
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";
const debug = (process.env.REACT_APP_API_DEBUG || "false").toLowerCase() === "true";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// PUBLIC_INTERFACE
export function setAuthToken(token: string | null) {
  /** Sets/removes token for Authorization header on the API client. */
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
}

// Initialize token from localStorage at startup
const existing = localStorage.getItem("token");
if (existing) {
  api.defaults.headers.common.Authorization = `Bearer ${existing}`;
}

api.interceptors.request.use((config) => {
  if (debug) {
    // eslint-disable-next-line no-console
    console.log("[API REQ]", config.method?.toUpperCase(), config.baseURL + config.url, config.params || "", config.data || "");
  }
  return config;
});

api.interceptors.response.use(
  (resp) => {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log("[API RES]", resp.status, resp.config.url, resp.data);
    }
    return resp;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Clear token and redirect to login
      setAuthToken(null);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export async function login(email: string, password: string) {
  /** Calls POST /auth/login to authenticate and returns access token object. */
  const { data } = await api.post("/auth/login", { email, password });
  // Accept either {access_token} or {token} (for cross spec compat)
  const access = data?.access_token || data?.token;
  if (access) setAuthToken(access);
  return data;
}

// PUBLIC_INTERFACE
export async function register(username: string, email: string, password: string) {
  /** Calls POST /auth/register to create a new user. Returns created user. */
  const { data } = await api.post("/auth/register", { username, email, password });
  return data;
}

// PUBLIC_INTERFACE
export async function logout() {
  /** Calls POST /auth/logout (best effort) and clears token locally. */
  try {
    await api.post("/auth/logout");
  } catch (e) {
    // ignore network or 404 errors
  } finally {
    setAuthToken(null);
  }
}

// PUBLIC_INTERFACE
export async function listNotes(params: { page?: number; page_size?: number; search?: string } = {}) {
  /** Calls GET /notes with optional pagination and search. */
  const { data } = await api.get("/notes", { params });
  return data;
}

// PUBLIC_INTERFACE
export async function createNote(payload: { title: string; content: string }) {
  /** Calls POST /notes to create a note. */
  const { data } = await api.post("/notes", payload);
  return data;
}

// PUBLIC_INTERFACE
export async function getNote(id: string) {
  /** Calls GET /notes/{id} to retrieve a note. */
  const { data } = await api.get(`/notes/${id}`);
  return data;
}

// PUBLIC_INTERFACE
export async function updateNote(id: string, payload: { title: string; content: string }) {
  /** Calls PUT /notes/{id} to update a note. */
  const { data } = await api.put(`/notes/${id}`, payload);
  return data;
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string) {
  /** Calls DELETE /notes/{id} to delete a note. */
  await api.delete(`/notes/${id}`);
}

// PUBLIC_INTERFACE
export async function summarizeNote(id: string) {
  /** Calls POST /notes/{id}/summarize to generate a summary for a note. */
  const { data } = await api.post(`/notes/${id}/summarize`);
  // Some backends might return { summary: "..." }, keep it as-is for UI
  return data;
}
