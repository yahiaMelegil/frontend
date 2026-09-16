import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export function ProtectedRoute({ accountType, loginPath }) {
  const { sessions } = useAuth();
  const location = useLocation();
  const session = sessions[accountType];

  if (!session || session.isLoading) return null;
  if (!session.isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export function GuestRoute({ accountType, redirectTo }) {
  const { sessions } = useAuth();
  const session = sessions[accountType];

  if (!session || session.isLoading) return null;
  if (session.isAuthenticated) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
}
