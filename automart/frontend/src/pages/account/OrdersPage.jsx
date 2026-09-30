import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as orderApi from '../../api/orderApi';
import { formatCurrency } from '../../utils/currency';
import { Package, ChevronRight, Truck, Clock, CheckCircle2, XCircle } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const list = await orderApi.getOrdersApi();
      setOrders(list || []);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'All') return true;
    return o.orderStatus.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-950">My Purchase History</h2>
          <p className="text-xs text-slate-500 font-medium">View status, track shipments, or download invoices.</p>
        </div>

        {/* Filter status tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {['All', 'Placed', 'Processing', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterStatus === status ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading purchase history...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">No Orders Found</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">You have not placed any automobile accessory orders yet.</p>
          <Link
            to="/category/cars"
            className="inline-block px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-brand-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-slate-400 font-semibold block">Order Number</span>
                    <strong className="text-slate-900 text-sm">#{order.orderNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Order Date</span>
                    <span className="text-slate-700 font-bold">{formattedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Total Amount</span>
                    <strong className="text-slate-950 font-black text-sm">{formatCurrency(order.grandTotal)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Status</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {order.items && order.items[0] && (
                      <img
                        src={order.items[0].product.images[0]}
                        alt={order.items[0].product.name}
                        className="w-12 h-12 object-cover rounded-xl bg-slate-100 border border-slate-100"
                      />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 max-w-sm">
                        {order.items && order.items[0] ? order.items[0].product.name : 'Automobile Accessories'}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {order.items.length > 1 ? `+ ${order.items.length - 1} other item(s)` : 'Single Item Package'}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/account/orders/${order.id}`}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
