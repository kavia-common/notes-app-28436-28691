import React, { useEffect, useState } from "react";
import NoteForm from "../components/Notes/NoteForm";
import { getNote, updateNote } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const NoteEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initial, setInitial] = useState<{ title: string; content: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const note = await getNote(id);
        setInitial({ title: note.title, content: note.content });
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load note.");
      }
    })();
  }, [id]);

  const onSubmit = async (payload: { title: string; content: string }) => {
    if (!id) return;
    await updateNote(id, payload);
    navigate(`/notes/${id}`);
  };

  return (
    <main className="section">
      <div className="container stack">
        <div className="h1">Edit Note</div>
        {error && <div className="banner banner-error" role="alert">{error}</div>}
        {initial ? (
          <NoteForm initial={initial} onSubmit={onSubmit} submitLabel="Save Changes" />
        ) : (
          <div className="card" style={{ padding: 24 }}>
            <div className="skeleton" style={{ height: 22, width: "40%", marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 200, width: "100%" }} />
          </div>
        )}
      </div>
    </main>
  );
};

export default NoteEditPage;
