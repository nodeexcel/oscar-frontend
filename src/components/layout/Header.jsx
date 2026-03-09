import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ChevronDown() {
  return (
    <svg className="w-4 h-4 ml-0.5 text-[#1a1d21]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function Header() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navLinks = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Platform', href: '#platform' },
    { label: 'Company', href: '#company' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf8] border-b border-[#e8e6e3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link to="/" className="flex items-center gap-2 hover:no-underline">
            <span className="text-2xl font-bold text-[#1a1d21] tracking-tight">Booking System</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center text-[15px] font-medium text-[#1a1d21] hover:text-[#2d3238] no-underline"
              >
                {label}
                <ChevronDown />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {!loading && (
              user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-[15px] font-medium text-[#1a1d21] hover:text-[#2d3238] no-underline"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center py-2.5 px-5 text-[15px] font-semibold text-white bg-[#1a1d21] rounded-lg hover:bg-[#2d3238] transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[15px] font-medium text-[#1a1d21] hover:text-[#2d3238] no-underline"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center py-2.5 px-5 text-[15px] font-semibold text-[#efece7] bg-[#1a1d21] rounded-lg hover:bg-[#2d3238] transition-colors no-underline"
                  >
                    Get a Demo
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
