import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="py-16 text-center text-slate-500">Loading...</div>;
  }

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
