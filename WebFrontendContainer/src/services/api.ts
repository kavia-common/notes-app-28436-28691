import axios from "axios";

/**
 * Axios API client configured with:
 * - Base URL from REACT_APP_API_BASE_URL
 * - Optional debug logging via REACT_APP_API_DEBUG
 * - Auth header support via setAuthToken
 *
 * Also provides in-app diagnostics when REACT_APP_API_DEBUG=true.
 */
const envBase = (process.env.REACT_APP_API_BASE_URL || "").trim();

/**
 * Normalize and validate base URL:
 * - If missing, default to http://localhost:8000/api/v1 for dev, but mark as not configured.
 * - Ensure it ends with /api/v1 and avoid trailing slash to keep paths consistent.
 */
function normalizeBaseUrl(input: string): { baseURL: string; configured: boolean } {
  let configured = true;
  let raw = input;
  if (!raw) {
    configured = false;
    raw = "http://localhost:8000/api/v1";
  }
  // Strip trailing slashes
  raw = raw.replace(/\/+$/, "");
  // Append /api/v1 if not present at end
  if (!/\/api\/v1$/.test(raw)) {
    raw = raw + "/api/v1";
  }
  return { baseURL: raw, configured };
}

const { baseURL, configured } = normalizeBaseUrl(envBase);
const debug = (process.env.REACT_APP_API_DEBUG || "false").toLowerCase() === "true";

if (debug) {
  // eslint-disable-next-line no-console
  console.info("[API] baseURL:", baseURL, "configured:", configured);
}

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach Authorization header from localStorage token on each request.
 * No withCredentials by default (CORS preflight friendly); enable only if backend requires cookies.
 */
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    const headers: Record<string, any> = (config.headers as any) || {};
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }
    config.headers = headers as any;
  } catch {
    // ignore storage issues
  }
  if (debug) {
    // eslint-disable-next-line no-console
    console.log("[API REQ]", config.method?.toUpperCase(), (config.baseURL || "") + (config.url || ""), {
      params: config.params,
      data: config.data,
      headers: config.headers,
    });
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
      console.error(
        "[API ERR]",
        error?.response?.status,
        error?.response?.config?.url,
        error?.response?.data || error?.message
      );
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export function setAuthToken(token: string | null) {
  /** Sets or clears Authorization bearer token on the axios instance and localStorage. */
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

/**
 * Extracts a user-friendly error message from axios error responses that may follow
 * OpenAPI ErrorResponse { code, message, details } or FastAPI-style 'detail'.
 * Includes network errors and backend-unreachable guidance.
 */
// PUBLIC_INTERFACE
export function getApiErrorMessage(err: any, fallback = "Request failed.") {
  // Network / no response
  if (err?.code === "ERR_NETWORK" || !err?.response) {
    if (!configured) {
      return "Backend API is not configured. Set REACT_APP_API_BASE_URL in .env (e.g., http://localhost:8000/api/v1).";
    }
    return "Unable to reach the backend API. Check REACT_APP_API_BASE_URL and server availability.";
  }

  const data = err?.response?.data;
  const status = err?.response?.status;

  const possible =
    data?.message ||
    data?.error ||
    data?.details ||
    (Array.isArray(data?.detail)
      ? data.detail.map((d: any) => d?.msg || d).filter(Boolean).join(", ")
      : data?.detail);

  if (possible && typeof possible === "string") {
    return possible;
  }

  if (data?.errors && typeof data.errors === "object") {
    try {
      const firstKey = Object.keys(data.errors)[0];
      const firstVal = (data as any).errors[firstKey];
      if (Array.isArray(firstVal)) return firstVal[0];
      if (typeof firstVal === "string") return firstVal;
    } catch {
      /* ignore parsing issues */
    }
  }

  if (status && typeof status === "number") {
    return `${fallback} (HTTP ${status})`;
  }
  return fallback;
}

// Notes endpoints
// PUBLIC_INTERFACE
export async function listNotes(params: { page?: number; page_size?: number; search?: string } = {}) {
  /** Calls GET /notes with optional pagination and search. */
  const { data } = await api.get("/notes", { params });
  return data;
}

// PUBLIC_INTERFACE
export async function createNote(payload: { title: string; content: string }) {
  /** Calls POST /notes to create a note. */
  if (!configured) {
    const err: any = new Error("Backend API is not configured.");
    err.uiMessage = "Backend API is not configured. Set REACT_APP_API_BASE_URL in .env and reload.";
    throw err;
  }
  const { data, status } = await api.post("/notes", payload, {
    headers: { "Content-Type": "application/json" },
    // withCredentials: false // default; uncomment if backend needs cookies
  });
  // Accept 201 Created; if some backends return 200, still proceed.
  if (status !== 201 && status !== 200) {
    // eslint-disable-next-line no-console
    console.warn("[createNote] Unexpected status:", status);
  }
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
  const { data } = await api.put(`/notes/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
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
  return data;
}

// Auth endpoints (thin wrappers aligned with OpenAPI)
// PUBLIC_INTERFACE
export async function login(email: string, password: string) {
  /** Calls POST /auth/login to authenticate and returns token payload. */
  const { data } = await api.post("/auth/login", { email, password }, {
    headers: { "Content-Type": "application/json" },
  });
  const token = data?.access_token || data?.token || null;
  if (token) setAuthToken(token);
  return data;
}

// PUBLIC_INTERFACE
export async function register(username: string, email: string, password: string) {
  /** Calls POST /auth/register to create an account. */
  const { data } = await api.post("/auth/register", { username, email, password }, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

// PUBLIC_INTERFACE
export async function logout() {
  /** Calls POST /auth/logout to invalidate the session/token (if available). */
  try {
    await api.post("/auth/logout");
  } finally {
    setAuthToken(null);
  }
}

// PUBLIC_INTERFACE
export const __API_DIAGNOSTICS__ = {
  /** Provides diagnostics info for debugging in-app when REACT_APP_API_DEBUG=true. */
  getInfo: () => ({
    baseURL,
    configured,
    debug,
    tokenPresent: !!localStorage.getItem("token"),
  }),
};
