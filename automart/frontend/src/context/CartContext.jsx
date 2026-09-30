import React, { createContext, useState, useEffect, useContext } from 'react';
import * as cartApi from '../api/cartApi';
import { useToast } from '../hooks/useToast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartApi.getCart();
      setCartItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, colour = null, compatibility = null) => {
    try {
      const updated = await cartApi.addToCartApi(product, quantity, colour, compatibility);
      if (Array.isArray(updated)) {
        setCartItems(updated);
      } else {
        loadCart();
      }
      addToast(`Added "${product.name}" to your cart!`, 'success');
    } catch (err) {
      addToast('Failed to add product to cart', 'error');
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const updated = await cartApi.updateCartItemQuantityApi(cartItemId, quantity);
      if (Array.isArray(updated)) {
        setCartItems(updated);
      } else {
        loadCart();
      }
    } catch (err) {
      addToast('Failed to update item quantity', 'error');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const updated = await cartApi.removeCartItemApi(cartItemId);
      if (Array.isArray(updated)) {
        setCartItems(updated);
      } else {
        loadCart();
      }
      addToast('Item removed from cart', 'info');
    } catch (err) {
      addToast('Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCartApi();
      setCartItems([]);
      setAppliedCoupon(null);
    } catch (err) {
      // ignore
    }
  };

  const applyCoupon = (code) => {
    if (!code || !code.trim()) {
      addToast('Please enter a valid coupon code', 'error');
      return false;
    }
    const clean = code.trim().toUpperCase();
    if (clean === 'AUTOMART10' || clean === 'DRIVE10') {
      setAppliedCoupon({ code: clean, discountPercent: 10 });
      addToast('Coupon AUTOMART10 applied! 10% Extra Discount', 'success');
      return true;
    } else if (clean === 'FIRST15') {
      setAppliedCoupon({ code: clean, discountPercent: 15 });
      addToast('Coupon FIRST15 applied! 15% Discount on order', 'success');
      return true;
    } else {
      addToast('Invalid coupon code. Try "AUTOMART10" or "FIRST15"', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    addToast('Coupon removed', 'info');
  };

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.product ? item.product.originalPrice : 0;
    return acc + (itemPrice * item.quantity);
  }, 0);

  const productDiscounts = cartItems.reduce((acc, item) => {
    if (!item.product) return acc;
    const itemDiscount = (item.product.originalPrice - item.product.price) * item.quantity;
    return acc + itemDiscount;
  }, 0);

  const couponDiscount = appliedCoupon
    ? Math.round(((subtotal - productDiscounts) * appliedCoupon.discountPercent) / 100)
    : 0;

  const totalDiscount = productDiscounts + couponDiscount;
  const netProductTotal = subtotal - totalDiscount;

  const deliveryCharge = netProductTotal > 999 || netProductTotal === 0 ? 0 : 99;
  const tax = Math.round(netProductTotal * 0.05); // 5% GST
  const grandTotal = netProductTotal + deliveryCharge + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        totalItems,
        subtotal,
        totalDiscount,
        couponDiscount,
        deliveryCharge,
        tax,
        grandTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        couponCode,
        setCouponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
