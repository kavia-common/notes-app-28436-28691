import React, { useState } from "react";
import NotesList from "../components/Notes/NotesList";

const NotesPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      {error && <div style={{ color: "red", padding: 12 }}>{error}</div>}
      <NotesList onError={(msg) => setError(msg)} />
    </div>
  );
};

export default NotesPage;
