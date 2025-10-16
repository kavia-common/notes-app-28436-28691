import React, { useState } from "react";
import { useAuth } from "../services/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || "/notes";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, padding: 16 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
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
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default LoginPage;
