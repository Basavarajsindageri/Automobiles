import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/currency';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  X 
} from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    totalDiscount,
    deliveryCharge,
    tax,
    grandTotal,
    updateQuantity,
    removeFromCart,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    applyCoupon(couponInput);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-slate-500">
            Looks like you haven't added any automobile accessories to your cart yet.
          </p>
          <Link
            to="/category/cars"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-extrabold text-xs rounded-xl hover:bg-brand-600 transition-colors shadow-md"
          >
            <span>Start Shopping Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      <h1 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-brand-600" /> Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm"
              >
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <Link to={`/product/${product.slug}`} className="flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-slate-100 border border-slate-100"
                    />
                  </Link>

                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="block text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors truncate"
                    >
                      {product.name}
                    </Link>

                    {/* Variant & Compatibility tag */}
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 pt-0.5">
                      {item.selectedColour && (
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md font-semibold text-slate-700">
                          Color: {item.selectedColour}
                        </span>
                      )}
                      {item.selectedCompatibility && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold border border-blue-100">
                          Fit: {item.selectedCompatibility}
                        </span>
                      )}
                    </div>

                    <div className="text-xs pt-1">
                      <span className="font-extrabold text-slate-950 text-sm">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-slate-400 line-through ml-2 font-medium">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-black text-slate-950 min-w-[70px] text-right">
                    {formatCurrency(product.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Order Summary Column */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm sticky top-24">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
            Order Summary
          </h3>

          {/* Coupon Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Have a Coupon Code?</label>
            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">{appliedCoupon.code}</span>
                  <span>({appliedCoupon.discountPercent}% Off)</span>
                </div>
                <button onClick={removeCoupon} className="text-emerald-700 hover:text-emerald-950">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code (e.g. AUTOMART10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Detailed Price Calculation */}
          <div className="space-y-3 text-xs font-medium text-slate-600 border-t border-b border-slate-100 py-4">
            <div className="flex justify-between">
              <span>Subtotal Price</span>
              <span className="text-slate-900 font-bold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Total Discount</span>
              <span>-{formatCurrency(totalDiscount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery Fee</span>
              <span>{deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(deliveryCharge)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (GST 5%)</span>
              <span className="text-slate-900 font-bold">{formatCurrency(tax)}</span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex items-baseline justify-between pt-1">
            <span className="font-black text-slate-950 text-base">Grand Total</span>
            <span className="text-2xl font-black text-slate-950">{formatCurrency(grandTotal)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-slate-400 text-[11px] text-center space-y-1">
            <p className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
