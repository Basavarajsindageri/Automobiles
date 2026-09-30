import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import { CheckCircle2, Package, MapPin, Calendar, CreditCard, ArrowRight, Truck } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/account/orders" replace />;
  }

  const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const estimatedDeliveryDate = new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest block">
            Order Confirmed!
          </span>
          <h1 className="text-3xl font-black text-slate-950">Thank You for Your Order</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your order <strong className="text-slate-900 font-extrabold">#{order.orderNumber}</strong> has been received and is currently being packed for express courier shipment.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-md">
          <Truck className="w-4 h-4 text-brand-400" />
          <span>Estimated Delivery: {estimatedDeliveryDate}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ordered Items */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 font-black text-slate-950 text-sm border-b border-slate-100 pb-3">
            <Package className="w-4 h-4 text-brand-600" />
            <h3>Items in this Order ({order.items.length})</h3>
          </div>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 max-w-[180px] truncate">{item.product.name}</h4>
                    <span className="text-slate-400">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-extrabold text-slate-950">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 font-black text-slate-950 text-sm border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-brand-600" />
            <h3>Delivery & Payment Info</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">Shipping Address:</span>
              <p className="font-bold text-slate-900">{order.shippingAddress.name}</p>
              <p className="text-slate-600">{order.shippingAddress.addressLine}</p>
              <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-slate-400 font-semibold block">Payment Method:</span>
                <span className="font-bold text-slate-900">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Status:</span>
                <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-black text-slate-950 text-sm">Total Paid</span>
              <span className="text-xl font-black text-slate-950">{formatCurrency(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to={`/account/orders/${order.id}`}
          className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md text-center"
        >
          View Full Order Details
        </Link>
        <Link
          to="/category/cars"
          className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md text-center flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
