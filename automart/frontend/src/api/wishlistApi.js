import apiClient from './axios';
import { getStoredWishlist, setStoredWishlist } from '../utils/storage';

export const getWishlistApi = async () => {
  try {
    const res = await apiClient.get('/wishlist');
    if (res.data) return res.data;
  } catch (err) {
    return getStoredWishlist();
  }
};

export const toggleWishlistApi = async (product) => {
  try {
    const res = await apiClient.post('/wishlist/items', { productId: product.id });
    if (res.data) return res.data;
  } catch (err) {
    let current = getStoredWishlist();
    const exists = current.some(item => item.id === product.id);
    if (exists) {
      current = current.filter(item => item.id !== product.id);
    } else {
      current = [...current, product];
    }
    setStoredWishlist(current);
    return current;
  }
};

export const removeFromWishlistApi = async (productId) => {
  try {
    await apiClient.delete(`/wishlist/items/${productId}`);
  } catch (err) {
    // ignore
  } finally {
    const current = getStoredWishlist().filter(item => item.id !== productId);
    setStoredWishlist(current);
    return current;
  }
};
