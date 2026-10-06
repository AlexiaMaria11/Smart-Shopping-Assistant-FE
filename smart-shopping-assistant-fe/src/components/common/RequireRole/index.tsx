import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Role } from "../../../api/models/AuthModel";
import { useAuth } from "../../../context/AuthContext/auth-context";

interface RequireRoleProps {
  roles?: Role[];
  children: ReactNode;
}

// Guests go to the login page; signed-in users without the right role go home
function RequireRole({ roles, children }: RequireRoleProps) {
  const { user, signedOutFrom } = useAuth();
  const location = useLocation();

  if (user === null) {
    // Signing out on a protected page should not bounce the user to the login form
    if (signedOutFrom === location.pathname) return <Navigate to="/" replace />;
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default RequireRole;
