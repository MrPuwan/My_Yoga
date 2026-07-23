import { useAuth } from '../../context/AuthContext';
import UserDashboard from '../../components/dashboard/UserDashboard';
import AdminDashboard from '../../components/dashboard/AdminDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-[#eaeee3] px-4 py-8 sm:-m-6 sm:px-6 sm:py-10">
      {user?.role === 'ADMIN' ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}
