import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Layout/Header";
import NotesPage from "./pages/Notes";
import NoteCreatePage from "./pages/NoteCreate";
import NoteEditPage from "./pages/NoteEdit";
import NoteDetailPage from "./pages/NoteDetail";
import "./styles/utilities.css";
import "./App.css";

/**
 * Root Application component with no-auth mode.
 * All routes are now public and accessible without authentication.
 * Users go directly to notes interface.
 */
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Direct to notes home */}
        <Route path="/" element={<NotesPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/new" element={<NoteCreatePage />} />
        <Route path="/notes/:id/edit" element={<NoteEditPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
