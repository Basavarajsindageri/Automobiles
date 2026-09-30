import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { User, Mail, Phone, Save, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobileNumber: user?.mobileNumber || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast('Failed to update profile', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-black text-slate-950">My Profile Details</h2>
        <p className="text-xs text-slate-500 font-medium">
          Update your personal contact details for orders and invoice receipts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg text-xs font-medium">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
          <div className="relative">
            <input
              type="text"
              required
              maxLength={10}
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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
              <span>Save Changes</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
