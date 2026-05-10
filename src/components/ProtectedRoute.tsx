import type React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-3.5">
          <div className="h-9 w-9 rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-accent)] animate-spin-custom" />
          <span
            className="text-[13px] text-[var(--color-text-muted)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
