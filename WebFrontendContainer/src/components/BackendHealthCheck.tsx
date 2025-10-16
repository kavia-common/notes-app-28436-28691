import React, { useEffect, useState } from "react";
import { api } from "../services/api";

interface HealthCheckProps {
  onHealthy?: () => void;
  onUnhealthy?: () => void;
}

/**
 * PUBLIC_INTERFACE
 * Backend health check component that periodically verifies backend availability.
 * Displays friendly error messages and retry options when backend is unavailable.
 */
const BackendHealthCheck: React.FC<HealthCheckProps> = ({ onHealthy, onUnhealthy }) => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastError, setLastError] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      // Try to reach the backend health endpoint
      const baseURL = (api.defaults.baseURL || "").replace("/api/v1", "");
      const response = await fetch(`${baseURL}/health`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        setIsHealthy(true);
        setLastError("");
        onHealthy?.();
      } else {
        setIsHealthy(false);
        setLastError(`Backend returned status: ${response.status} ${response.statusText}`);
        onUnhealthy?.();
      }
    } catch (error: any) {
      setIsHealthy(false);
      const baseURL = api.defaults.baseURL || "configured backend URL";
      setLastError(
        `Cannot reach backend at ${baseURL}. Please ensure the Backend API Container is running and accessible.`
      );
      onUnhealthy?.();
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (isHealthy === null) {
    return (
      <div className="container section" style={{ maxWidth: 600 }}>
        <div className="card" style={{ padding: 24, textAlign: "center" }}>
          <div className="h2">Checking backend connection...</div>
          <div className="skeleton" style={{ height: 40, width: "100%", marginTop: 16 }} />
        </div>
      </div>
    );
  }

  if (isHealthy === false) {
    return (
      <div className="container section" style={{ maxWidth: 600 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="banner banner-error" role="alert" style={{ marginBottom: 16 }}>
            <div className="h2" style={{ marginBottom: 8 }}>⚠️ Backend Not Available</div>
            <p style={{ margin: "8px 0" }}>{lastError}</p>
          </div>

          <div className="stack" style={{ marginTop: 16 }}>
            <div>
              <strong>What you can do:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>Ensure the Backend API Container is running</li>
                <li>Check that the backend is accessible at the configured URL</li>
                <li>Verify CORS is properly configured on the backend</li>
                <li>Check network connectivity and firewall settings</li>
              </ul>
            </div>

            <div>
              <strong>Backend Configuration:</strong>
              <code
                style={{
                  display: "block",
                  background: "var(--bg-elev)",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  marginTop: 8,
                  fontSize: 13,
                }}
              >
                {api.defaults.baseURL || "Not configured"}
              </code>
            </div>

            <div className="row-right" style={{ marginTop: 16 }}>
              <button
                onClick={handleRetry}
                disabled={isChecking}
                className="btn btn-primary"
                aria-label="Retry connection to backend"
              >
                {isChecking ? "Checking..." : "Retry Connection"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Backend is healthy, don't render anything
  return null;
};

export default BackendHealthCheck;
