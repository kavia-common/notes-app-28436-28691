import React, { useEffect, useState } from "react";
import { getNote, summarizeNote } from "../../services/api";
import { useParams } from "react-router-dom";
import type { Note } from "../../types/index";

type Props = {
  onError: (msg: string) => void;
};

const NoteView: React.FC<Props> = ({ onError }): JSX.Element => {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [summarizing, setSummarizing] = useState<boolean>(false);
  const [summaryText, setSummaryText] = useState<string>("");

  const fetchNote = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getNote(id);
      setNote(data);
      if (data?.summary) setSummaryText(data.summary);
    } catch (e: any) {
      onError(e?.response?.data?.message || "Failed to load note.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSummarize = async () => {
    if (!id) return;
    setSummarizing(true);
    try {
      const result = await summarizeNote(id);
      const text = result?.summary || result?.summary_text || "";
      if (text) setSummaryText(text);
    } catch (e: any) {
      onError(e?.response?.data?.message || "Failed to summarize note.");
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) {
    return (
      <div className="container section">
        <div className="card" style={{ padding: 24 }}>
          <div className="skeleton" style={{ height: 22, width: "50%", marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 200, width: "100%" }} />
        </div>
      </div>
    );
  }
  if (!note) {
    return (
      <div className="container section">
        <div className="banner banner-error">Note not found.</div>
      </div>
    );
  }

  return (
    <main className="container section">
      <article className="card" style={{ padding: 24 }}>
        <h1 className="h1">{note.title}</h1>
        <div className="muted" style={{ marginTop: 6 }}>
          {new Date(note.updated_at || note.created_at).toLocaleString()}
        </div>

        <div className="prose" style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>
          {note.content}
        </div>

        {typeof summarizeNote === "function" && (
          <div className="row-right" style={{ marginTop: 16 }}>
            <button
              onClick={onSummarize}
              disabled={summarizing}
              className="btn btn-primary summarize-btn"
              aria-label="Generate summary"
            >
              {summarizing ? "Summarizing..." : "Generate Summary"}
            </button>
          </div>
        )}

        {summaryText && (
          <section className="card" style={{ padding: 16, marginTop: 16 }}>
            <div className="h2">Summary</div>
            <div className="prose" style={{ marginTop: 8, fontStyle: "italic" }}>{summaryText}</div>
          </section>
        )}
      </article>
    </main>
  );
};

export default NoteView;
