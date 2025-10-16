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
    <div>
      <h2 style={{ padding: 16, margin: 0 }}>Edit Note</h2>
      {error && <div style={{ color: "red", paddingLeft: 16 }}>{error}</div>}
      {initial ? <NoteForm initial={initial} onSubmit={onSubmit} submitLabel="Save Changes" /> : <div style={{ padding: 16 }}>Loading...</div>}
    </div>
  );
};

export default NoteEditPage;
