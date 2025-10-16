import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { __API_DIAGNOSTICS__ } from "../../services/api";

type Props = {
  initial?: { title: string; content: string };
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
  submitLabel?: string;
};

const NoteForm: React.FC<Props> = ({ initial = { title: "", content: "" }, onSubmit, submitLabel = "Save" }) => {
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleError = title.trim().length === 0 ? "Title is required." : null;
  const contentError = content.trim().length === 0 ? "Content is required." : null;
  const hasErrors = !!titleError || !!contentError;

  // Diagnostics from API (only logs if debug is enabled)
  const diag = useMemo(() => {
    try {
      return __API_DIAGNOSTICS__?.getInfo?.() || { baseURL: "", configured: true, debug: false, tokenPresent: false };
    } catch {
      return { baseURL: "", configured: true, debug: false, tokenPresent: false };
    }
  }, []);

  useEffect(() => {
    if (diag?.debug) {
      // eslint-disable-next-line no-console
      console.info("[NoteForm Diagnostics]", diag);
    }
  }, [diag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (hasErrors) return;

    // If backend is not configured, stop early with actionable message.
    if (diag && diag.configured === false) {
      setError("Backend API not configured. Set REACT_APP_API_BASE_URL in .env (must end with /api/v1).");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
      // Help verification in preview logs
      // eslint-disable-next-line no-console
      console.info("[NoteForm] Submit succeeded");
    } catch (e: any) {
      // Prefer detailed server response when present (OpenAPI ErrorResponse or FastAPI-style detail)
      const msg =
        e?.uiMessage ||
        e?.response?.data?.message ||
        (Array.isArray(e?.response?.data?.detail)
          ? e.response.data.detail.map((d: any) => d?.msg || d).filter(Boolean).join(", ")
          : e?.response?.data?.detail) ||
        e?.message ||
        "Failed to submit form.";
      // eslint-disable-next-line no-console
      console.error("[NoteForm] Submit failed:", {
        status: e?.response?.status,
        statusText: e?.response?.statusText,
        data: e?.response?.data,
        url: e?.response?.config?.url,
      });
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container" style={{ padding: 16, maxWidth: 800 }}>
      <div className="card" style={{ padding: 20 }}>
        <div className="stack">
          <div>
            <label htmlFor="title" className="label">Title</label>
            <input
              id="title"
              className="input"
              required
              aria-invalid={!!titleError}
              aria-describedby={titleError ? "title-err" : undefined}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Meeting notes, Ideas, Tasks…"
            />
            {titleError && <div id="title-err" className="banner banner-error" style={{ marginTop: 8 }}>{titleError}</div>}
          </div>

          <div>
            <label htmlFor="content" className="label">Content</label>
            <textarea
              id="content"
              className="textarea"
              required
              rows={12}
              aria-invalid={!!contentError}
              aria-describedby={contentError ? "content-err" : undefined}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here. Use line breaks to separate thoughts."
            />
            {contentError && <div id="content-err" className="banner banner-error" style={{ marginTop: 8 }}>{contentError}</div>}
          </div>

          {!diag?.configured && (
            <div className="banner banner-error" role="alert">
              Backend API is not configured. Set REACT_APP_API_BASE_URL in .env (e.g., http://localhost:8000/api/v1).
            </div>
          )}

          {error && <div className="banner banner-error" role="alert">{error}</div>}

          <div className="row-right">
            <Link to="/notes" className="btn">Cancel</Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || hasErrors || (diag && diag.configured === false)}
              aria-disabled={loading || hasErrors || (diag && diag.configured === false)}
            >
              {loading ? "Saving..." : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NoteForm;
