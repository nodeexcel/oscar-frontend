import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validatePassword, validateRequired } from '../utils/validation';
import { getApiErrorMessage } from '../utils/apiErrors';
import AppNav from '../components/layout/AppNav';
import FormField from '../components/ui/FormField';

function ProfilePageIcon({ className = 'w-7 h-7' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export default function Profile() {
  const { user, logout, updatePassword } = useAuth();
  const [editingPassword, setEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const oldErr = validateRequired(oldPassword, 'Current password');
    if (oldErr) {
      setError(oldErr);
      return;
    }
    const newErr = validatePassword(newPassword, 'New password');
    if (newErr) {
      setError(newErr);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await updatePassword({ old_password: oldPassword, new_password: newPassword });
      setSuccess('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setEditingPassword(false);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update password.'));
    } finally {
      setLoading(false);
    }
  };

  const details = [
    { label: 'Email', value: user?.email ?? '—' },
    { label: 'Full name', value: user?.full_name ?? '—' },
    { label: 'Role', value: user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : '—' },
    ...(user?.tenant_id != null ? [{ label: 'Tenant ID', value: String(user.tenant_id) }] : []),
    { label: 'Status', value: user?.is_active ? 'Active' : 'Inactive' },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-[#F0EBE6]">
      <AppNav appName="Booking System" dashboardPath={dashboardPath} showAdminNav={user?.role === 'admin'} onLogout={logout} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto w-full p-5 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E8DFD8] text-[#5C4A42]">
              <ProfilePageIcon />
            </span>
            <h1 className="text-2xl font-semibold text-[#5C4A42] tracking-tight">Profile</h1>
          </div>
          <p className="text-[#7D6B5E] text-[15px] mb-6 ml-[3.25rem]">Your account details and password.</p>

          <div className="rounded-[1.25rem] bg-[#F8F4F0] overflow-hidden shadow-sm ring-1 ring-[#E8DFD8]/60 mb-6">
            <div className="px-5 py-3 border-b border-[#E8DFD8]/80">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8B6B5C]">Your details</h2>
            </div>
            <div className="p-5 sm:p-6">
              <dl className="space-y-4">
                {details.map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <dt className="text-sm font-medium text-[#7D6B5E] sm:w-32 shrink-0">{label}</dt>
                    <dd className="text-[#5C4A42] font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="rounded-[1.25rem] bg-[#F8F4F0] overflow-hidden shadow-sm ring-1 ring-[#E8DFD8]/60">
            <div className="px-5 py-3 border-b border-[#E8DFD8]/80 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8B6B5C]">Password</h2>
              {!editingPassword && (
                <button
                  type="button"
                  onClick={() => setEditingPassword(true)}
                  className="text-sm font-semibold text-[#8B6B5C] hover:text-[#5C4A42] transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="p-5 sm:p-6">
              {!editingPassword ? (
                <p className="text-[#7D6B5E] text-sm">Update your password to keep your account secure.</p>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {error && (
                    <div className="py-3 px-4 rounded-xl bg-red-50/80 text-red-700 text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="py-3 px-4 rounded-xl bg-green-50 text-green-700 text-sm">
                      {success}
                    </div>
                  )}
                  <FormField
                    id="profile-old_password"
                    label="Current password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Current password"
                    required
                  />
                  <FormField
                    id="profile-new_password"
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    required
                  />
                  <FormField
                    id="profile-confirm_password"
                    label="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 text-[15px] font-semibold text-[#F8F4F0] bg-[#8B6B5C] rounded-xl hover:bg-[#7D6B5E] disabled:opacity-60 transition-colors"
                    >
                      {loading ? 'Updating…' : 'Update password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPassword(false);
                        setError('');
                        setSuccess('');
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-5 py-2.5 text-[15px] font-medium text-[#5C4A42] bg-[#E8DFD8] rounded-xl hover:bg-[#ddd] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
