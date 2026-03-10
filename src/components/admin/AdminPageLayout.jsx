import { Link } from 'react-router-dom';

export function AdminPageBack() {
  return (
    <Link
      to="/admin"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5c6370] hover:text-[#1a1d21] mb-6 transition-colors no-underline"
    >
      <span>←</span>
      <span>Back to dashboard</span>
    </Link>
  );
}

export function AdminPageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-[#5C4A42] tracking-tight mb-0.5">{title}</h1>
      {subtitle && <p className="text-[#7D6B5E] text-[15px]">{subtitle}</p>}
    </div>
  );
}

export function AdminCard({ children, className = '' }) {
  return (
    <div className={`rounded-[1.25rem] bg-[#F8F4F0] shadow-sm ring-1 ring-[#E8DFD8]/60 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
