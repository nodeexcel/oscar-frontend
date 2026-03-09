import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DASHBOARD_QUOTE = 'Manage reservations, maximise revenue and give guests a reason to return.';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#efece7]">
      <nav className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-[#fafaf8] border-b border-[#e8e6e3]">
        <Link to="/dashboard" className="text-xl font-bold text-[#1a1d21] tracking-tight no-underline">Booking System</Link>
        <button type="button" onClick={handleLogout} className="py-2.5 px-5 text-[15px] font-semibold text-white bg-[#1a1d21] rounded-lg hover:bg-[#2d3238] transition-colors">Logout</button>
      </nav>
      <main className="flex-1 flex items-center justify-center p-6">
        <p className="text-[#1a1d21] text-lg md:text-xl font-medium text-center max-w-xl leading-relaxed">{DASHBOARD_QUOTE}</p>
      </main>
    </div>
  );
}
