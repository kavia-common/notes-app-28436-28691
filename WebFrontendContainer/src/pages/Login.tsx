import React, { useState } from "react";
import { useAuth } from "../services/auth.jsx";
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
    
    if (submitting) return; // Prevent double submission
    
    setSubmitting(true);
    setError(null);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (e: any) {
      // Use enhanced error message from API client
      let msg = e?.uiMessage || e?.response?.data?.message || "Login failed. Check your credentials.";
      
      // Add helpful context for network errors
      if (e?.request && !e?.response) {
        msg = e.uiMessage || "Cannot reach backend authentication service.";
        
        // Add detailed troubleshooting info
        const backendUrl = e?.config?.baseURL || "the configured backend URL";
        msg += `\n\n🔧 Troubleshooting:\n• Backend URL: ${backendUrl}\n• Ensure Backend API Container is running\n• Check CORS configuration\n• Verify network connectivity`;
        
        const statusText = e?.request?.statusText;
        if (statusText) {
          msg += `\n• Status: ${statusText}`;
        }
      }
      
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section" style={{ maxWidth: 480 }}>
      <div className="card" style={{ padding: 32 }}>
        <h1 className="h1">Login</h1>
        <p className="muted" style={{ marginTop: 8, marginBottom: 24 }}>
          Sign in to access your notes
        </p>
        
        <form onSubmit={onSubmit} className="stack">
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
              autoComplete="email"
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
              placeholder="Enter your password"
              disabled={submitting}
              autoComplete="current-password"
            />
          </div>
          
          {error && (
            <div className="banner banner-error" role="alert" style={{ whiteSpace: "pre-wrap" }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={submitting}
            style={{ width: "100%" }}
            aria-busy={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <span className="muted">Don't have an account? </span>
          <Link to="/register" className="App-link">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
