import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAllowed: Boolean;
  redirectPath: string;
  children: ReactNode;
}

const ProtectedRoute = ({ isAllowed, redirectPath, children }: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children || <Outlet />;
};

export default ProtectedRoute;
