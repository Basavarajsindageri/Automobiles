import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as orderApi from '../../api/orderApi';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../hooks/useToast';
import { Package, MapPin, Truck, CheckCircle2, Clock, Printer, XCircle, ArrowLeft } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getOrderByIdApi(id);
      setOrder(data);
    } catch (err) {
      // order not found
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await orderApi.cancelOrderApi(order.id || order.orderNumber);
      addToast('Order has been cancelled', 'info');
      loadOrderDetails();
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
        <h3 className="font-bold text-slate-900">Order Not Found</h3>
        <Link to="/account/orders" className="text-xs font-bold text-brand-600">Back to Orders</Link>
      </div>
    );
  }

  const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/account/orders" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </Link>
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">Order Details</span>
            <h2 className="text-xl font-black text-slate-950">#{order.orderNumber}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintInvoice}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
          {['Placed', 'Processing'].includes(order.orderStatus) && (
            <button
              onClick={handleCancelOrder}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors border border-rose-200"
            >
              <XCircle className="w-4 h-4" /> Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Order Status Tracker */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Placed on {formattedDate}</span>
          <span className="font-bold text-brand-600">Status: {order.orderStatus}</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-extrabold uppercase">
          <div className="space-y-1 text-emerald-600">
            <div className="h-2 rounded-full bg-emerald-500"></div>
            <span>1. Placed</span>
          </div>
          <div className={`space-y-1 ${['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) ? 'text-emerald-600' : 'text-slate-400'}`}>
            <div className={`h-2 rounded-full ${['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
            <span>2. Packed</span>
          </div>
          <div className={`space-y-1 ${['Shipped', 'Delivered'].includes(order.orderStatus) ? 'text-emerald-600' : 'text-slate-400'}`}>
            <div className={`h-2 rounded-full ${['Shipped', 'Delivered'].includes(order.orderStatus) ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
            <span>3. Shipped</span>
          </div>
          <div className={`space-y-1 ${order.orderStatus === 'Delivered' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <div className={`h-2 rounded-full ${order.orderStatus === 'Delivered' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
            <span>4. Delivered</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="space-y-3">
        <h3 className="font-black text-slate-900 text-sm">Ordered Products</h3>
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden p-4">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-14 h-14 object-cover rounded-xl bg-slate-100"
                />
                <div>
                  <h4 className="font-bold text-slate-900 max-w-sm truncate">{item.product.name}</h4>
                  <span className="text-slate-500">
                    {item.product.brand} • Qty: {item.quantity} {item.selectedColour ? `(${item.selectedColour})` : ''}
                  </span>
                </div>
              </div>
              <span className="font-black text-slate-950">{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Address & Payment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <span className="font-extrabold text-slate-900 text-sm block">Shipping Address</span>
          <p className="font-bold text-slate-800">{order.shippingAddress.name}</p>
          <p className="text-slate-600">{order.shippingAddress.addressLine}</p>
          <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pinCode}</p>
          <p className="text-slate-500 font-semibold pt-1">Phone: {order.shippingAddress.mobileNumber}</p>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 font-medium text-slate-600">
          <span className="font-extrabold text-slate-900 text-sm block mb-2">Payment Details</span>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span>-{formatCurrency(order.discount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>{order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-slate-950 text-sm">
            <span>Grand Total</span>
            <span>{formatCurrency(order.grandTotal)}</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Method: <strong className="text-slate-900">{order.paymentMethod}</strong> ({order.paymentStatus})
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
