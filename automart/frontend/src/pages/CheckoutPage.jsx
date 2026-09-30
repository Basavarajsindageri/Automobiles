import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/currency';
import * as addressApi from '../api/addressApi';
import * as orderApi from '../api/orderApi';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle2, 
  Plus, 
  Truck, 
  ShieldCheck, 
  Building2, 
  Phone,
  QrCode,
  Banknote,
  ChevronRight
} from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, totalDiscount, deliveryCharge, tax, grandTotal } = useCart();
  const { addToast } = useToast();

  const [step, setStep] = useState(2); // 1: Login (verified), 2: Address, 3: Review, 4: Payment
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [loading, setLoading] = useState(false);

  // Address Form fields
  const [newAddress, setNewAddress] = useState({
    name: user?.fullName || '',
    mobileNumber: user?.mobileNumber || '',
    addressLine: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560001',
    addressType: 'Home'
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const list = await addressApi.getAddressesApi();
    setAddresses(list || []);
    const defaultAddr = (list || []).find((a) => a.isDefault) || (list || [])[0];
    if (defaultAddr) setSelectedAddressId(defaultAddr.id);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.addressLine || !newAddress.pinCode) {
      addToast('Please fill out required address line and PIN code', 'error');
      return;
    }
    const created = await addressApi.createAddressApi(newAddress);
    await loadAddresses();
    setSelectedAddressId(created.id);
    setShowAddAddressForm(false);
    addToast('New address saved!', 'success');
  };

  const handlePlaceOrder = async () => {
    const activeAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!activeAddress) {
      addToast('Please select a valid shipping address', 'error');
      setStep(2);
      return;
    }

    if (paymentMethod === 'UPI' && !upiId.includes('@')) {
      addToast('Please enter a valid UPI ID (e.g. username@upi)', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        address: activeAddress,
        items: cartItems,
        subtotal,
        discount: totalDiscount,
        deliveryCharge,
        tax,
        grandTotal,
        paymentMethod
      };

      const createdOrder = await orderApi.createOrderApi(payload);
      addToast('Order placed successfully!', 'success');
      navigate('/order-success', { state: { order: createdOrder } });
    } catch (err) {
      addToast('Failed to process order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Cart', link: '/cart' }, { label: 'Checkout' }]} />

      {/* Step Wizard Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex items-center justify-around text-xs font-bold">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[11px]">1</span>
          <span className="hidden sm:inline">Account</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
          <span>Shipping Address</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
          <span>Order Review</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <div className={`flex items-center gap-2 ${step >= 4 ? 'text-slate-900' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 4 ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-600'}`}>4</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Interactive Wizard Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 2: ADDRESS MANAGEMENT */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-black text-slate-950 text-base">
                <MapPin className="w-5 h-5 text-brand-600" />
                <h2>Select Shipping Address</h2>
              </div>
              <button
                onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>

            {/* Address Selection List */}
            {!showAddAddressForm && (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-slate-950 bg-slate-50/80 ring-2 ring-slate-950/10 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 text-xs">
                      <input
                        type="radio"
                        name="address-select"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{addr.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 font-bold text-[10px] text-slate-700">
                            {addr.addressType}
                          </span>
                        </div>
                        <p className="text-slate-600 font-medium">{addr.addressLine}, {addr.landmark}</p>
                        <p className="text-slate-600 font-medium">{addr.city}, {addr.state} — {addr.pinCode}</p>
                        <p className="text-slate-500 font-semibold pt-1">Mobile: {addr.mobileNumber}</p>
                      </div>
                    </div>
                  </label>
                ))}

                {addresses.length > 0 && step === 2 && (
                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-3 bg-slate-900 hover:bg-brand-600 text-white font-extrabold text-xs rounded-2xl transition-colors shadow-md mt-4"
                  >
                    Deliver to This Address
                  </button>
                )}
              </div>
            )}

            {/* Add Address Form */}
            {showAddAddressForm && (
              <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={newAddress.mobileNumber}
                      onChange={(e) => setNewAddress({ ...newAddress, mobileNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Street Address / House No.</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat 402, Royal Residency, MG Road"
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddress.pinCode}
                      onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddressForm(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-brand-600"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* STEP 3: ORDER REVIEW */}
          {step >= 3 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-slate-950 text-base">
                  <ShoppingBag className="w-5 h-5 text-brand-600" />
                  <h2>Review Ordered Items ({cartItems.length})</h2>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Edit Address
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 max-w-sm truncate">{item.product.name}</h4>
                        <span className="text-slate-500">Qty: {item.quantity} • {item.selectedColour || 'Standard'}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-950">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {step === 3 && (
                <button
                  onClick={() => setStep(4)}
                  className="w-full py-3 bg-slate-900 hover:bg-brand-600 text-white font-extrabold text-xs rounded-2xl transition-colors shadow-md mt-4"
                >
                  Proceed to Payment
                </button>
              )}
            </div>
          )}

          {/* STEP 4: PAYMENT METHOD */}
          {step >= 4 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div className="flex items-center gap-2 font-black text-slate-950 text-base border-b border-slate-100 pb-3">
                <CreditCard className="w-5 h-5 text-brand-600" />
                <h2>Select Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* UPI */}
                <button
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'UPI' ? 'border-slate-950 bg-slate-50 ring-2 ring-slate-950/10' : 'border-slate-200'
                  }`}
                >
                  <QrCode className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">BHIM UPI / Google Pay</h4>
                    <span className="text-[10px] text-slate-500">Instant verification</span>
                  </div>
                </button>

                {/* Card */}
                <button
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'Card' ? 'border-slate-950 bg-slate-50 ring-2 ring-slate-950/10' : 'border-slate-200'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Credit / Debit Card</h4>
                    <span className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</span>
                  </div>
                </button>

                {/* Net Banking */}
                <button
                  onClick={() => setPaymentMethod('Net Banking')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'Net Banking' ? 'border-slate-950 bg-slate-50 ring-2 ring-slate-950/10' : 'border-slate-200'
                  }`}
                >
                  <Building2 className="w-6 h-6 text-purple-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Net Banking</h4>
                    <span className="text-[10px] text-slate-500">All Major Banks</span>
                  </div>
                </button>

                {/* Cash on Delivery */}
                <button
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'Cash on Delivery' ? 'border-slate-950 bg-slate-50 ring-2 ring-slate-950/10' : 'border-slate-200'
                  }`}
                >
                  <Banknote className="w-6 h-6 text-amber-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Cash on Delivery</h4>
                    <span className="text-[10px] text-slate-500">Pay cash upon arrival</span>
                  </div>
                </button>
              </div>

              {/* Dynamic Sub-Form */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Enter VPA / UPI ID</label>
                  <input
                    type="text"
                    placeholder="e.g. mobile@upi or username@okicici"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8910"
                      maxLength={16}
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="08/28"
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Confirm & Pay {formatCurrency(grandTotal)}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Summary Column */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm sticky top-24">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
            Payment Summary
          </h3>

          <div className="space-y-2.5 text-xs font-medium text-slate-600">
            <div className="flex justify-between">
              <span>Items Total ({cartItems.length})</span>
              <span className="text-slate-900 font-bold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discounts Applied</span>
              <span>-{formatCurrency(totalDiscount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>{deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(deliveryCharge)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Tax (5%)</span>
              <span className="text-slate-900 font-bold">{formatCurrency(tax)}</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between">
            <span className="font-black text-slate-950 text-sm">Total Payable</span>
            <span className="text-xl font-black text-slate-950">{formatCurrency(grandTotal)}</span>
          </div>

          {selectedAddress && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
              <span className="font-bold text-slate-900 block">Delivery Address:</span>
              <p className="text-slate-600 truncate">{selectedAddress.name}, {selectedAddress.addressLine}</p>
              <p className="text-slate-500">{selectedAddress.city} — {selectedAddress.pinCode}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
