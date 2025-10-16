import React, { useState } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ title, content });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container" style={{ padding: 16, maxWidth: 720 }}>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", padding: 8, width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          required
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ display: "block", padding: 8, width: "100%", resize: "vertical" }}
        />
      </div>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <button type="submit" className="theme-toggle" disabled={loading} style={{ padding: "8px 12px" }}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default NoteForm;
