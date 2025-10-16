import React, { useState } from "react";
import NoteView from "../components/Notes/NoteView";

const NoteDetailPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {error && <div style={{ color: "red", padding: 12 }}>{error}</div>}
      <NoteView onError={(msg) => setError(msg)} />
    </div>
  );
};

export default NoteDetailPage;
