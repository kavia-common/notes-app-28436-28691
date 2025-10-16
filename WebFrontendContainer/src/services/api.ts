import axios from "axios";
import * as noAuthApi from "./api-noauth";

/**
 * Axios API client with no-auth mode support.
 * When REACT_APP_NO_AUTH=true, uses local storage instead of backend.
 */
const env = typeof process !== "undefined" ? process.env || {} : ({} as any);

const NO_AUTH_MODE = String(env.REACT_APP_NO_AUTH || "false").toLowerCase() === "true";
const useProxy: boolean = String(env.REACT_APP_USE_PROXY || "false").toLowerCase() === "true";
const baseURL: string = useProxy 
  ? "" 
  : (env.REACT_APP_API_BASE_URL as string) || "http://localhost:3001/api/v1";
const debug: boolean = String(env.REACT_APP_API_DEBUG || "false").toLowerCase() === "true";

if (debug) {
  console.info(`[API CONFIG] No-Auth Mode: ${NO_AUTH_MODE}`);
  console.info(`[API CONFIG] Mode: ${useProxy ? "PROXY" : "ABSOLUTE_URL"}`);
  console.info(`[API CONFIG] Base URL: ${baseURL || "(same-origin)"}`);
}

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  // In no-auth mode, we don't need authorization headers
  if (!NO_AUTH_MODE) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  if (debug) {
    const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    console.log("[API REQ]", config.method?.toUpperCase(), fullUrl, config.params || "", config.data || "");
  }
  return config;
});

api.interceptors.response.use(
  (resp) => {
    if (debug) {
      console.log("[API RES]", resp.status, resp.config.url, resp.data);
    }
    return resp;
  },
  (error) => {
    if (debug) {
      console.error("[API ERR]", error.response?.status, error.response?.data || error.message);
    }
    
    if (error.response) {
      error.uiMessage = getApiErrorMessage(error);
    } else if (error.request) {
      const endpoint = error.config?.url || "unknown endpoint";
      error.uiMessage = "Network error. Backend may not be available.";
      
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

export function getApiErrorMessage(err: any, fallback = "Request failed.") {
  const data = err?.response?.data;
  if (!data) return fallback;

  if (data?.message && typeof data.message === "string") {
    return data.message;
  }

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

  if (data?.detail && typeof data.detail === "string") {
    return data.detail;
  }

  if (data?.error && typeof data.error === "string") {
    return data.error;
  }

  return fallback;
}

// PUBLIC_INTERFACE
export async function listNotes(params: { page?: number; page_size?: number; search?: string } = {}) {
  /** Calls GET /notes with optional pagination and search. In no-auth mode, uses localStorage. */
  if (NO_AUTH_MODE) {
    return noAuthApi.listNotes(params);
  }
  
  try {
    const { data } = await api.get("/notes", { params });
    return data;
  } catch (err: any) {
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function createNote(payload: { title: string; content: string }) {
  /** Calls POST /notes to create a note. In no-auth mode, uses localStorage. */
  if (NO_AUTH_MODE) {
    return noAuthApi.createNote(payload);
  }
  
  try {
    const { data } = await api.post("/notes", payload);
    return data;
  } catch (err: any) {
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function getNote(id: string) {
  /** Calls GET /notes/{id} to retrieve a note. In no-auth mode, uses localStorage. */
  if (NO_AUTH_MODE) {
    return noAuthApi.getNote(id);
  }
  
  try {
    const { data } = await api.get(`/notes/${id}`);
    return data;
  } catch (err: any) {
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function updateNote(id: string, payload: { title: string; content: string }) {
  /** Calls PUT /notes/{id} to update a note. In no-auth mode, uses localStorage. */
  if (NO_AUTH_MODE) {
    return noAuthApi.updateNote(id, payload);
  }
  
  try {
    const { data } = await api.put(`/notes/${id}`, payload);
    return data;
  } catch (err: any) {
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string) {
  /** Calls DELETE /notes/{id} to delete a note. In no-auth mode, uses localStorage. */
  if (NO_AUTH_MODE) {
    return noAuthApi.deleteNote(id);
  }
  
  try {
    await api.delete(`/notes/${id}`);
  } catch (err: any) {
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function summarizeNote(id: string) {
  /** Calls POST /notes/{id}/summarize to generate a summary. In no-auth mode, uses local heuristics. */
  if (NO_AUTH_MODE) {
    return noAuthApi.summarizeNote(id);
  }
  
  try {
    const { data } = await api.post(`/notes/${id}/summarize`);
    return data;
  } catch (err: any) {
    throw err;
  }
}

// PUBLIC_INTERFACE
export async function importNoteFromFile(file: File) {
  /** Imports a note from a file. Only available in no-auth mode. */
  if (NO_AUTH_MODE) {
    return noAuthApi.importNoteFromFile(file);
  }
  
  throw new Error('File import is only available in no-auth mode');
}
