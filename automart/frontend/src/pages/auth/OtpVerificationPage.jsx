import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, loading } = useAuth();
  const { addToast } = useToast();

  const emailOrMobile = location.state?.emailOrMobile || 'your account';

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    setTimer(60);
    setErrorMsg('');
    addToast('A new 6-digit OTP has been sent!', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otp.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.');
      return;
    }

    try {
      await verifyOtp({ emailOrMobile, otp });
      addToast('OTP verified successfully!', 'success');
      navigate('/reset-password', { state: { emailOrMobile, otp } });
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Invalid OTP entered.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 max-w-md w-full shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-950">Enter Verification OTP</h1>
          <p className="text-xs text-slate-500 font-medium">
            We've sent a 6-digit security code to <strong className="text-slate-900">{emailOrMobile}</strong>.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 text-center">
              6-Digit OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-center text-xl font-black tracking-[0.5em] text-slate-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              {timer > 0 ? (
                <>Resend OTP in <strong className="text-slate-900">{timer}s</strong></>
              ) : (
                'Didn\'t receive OTP?'
              )}
            </span>

            {timer === 0 && (
              <button
                type="button"
                onClick={handleResend}
                className="font-extrabold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Resend OTP
              </button>
            )}
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
                <span>Verify & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
