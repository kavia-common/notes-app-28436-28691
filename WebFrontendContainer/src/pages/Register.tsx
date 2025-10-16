import React, { useState } from "react";
import { useAuth } from "../services/auth.jsx";
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
      // Auto-login after successful registration
      await login(email, password);
      navigate("/notes", { replace: true });
    } catch (e: any) {
      // Use enhanced error message from API client
      const msg = e?.uiMessage || e?.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section" style={{ maxWidth: 480 }}>
      <div className="card" style={{ padding: 32 }}>
        <h1 className="h1">Register</h1>
        <p className="muted" style={{ marginTop: 8, marginBottom: 24 }}>
          Create your account to start taking notes
        </p>
        
        <form onSubmit={onSubmit} className="stack">
          <div>
            <label htmlFor="username" className="label">Username</label>
            <input 
              id="username" 
              required 
              className="input"
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              disabled={submitting}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input 
              id="email" 
              type="email" 
              required 
              className="input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              disabled={submitting}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input 
              id="password" 
              type="password" 
              required 
              className="input"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a strong password"
              disabled={submitting}
              minLength={6}
            />
            <small className="muted" style={{ display: "block", marginTop: 4 }}>
              At least 6 characters
            </small>
          </div>
          
          {error && (
            <div className="banner banner-error" role="alert">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={submitting}
            style={{ width: "100%" }}
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>
        
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <span className="muted">Already have an account? </span>
          <Link to="/login" className="App-link">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
