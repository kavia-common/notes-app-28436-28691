import React from "react";
import NoteForm from "../components/Notes/NoteForm";
import { createNote } from "../services/api";
import { useNavigate } from "react-router-dom";

const NoteCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const onSubmit = async (payload: { title: string; content: string }) => {
    const note = await createNote(payload);
    navigate(`/notes/${note.id}`);
  };

  return (
    <div>
      <h2 style={{ padding: 16, margin: 0 }}>Create Note</h2>
      <NoteForm onSubmit={onSubmit} submitLabel="Create" />
    </div>
  );
};

export default NoteCreatePage;
