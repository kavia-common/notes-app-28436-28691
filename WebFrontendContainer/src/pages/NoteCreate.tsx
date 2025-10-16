import React from "react";
import NoteForm from "../components/Notes/NoteForm";
import { createNote, getApiErrorMessage } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../services/auth";

const NoteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { isAuthenticated } = useAuth ? require("../services/auth") : { isAuthenticated: false };

  const onSubmit = async (payload: { title: string; content: string }) => {
    // If auth is enabled and the user isn't authenticated, redirect to login instead of failing silently
    try {
      if (typeof isAuthenticated === "boolean" && !isAuthenticated) {
        navigate("/login", { replace: true, state: { from: location } });
        return;
      }
    } catch {
      // If auth context isn't available (no-auth preview), proceed without redirect.
    }

    try {
      const note = await createNote(payload);
      // Help verification in preview logs
      // eslint-disable-next-line no-console
      console.info("[NoteCreate] Note created:", note?.id);
      if (note?.id) {
        navigate(`/notes/${note.id}`);
      } else {
        navigate("/notes");
      }
    } catch (e: any) {
      const msg = getApiErrorMessage ? getApiErrorMessage(e, "Failed to submit form.") : (e?.response?.data?.message || "Failed to submit form.");
      // Re-throw to let NoteForm show the message
      const err: any = new Error(msg);
      err.uiMessage = msg;
      throw err;
    }
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
