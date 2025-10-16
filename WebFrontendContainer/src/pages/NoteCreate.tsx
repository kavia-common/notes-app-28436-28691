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
    <main className="section">
      <div className="container stack">
        <div className="h1">Create Note</div>
        <NoteForm onSubmit={onSubmit} submitLabel="Create" />
      </div>
    </main>
  );
};

export default NoteCreatePage;
