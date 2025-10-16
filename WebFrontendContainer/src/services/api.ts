import axios from "axios";

/**
 * Axios API client configured with:
 * - Base URL from REACT_APP_API_BASE_URL or fallback to http://localhost:3001/api/v1
 * - Optional debug logging via REACT_APP_API_DEBUG
 * - Authorization header attachment when token exists
 * - Enhanced error handling with user-friendly messages
 *
 * Dev note:
 * In production/preview, set REACT_APP_API_BASE_URL to the full backend URL including /api/v1.
 * In development, we use absolute URL to avoid CRA proxy conflicts.
 */
const env = typeof process !== "undefined" ? process.env || {} : ({} as any);
const baseURL: string = (env.REACT_APP_API_BASE_URL as string) || "http://localhost:3001/api/v1";
const debug: boolean = String(env.REACT_APP_API_DEBUG || "false").toLowerCase() === "true";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

api.interceptors.request.use((config) => {
  // Attach Authorization header if token exists
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

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
    if (debug) {
      // eslint-disable-next-line no-console
      console.error("[API ERR]", error.response?.status, error.response?.data || error.message);
    }
    // Enhance error with user-friendly message
    if (error.response) {
      error.uiMessage = getApiErrorMessage(error);
    } else if (error.request) {
      error.uiMessage = "Network error. Please check your connection and ensure the backend is running.";
    } else {
      error.uiMessage = "Request failed. Please try again.";
    }
    return Promise.reject(error);
  }
);

/**
 * PUBLIC_INTERFACE
 * Set auth token header if needed.
 */
export function setAuthToken(token: string | null) {
  if (!token) {
    delete (api.defaults.headers as any).Authorization;
    localStorage.removeItem("token");
    return;
  }
  (api.defaults.headers as any).Authorization = `Bearer ${token}`;
  localStorage.setItem("token", token);
}

/**
 * PUBLIC_INTERFACE
 * Login user with email and password. Returns access token and expiry.
 */
export async function login(email: string, password: string) {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.access_token) {
      setAuthToken(data.access_token);
    }
    return data;
  } catch (err: any) {
    throw err;
  }
}

/**
 * PUBLIC_INTERFACE
 * Logout user and clear token.
 */
export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (e) {
    // Logout failure is not critical
  } finally {
    setAuthToken(null);
  }
}

/**
 * PUBLIC_INTERFACE
 * Register new user with username, email, and password.
 */
export async function register(username: string, email: string, password: string) {
  try {
    const { data } = await api.post("/auth/register", { username, email, password });
    return data;
  } catch (err: any) {
    throw err;
  }
}

/**
 * Extracts a user-friendly error message from axios error responses that may follow
 * the OpenAPI ErrorResponse { code, message, details } shape or validation errors.
 */
export function getApiErrorMessage(err: any, fallback = "Request failed.") {
  const data = err?.response?.data;
  if (!data) return fallback;

  // Handle OpenAPI ErrorResponse format
  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

  // Handle FastAPI validation errors
  if (Array.isArray(data?.detail)) {
    const messages = data.detail
      .map((d: any) => {
        if (typeof d === "string") return d;
        if (d?.msg) return d.msg;
        if (d?.message) return d.message;
        return null;
      })
      .filter(Boolean);
    if (messages.length > 0) return messages.join(", ");
  }

  // Handle simple detail string
  if (data?.detail && typeof data.detail === "string") {
    return data.detail;
  }

  // Handle error field
  if (data?.error && typeof data.error === "string") {
    return data.error;
  }

  // Handle details field
  if (data?.details && typeof data.details === "string") {
    return data.details;
  }

  // Handle nested errors object
  if (data?.errors && typeof data.errors === "object") {
    try {
      const firstKey = Object.keys(data.errors)[0];
      const firstVal = data.errors[firstKey];
      if (Array.isArray(firstVal)) return firstVal[0];
      if (typeof firstVal === "string") return firstVal;
    } catch {
      /* ignore parsing issues */
    }
  }

  return fallback;
}

// PUBLIC_INTERFACE
export async function listNotes(params: { page?: number; page_size?: number; search?: string } = {}) {
  /** Calls GET /notes with optional pagination and search. */
  try {
    const { data } = await api.get("/notes", { params });
    return data;
  } catch (err: any) {
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function createNote(payload: { title: string; content: string }) {
  /** Calls POST /notes to create a note. */
  try {
    const { data } = await api.post("/notes", payload);
    return data;
  } catch (err: any) {
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function getNote(id: string) {
  /** Calls GET /notes/{id} to retrieve a note. */
  try {
    const { data } = await api.get(`/notes/${id}`);
    return data;
  } catch (err: any) {
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function updateNote(id: string, payload: { title: string; content: string }) {
  /** Calls PUT /notes/{id} to update a note. */
  try {
    const { data } = await api.put(`/notes/${id}`, payload);
    return data;
  } catch (err: any) {
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string) {
  /** Calls DELETE /notes/{id} to delete a note. */
  try {
    await api.delete(`/notes/${id}`);
  } catch (err: any) {
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function summarizeNote(id: string) {
  /** Calls POST /notes/{id}/summarize to generate a summary for a note. */
  try {
    const { data } = await api.post(`/notes/${id}/summarize`);
    return data;
  } catch (err: any) {
    throw err;
  }
}
