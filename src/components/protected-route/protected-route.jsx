import React from "react";
import { useAuth } from "../../auth/auth-provider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const auth = useAuth();
  return <>{auth.isAuthenticated ? <Outlet/> : <Navigate to="/" />}</>;
};  

export default ProtectedRoute;
