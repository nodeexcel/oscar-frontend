import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import FormField from '../../components/ui/FormField';
import AuthForm from '../../components/auth/AuthForm';

const RESEND_COOLDOWN = 120;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((n) => (n <= 1 ? 0 : n - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setSuccess(res.message || 'Check your email for reset instructions.');
      setResendIn(RESEND_COOLDOWN);
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(Array.isArray(msg) ? msg.map((x) => x.msg).join(', ') : msg?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const canResend = resendIn === 0;

  return (
    <>
      <AuthForm
        title="Forgot password?"
        subtitle="Enter your email and we'll send you a reset link"
        error={error}
        success={success}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel={resendIn > 0 ? `Resend in ${resendIn}s` : 'Send reset link'}
        submitDisabled={!canResend}
      >
        <FormField id="forgot-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      </AuthForm>
      <p className="mt-6 text-center text-sm text-[#2d3238]">
        <Link to="/login" className="text-[#1a1d21] font-medium hover:underline">Back to sign in</Link>
      </p>
    </>
  );
}
