import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Car, Mail, ArrowRight, KeyRound } from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useAuth();
  const { addToast } = useToast();

  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrMobile.trim()) {
      setErrorMsg('Please enter your registered email or mobile number.');
      return;
    }

    try {
      await forgotPassword({ emailOrMobile });
      addToast('OTP sent successfully!', 'info');
      navigate('/verify-otp', { state: { emailOrMobile } });
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Failed to send OTP.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 max-w-md w-full shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-950">Forgot Password</h1>
          <p className="text-xs text-slate-500 font-medium">
            Enter your registered email or 10-digit mobile number to receive a 6-digit verification OTP.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email or Mobile Number</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="rahul@example.com or 9876543210"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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
                <span>Send Verification OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Remembered your password?{' '}
          <Link to="/login" className="font-extrabold text-brand-600 hover:text-brand-700">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
