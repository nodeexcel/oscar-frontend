import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AppNav from './AppNav';
import AppIcon from './AppIcon';

const navLinks = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'Platform', href: '#platform' },
  { label: 'Company', href: '#company' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Header() {
  const { user, loading, logout } = useAuth();

  if (!loading && user) {
    const dashboardPath = user.role === 'admin' ? '/admin' : '/dashboard';
    return <AppNav appName="Booking System" dashboardPath={dashboardPath} onLogout={logout} />;
  }

  return (
    <header className="sticky top-0 z-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between h-14 px-5 sm:px-6 rounded-2xl bg-[#F8F4F0]/95 border border-[#E8DFD8] shadow-sm backdrop-blur-sm transition-shadow duration-200">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#5C4A42] no-underline hover:no-underline hover:text-[#6B5B52] transition-colors duration-150"
          >
            <AppIcon className="w-8 h-8" />
            <span className="text-lg font-semibold tracking-tight">Booking System</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[15px] font-medium text-[#5C4A42] hover:text-[#7D6B5E] no-underline hover:no-underline transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[15px] font-medium text-[#5C4A42] hover:text-[#7D6B5E] no-underline hover:no-underline transition-colors duration-150"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center py-2.5 px-5 text-[15px] font-semibold text-[#F8F4F0] bg-[#8B6B5C] rounded-lg hover:bg-[#7D6B5E] no-underline hover:no-underline transition-all duration-150"
            >
              Get a Demo
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
