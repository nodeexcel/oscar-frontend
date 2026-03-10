import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AppNav from '../../components/layout/AppNav';

export default function UserDashboardLayout() {
  const { user, logout } = useAuth();

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="h-full min-h-screen min-h-[100dvh] flex flex-col bg-[#F0EBE6]">
      <AppNav
        appName="Booking System"
        dashboardPath="/dashboard"
        onLogout={logout}
        showUserNav={user?.role !== 'admin'}
      />
      <main className="flex-1 min-h-0 overflow-auto flex flex-col">
        <div className="p-5 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full flex flex-col flex-1 min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
