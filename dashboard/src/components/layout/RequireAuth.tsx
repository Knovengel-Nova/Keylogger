import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function RequireAuth() {
  const { session: activeSession } = useAuth();
  if (!activeSession) return <Navigate to="/login" replace />;
  return <Outlet />;
}
