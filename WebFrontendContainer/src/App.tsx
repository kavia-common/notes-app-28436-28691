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
 * Root Application component with public routes only (auth disabled).
 * BrowserRouter lives here; CRA dev server proxies API calls via package.json.
 */
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/notes" replace />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/new" element={<NoteCreatePage />} />
        <Route path="/notes/:id/edit" element={<NoteEditPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        <Route path="*" element={<div className="container section">Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
