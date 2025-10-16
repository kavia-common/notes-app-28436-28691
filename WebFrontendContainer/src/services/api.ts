import axios from "axios";

/**
 * Axios API client configured with:
 * - Automatic environment detection (proxy vs absolute URL)
 * - Base URL from REACT_APP_API_BASE_URL or relative proxy path
 * - Optional debug logging via REACT_APP_API_DEBUG
 * - Authorization header attachment when token exists
 * - Enhanced error handling with user-friendly messages specifically for auth endpoints
 *
 * Environment modes:
 * 1. Proxy mode (REACT_APP_USE_PROXY=true): Uses empty baseURL, CRA dev server proxies to backend
 * 2. Absolute URL mode (default): Uses full backend URL from REACT_APP_API_BASE_URL
 * 
 * For preview environments, set REACT_APP_API_BASE_URL to match the backend preview URL.
 */
const env = typeof process !== "undefined" ? process.env || {} : ({} as any);

// Check if proxy mode is enabled
const useProxy: boolean = String(env.REACT_APP_USE_PROXY || "false").toLowerCase() === "true";

// Determine base URL based on mode
const baseURL: string = useProxy 
  ? "" // Empty string for proxy mode - requests go to same origin
  : (env.REACT_APP_API_BASE_URL as string) || "http://localhost:3001/api/v1";

const debug: boolean = String(env.REACT_APP_API_DEBUG || "false").toLowerCase() === "true";

if (debug) {
  console.info(`[API CONFIG] Mode: ${useProxy ? "PROXY" : "ABSOLUTE_URL"}`);
  console.info(`[API CONFIG] Base URL: ${baseURL || "(same-origin)"}`);
  console.info(`[API CONFIG] Final resolved base: ${baseURL}`);
}

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
    const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    // eslint-disable-next-line no-console
    console.log("[API REQ]", config.method?.toUpperCase(), fullUrl, config.params || "", config.data || "");
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
      // Server responded with error status
      error.uiMessage = getApiErrorMessage(error);
    } else if (error.request) {
      // Request made but no response received (network error)
      const endpoint = error.config?.url || "unknown endpoint";
      if (endpoint.includes("/auth/register")) {
        error.uiMessage = "Cannot reach backend registration service. Please ensure Backend API is running and accessible.";
      } else if (endpoint.includes("/auth/login")) {
        error.uiMessage = "Cannot reach backend authentication service. Please ensure Backend API is running and accessible.";
      } else {
        error.uiMessage = "Network error. Please check your connection and ensure the backend is running.";
      }
      
      // Log detailed network error for debugging
      if (debug) {
        console.error("[NETWORK ERROR]", {
          endpoint,
          baseURL,
          useProxy,
          message: error.message
        });
      }
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
    // Add specific context for login errors
    if (err.request && !err.response) {
      err.uiMessage = "Cannot reach backend authentication service. Please ensure Backend API is running at " + (baseURL || "the configured URL") + ".";
    }
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
    // Add specific context for registration errors
    if (err.request && !err.response) {
      err.uiMessage = "Cannot reach backend registration service. Please ensure Backend API is running at " + (baseURL || "the configured URL") + ". Check that CORS is configured and the backend is accessible.";
    }
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
