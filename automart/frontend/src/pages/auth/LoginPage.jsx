import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Car, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const { addToast } = useToast();

  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: '',
    rememberMe: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.emailOrMobile.trim() || !formData.password) {
      setErrorMsg('Please enter your registered email/mobile and password.');
      return;
    }

    try {
      await login(formData);
      addToast('Welcome back to AutoMart!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Invalid login credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 max-w-md w-full shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-md group-hover:bg-brand-600 transition-colors">
              <Car className="w-6 h-6 text-brand-500 group-hover:text-white" />
            </div>
            <span className="text-2xl font-black text-slate-950">
              Auto<span className="text-brand-600">Mart</span>
            </span>
          </Link>

          <h1 className="text-2xl font-black text-slate-950">Sign In to Your Account</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your orders, saved wishlist, and addresses.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address or Mobile Number</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="rahul@example.com or 9876543210"
                value={formData.emailOrMobile}
                onChange={(e) => setFormData({ ...formData, emailOrMobile: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-brand-600 hover:text-brand-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
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

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 hover:bg-brand-600 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
          Don't have an AutoMart account?{' '}
          <Link to="/register" className="font-extrabold text-brand-600 hover:text-brand-700">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
