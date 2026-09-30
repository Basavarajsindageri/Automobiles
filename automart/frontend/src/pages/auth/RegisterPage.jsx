import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Car, User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password Validation Checks
  const hasMinLength = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  const passwordScore = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.fullName.length < 3 || formData.fullName.length > 100) {
      setErrorMsg('Full Name must be between 3 and 100 characters.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      setErrorMsg('Mobile number must be exactly 10 digits.');
      return;
    }

    if (passwordScore < 5) {
      setErrorMsg('Password does not satisfy all strength requirements.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    try {
      await register(formData);
      addToast('Account created successfully! Welcome to AutoMart.', 'success');
      navigate('/');
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 max-w-lg w-full shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-md group-hover:bg-brand-600 transition-colors">
              <Car className="w-6 h-6 text-brand-500 group-hover:text-white" />
            </div>
            <span className="text-2xl font-black text-slate-950">
              Auto<span className="text-brand-600">Mart</span>
            </span>
          </Link>

          <h1 className="text-2xl font-black text-slate-950">Create Your AutoMart Account</h1>
          <p className="text-xs text-slate-500 font-medium">
            Join thousands of automobile enthusiasts shopping genuine accessories.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          {/* Full Name */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Email & Mobile Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="rahul@automart.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">10-Digit Mobile Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Create strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            {/* Password strength meter */}
            {formData.password && (
              <div className="mt-2 space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                <div className="flex justify-between font-bold">
                  <span>Password Strength:</span>
                  <span
                    className={
                      passwordScore <= 2
                        ? 'text-rose-600'
                        : passwordScore <= 4
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }
                  >
                    {passwordScore <= 2 ? 'Weak' : passwordScore <= 4 ? 'Moderate' : 'Strong'}
                  </span>
                </div>
                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-200">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 transition-all ${
                        i < passwordScore
                          ? passwordScore <= 2
                            ? 'bg-rose-500'
                            : passwordScore <= 4
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 font-medium">
                  <span className={hasMinLength ? 'text-emerald-600 font-bold' : ''}>✓ 8+ characters</span>
                  <span className={hasUpper ? 'text-emerald-600 font-bold' : ''}>✓ Uppercase letter</span>
                  <span className={hasLower ? 'text-emerald-600 font-bold' : ''}>✓ Lowercase letter</span>
                  <span className={hasNumber ? 'text-emerald-600 font-bold' : ''}>✓ Number</span>
                  <span className={hasSpecial ? 'text-emerald-600 font-bold' : ''}>✓ Special symbol</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2 cursor-pointer text-slate-600 pt-1">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 mt-0.5"
            />
            <span>
              I agree to the <span className="font-bold text-slate-900">AutoMart Terms of Service</span> and{' '}
              <span className="font-bold text-slate-900">Privacy Policy</span>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 hover:bg-brand-600 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Create AutoMart Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-extrabold text-brand-600 hover:text-brand-700">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
