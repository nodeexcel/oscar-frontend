import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../api/auth';
import FormField from '../../components/ui/FormField';
import AuthForm from '../../components/auth/AuthForm';

export default function ResetPassword() {
  const [form, setForm] = useState({ token: '', new_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await resetPassword(form);
      setSuccess(res.message || 'Password updated. You can sign in now.');
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(Array.isArray(msg) ? msg.map((x) => x.msg).join(', ') : msg?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <h1 className="m-0 mb-2 text-2xl font-bold text-[#1a1d21] tracking-tight">Password updated</h1>
        <p className="m-0 mb-6 text-[15px] text-[#2d3238]">{success}</p>
        <Link to="/login" className="text-[#1a1d21] font-medium hover:underline">Sign in</Link>
      </>
    );
  }

  return (
    <>
      <AuthForm
        title="Set new password"
        subtitle="Enter your new password below"
        error={error}
        success={success}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Update password"
      >
        <FormField id="reset-token" label="Reset token" value={form.token} onChange={(e) => setForm((p) => ({ ...p, token: e.target.value }))} placeholder="Paste token from email" required />
        <FormField id="reset-new_password" label="New password" type="password" value={form.new_password} onChange={(e) => setForm((p) => ({ ...p, new_password: e.target.value }))} placeholder="New password" required />
      </AuthForm>
      <p className="mt-6 text-center text-sm text-[#2d3238]">
        <Link to="/login" className="text-[#1a1d21] font-medium hover:underline">Back to sign in</Link>
      </p>
    </>
  );
}