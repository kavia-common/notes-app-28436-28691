import React, { useEffect, useState } from "react";
import BackendHealthCheck from "./BackendHealthCheck";

/**
 * PUBLIC_INTERFACE
 * Higher-order component that wraps a component with backend health checking.
 * Displays health check UI until backend is confirmed healthy.
 */
export function withBackendCheck<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const [isHealthy, setIsHealthy] = useState(false);
    const [showHealthCheck, setShowHealthCheck] = useState(true);

    useEffect(() => {
      // Check if user has a token - if so, they might have been able to connect before
      const token = localStorage.getItem("token");
      if (token) {
        // Skip health check if user was previously authenticated
        setIsHealthy(true);
        setShowHealthCheck(false);
      }
    }, []);

    const handleHealthy = () => {
      setIsHealthy(true);
      setShowHealthCheck(false);
    };

    const handleUnhealthy = () => {
      setIsHealthy(false);
    };

    if (showHealthCheck && !isHealthy) {
      return <BackendHealthCheck onHealthy={handleHealthy} onUnhealthy={handleUnhealthy} />;
    }

    return <WrappedComponent {...props} />;
  };
}
