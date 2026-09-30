import React, { useState, useEffect } from 'react';
import * as addressApi from '../../api/addressApi';
import { useToast } from '../../hooks/useToast';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Home, Building } from 'lucide-react';

const AddressesPage = () => {
  const { addToast } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    mobileNumber: '',
    addressLine: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560001',
    addressType: 'Home',
    isDefault: false
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const list = await addressApi.getAddressesApi();
      setAddresses(list || []);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setForm({ ...addr });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await addressApi.deleteAddressApi(id);
    await loadAddresses();
    addToast('Address deleted', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await addressApi.updateAddressApi(editingId, form);
      addToast('Address updated successfully', 'success');
    } else {
      await addressApi.createAddressApi(form);
      addToast('New address added', 'success');
    }
    setShowForm(false);
    setEditingId(null);
    await loadAddresses();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-950">Saved Delivery Addresses</h2>
          <p className="text-xs text-slate-500 font-medium">Manage your delivery locations for fast express checkout.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              name: '',
              mobileNumber: '',
              addressLine: '',
              landmark: '',
              city: 'Bengaluru',
              state: 'Karnataka',
              pinCode: '560001',
              addressType: 'Home',
              isDefault: false
            });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs font-medium">
          <h3 className="font-extrabold text-slate-900 text-sm">{editingId ? 'Edit Address' : 'Add New Shipping Address'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
              <input
                type="text"
                required
                maxLength={10}
                value={form.mobileNumber}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Address Line</label>
            <input
              type="text"
              required
              value={form.addressLine}
              onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">State</label>
              <input
                type="text"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">PIN Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={form.pinCode}
                onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-brand-600"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">{addr.name}</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 uppercase">
                {addr.addressType}
              </span>
            </div>
            <p className="text-xs text-slate-600">{addr.addressLine}</p>
            <p className="text-xs text-slate-600">{addr.city}, {addr.state} — {addr.pinCode}</p>
            <p className="text-xs font-semibold text-slate-500">Phone: {addr.mobileNumber}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 text-xs">
              <button
                onClick={() => handleEdit(addr)}
                className="text-slate-600 hover:text-slate-950 font-bold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressesPage;
