import React, { useState } from "react";
import { useAuth } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Create account
      await register(username, email, password);
      // Auto-login to satisfy "successful backend response leads to login/token state and navigation"
      await login(email, password);
      navigate("/notes", { replace: true });
    } catch (e: any) {
      // Prefer normalized uiMessage if provided by api.ts
      const msg = e?.uiMessage || e?.response?.data?.message || "Registration failed.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, padding: 16 }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username">Username</label>
          <input id="username" required value={username} onChange={(e) => setUsername(e.target.value)} style={{ display: "block", width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: "block", width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: "block", width: "100%", padding: 8 }} />
        </div>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <button type="submit" className="theme-toggle" disabled={submitting} style={{ padding: "8px 12px" }}>
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
