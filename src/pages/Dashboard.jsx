import { useAuth } from '../contexts/AuthContext';
import AppNav from '../components/layout/AppNav';

const DASHBOARD_QUOTE = 'Manage reservations, maximise revenue and give guests a reason to return.';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-[#efece7]">
      <AppNav appName="Booking System" dashboardPath="/dashboard" onLogout={logout} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <p className="text-[#1a1d21] text-lg md:text-xl font-medium text-center max-w-xl leading-relaxed">
            {DASHBOARD_QUOTE}
          </p>
        </div>
      </main>
    </div>
  );
}
