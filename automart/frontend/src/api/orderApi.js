import apiClient from './axios';
import { getStoredOrders, setStoredOrders, setStoredCart } from '../utils/storage';

export const createOrderApi = async (orderPayload) => {
  try {
    const res = await apiClient.post('/orders', orderPayload);
    if (res.data) return res.data;
  } catch (err) {
    const orders = getStoredOrders();
    const orderNumber = 'AM-' + Math.floor(100000 + Math.random() * 900000);
    
    // Estimate delivery date 3-5 days out
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);

    const newOrder = {
      id: Date.now(),
      orderNumber,
      orderDate: new Date().toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString(),
      orderStatus: 'Placed',
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: orderPayload.paymentMethod === 'Cash on Delivery' ? 'Pending (COD)' : 'Paid',
      shippingAddress: orderPayload.address,
      items: orderPayload.items,
      subtotal: orderPayload.subtotal,
      discount: orderPayload.discount,
      deliveryCharge: orderPayload.deliveryCharge,
      tax: orderPayload.tax,
      grandTotal: orderPayload.grandTotal
    };

    const updated = [newOrder, ...orders];
    setStoredOrders(updated);
    setStoredCart([]);
    return newOrder;
  }
};

export const getOrdersApi = async () => {
  try {
    const res = await apiClient.get('/orders');
    if (res.data) return res.data;
  } catch (err) {
    return getStoredOrders();
  }
};

export const getOrderByIdApi = async (orderId) => {
  try {
    const res = await apiClient.get(`/orders/${orderId}`);
    if (res.data) return res.data;
  } catch (err) {
    const orders = getStoredOrders();
    const found = orders.find(o => o.id === parseInt(orderId) || o.orderNumber === orderId);
    if (found) return found;
    throw 'Order not found';
  }
};

export const cancelOrderApi = async (orderId) => {
  try {
    const res = await apiClient.put(`/orders/${orderId}/cancel`);
    if (res.data) return res.data;
  } catch (err) {
    const orders = getStoredOrders();
    const updated = orders.map(o => {
      if (o.id === parseInt(orderId) || o.orderNumber === orderId) {
        return { ...o, orderStatus: 'Cancelled' };
      }
      return o;
    });
    setStoredOrders(updated);
    return updated;
  }
};
