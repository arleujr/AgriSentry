import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
  const { token } = useAuth();

  if (token) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
}