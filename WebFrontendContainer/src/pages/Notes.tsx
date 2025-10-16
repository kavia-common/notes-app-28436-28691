import React, { useState } from "react";
import NotesList from "../components/Notes/NotesList";

const NotesPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      {error && (
        <div className="container" style={{ paddingTop: 12 }}>
          <div className="banner banner-error" role="alert">{error}</div>
        </div>
      )}
      <NotesList onError={(msg) => setError(msg)} />
    </div>
  );
};

export default NotesPage;
