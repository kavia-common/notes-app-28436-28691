import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Layout/Header";
import NotesPage from "./pages/Notes";
import NoteCreatePage from "./pages/NoteCreate";
import NoteEditPage from "./pages/NoteEdit";
import NoteDetailPage from "./pages/NoteDetail";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import PrivateRoute from "./routes/PrivateRoute";
import "./styles/utilities.css";
import "./App.css";

/**
 * Root Application component with authentication support.
 * BrowserRouter lives here; all authenticated routes are protected via PrivateRoute.
 * 
 * Public routes: /login, /register
 * Protected routes: /notes, /notes/new, /notes/:id, /notes/:id/edit
 */
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes - require authentication */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/new" element={<NoteCreatePage />} />
          <Route path="/notes/:id/edit" element={<NoteEditPage />} />
          <Route path="/notes/:id" element={<NoteDetailPage />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<div className="container section">Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
