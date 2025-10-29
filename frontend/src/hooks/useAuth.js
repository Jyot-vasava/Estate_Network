import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  const requireAuth = (redirectTo = "/login") => {
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate(redirectTo);
      }
    }, [isAuthenticated, loading, navigate, redirectTo]);
  };

  const requireAdmin = (redirectTo = "/unauthorized") => {
    useEffect(() => {
      if (!loading && (!isAuthenticated || !isAdmin)) {
        navigate(redirectTo);
      }
    }, [isAuthenticated, isAdmin, loading, navigate, redirectTo]);
  };

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin,
    isUser,
    requireAuth,
    requireAdmin,
  };
};
