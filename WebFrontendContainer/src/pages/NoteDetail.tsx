import React, { useState } from "react";
import NoteView from "../components/Notes/NoteView";

const NoteDetailPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {error && (
        <div className="container" style={{ paddingTop: 12 }}>
          <div className="banner banner-error" role="alert">{error}</div>
        </div>
      )}
      <NoteView onError={(msg) => setError(msg)} />
    </div>
  );
};

export default NoteDetailPage;
