import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, loading } = useAuth();
  const { addToast } = useToast();

  const emailOrMobile = location.state?.emailOrMobile || '';
  const otp = location.state?.otp || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      await resetPassword({ emailOrMobile, otp, newPassword: password });
      addToast('Password reset successfully! Please sign in with your new password.', 'success');
      navigate('/login');
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 max-w-md w-full shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-950">Reset Your Password</h1>
          <p className="text-xs text-slate-500 font-medium">
            Create a new strong password for your AutoMart account.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="font-bold text-slate-700 block mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 hover:bg-brand-600 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Reset Password & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
