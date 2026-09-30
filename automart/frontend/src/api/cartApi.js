import apiClient from './axios';
import { getStoredCart, setStoredCart } from '../utils/storage';

export const getCart = async () => {
  try {
    const res = await apiClient.get('/cart');
    if (res.data) return res.data;
  } catch (err) {
    return getStoredCart();
  }
};

export const addToCartApi = async (product, quantity = 1, selectedColour = null, selectedCompatibility = null) => {
  try {
    const res = await apiClient.post('/cart/items', {
      productId: product.id,
      quantity,
      colour: selectedColour,
      compatibility: selectedCompatibility
    });
    if (res.data) return res.data;
  } catch (err) {
    const currentCart = getStoredCart();
    const existingIndex = currentCart.findIndex(
      item => item.product.id === product.id && 
              item.selectedColour === selectedColour && 
              item.selectedCompatibility === selectedCompatibility
    );

    let updated;
    if (existingIndex > -1) {
      updated = [...currentCart];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [
        ...currentCart,
        {
          id: Date.now(),
          product,
          quantity,
          selectedColour: selectedColour || (product.colours && product.colours[0]),
          selectedCompatibility: selectedCompatibility || (product.compatibility && product.compatibility[0])
        }
      ];
    }
    setStoredCart(updated);
    return updated;
  }
};

export const updateCartItemQuantityApi = async (cartItemId, quantity) => {
  try {
    const res = await apiClient.put(`/cart/items/${cartItemId}`, { quantity });
    if (res.data) return res.data;
  } catch (err) {
    let currentCart = getStoredCart();
    if (quantity <= 0) {
      currentCart = currentCart.filter(item => item.id !== cartItemId);
    } else {
      currentCart = currentCart.map(item => item.id === cartItemId ? { ...item, quantity } : item);
    }
    setStoredCart(currentCart);
    return currentCart;
  }
};

export const removeCartItemApi = async (cartItemId) => {
  try {
    await apiClient.delete(`/cart/items/${cartItemId}`);
  } catch (err) {
    // ignore
  } finally {
    const currentCart = getStoredCart().filter(item => item.id !== cartItemId);
    setStoredCart(currentCart);
    return currentCart;
  }
};

export const clearCartApi = async () => {
  try {
    await apiClient.delete('/cart/clear');
  } catch (err) {
    // ignore
  } finally {
    setStoredCart([]);
    return [];
  }
};
