import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./services/auth";
import PrivateRoute from "./routes/PrivateRoute";
import Header from "./components/Layout/Header";
import NotesPage from "./pages/Notes";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import NoteCreatePage from "./pages/NoteCreate";
import NoteEditPage from "./pages/NoteEdit";
import NoteDetailPage from "./pages/NoteDetail";
import "./App.css";

/**
 * Root Application component with routes and providers
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/new" element={<NoteCreatePage />} />
            <Route path="/notes/:id/edit" element={<NoteEditPage />} />
            <Route path="/notes/:id" element={<NoteDetailPage />} />
          </Route>

          <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
