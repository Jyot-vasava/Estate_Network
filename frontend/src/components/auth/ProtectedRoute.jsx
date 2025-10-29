import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log("ProtectedRoute:", {
    isAuthenticated,
    loading,
    user,
    requireAdmin,
  });

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    toast.error("Please login to continue");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    toast.error("Access denied - Admin only");
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
