import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useAuth } from '../../hooks/useAuth';
import { User, Package, MapPin, KeyRound, LogOut, ShieldCheck } from 'lucide-react';

const AccountLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">{user?.fullName}</h1>
            <p className="text-xs text-slate-400 font-medium">{user?.email} • {user?.mobileNumber}</p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 bg-slate-800 text-brand-400 rounded-full text-xs font-extrabold border border-slate-700 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> AutoMart Verified Customer
        </span>
      </div>

      {/* Navigation & Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Menu */}
        <aside className="bg-white rounded-3xl border border-slate-200 p-4 space-y-1 shadow-sm">
          <NavLink
            to="/account/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </NavLink>

          <NavLink
            to="/account/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <Package className="w-4 h-4" />
            <span>My Orders</span>
          </NavLink>

          <NavLink
            to="/account/addresses"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </NavLink>

          <NavLink
            to="/account/change-password"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all mt-4 border-t border-slate-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Right Active View */}
        <main className="lg:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
