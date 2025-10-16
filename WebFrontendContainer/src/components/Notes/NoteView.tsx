import React, { useEffect, useState } from "react";
import { getNote, summarizeNote } from "../../services/api";
import { useParams } from "react-router-dom";


type Props = {
  onError: (msg: string) => void;
};

const NoteView: React.FC<Props> = ({ onError }) => {
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

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!note) return <div style={{ padding: 16 }}>Note not found.</div>;

  return (
    <div className="container" style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>{note.title}</h2>
      <div style={{ whiteSpace: "pre-wrap", textAlign: "left", border: "1px solid var(--border-color)", borderRadius: 8, padding: 12 }}>
        {note.content}
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={onSummarize} disabled={summarizing} className="theme-toggle" style={{ padding: "8px 12px" }}>
          {summarizing ? "Summarizing..." : "Generate Summary"}
        </button>
      </div>
      {summaryText && (
        <div style={{ marginTop: 16, textAlign: "left" }}>
          <strong>Summary:</strong>
          <div style={{ marginTop: 6, fontStyle: "italic" }}>{summaryText}</div>
        </div>
      )}
    </div>
  );
};

export default NoteView;
