import axios from "axios";

/**
 * Axios API client configured with:
 * - Base URL from REACT_APP_API_BASE_URL
 * - Optional debug logging via REACT_APP_API_DEBUG
 * - No authentication headers or redirects (auth disabled)
 */
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";
const debug = (process.env.REACT_APP_API_DEBUG || "false").toLowerCase() === "true";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    // Pass-through errors without auth redirects
    return Promise.reject(error);
  }
);

/**
 * Extracts a user-friendly error message from axios error responses that may follow
 * the OpenAPI ErrorResponse { code, message, details } shape or validation errors.
 */
export function getApiErrorMessage(err: any, fallback = "Request failed.") {
  const data = err?.response?.data;
  if (!data) return fallback;

  const possible =
    data?.message ||
    data?.error ||
    data?.details ||
    (Array.isArray(data?.detail)
      ? data.detail.map((d: any) => d?.msg || d).filter(Boolean).join(", ")
      : data?.detail);

  if (possible && typeof possible === "string") return possible;

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
  return data;
}
