import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { KeyRound, Lock, Save } from 'lucide-react';

const ChangePasswordPage = () => {
  const { changePassword, loading } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 8) {
      addToast('New password must be at least 8 characters long', 'error');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    try {
      await changePassword(form);
      addToast('Password updated successfully!', 'success');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast('Failed to change password', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-black text-slate-950">Change Account Password</h2>
        <p className="text-xs text-slate-500 font-medium">Update your password to keep your account safe.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg text-xs font-medium">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Current Password</label>
          <div className="relative">
            <input
              type="password"
              required
              value={form.oldPassword}
              onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">New Password</label>
          <div className="relative">
            <input
              type="password"
              required
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
          <div className="relative">
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-slate-900 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Update Password</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
