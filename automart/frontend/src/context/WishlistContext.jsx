import React, { createContext, useState, useEffect, useContext } from 'react';
import * as wishlistApi from '../api/wishlistApi';
import { useToast } from '../hooks/useToast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await wishlistApi.getWishlistApi();
      setWishlistItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = async (product) => {
    try {
      const exists = isInWishlist(product.id);
      const updated = await wishlistApi.toggleWishlistApi(product);
      if (Array.isArray(updated)) {
        setWishlistItems(updated);
      } else {
        loadWishlist();
      }

      if (exists) {
        addToast(`Removed "${product.name}" from wishlist`, 'info');
      } else {
        addToast(`Saved "${product.name}" to wishlist!`, 'success');
      }
    } catch (err) {
      addToast('Failed to update wishlist', 'error');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const updated = await wishlistApi.removeFromWishlistApi(productId);
      if (Array.isArray(updated)) {
        setWishlistItems(updated);
      } else {
        loadWishlist();
      }
      addToast('Product removed from wishlist', 'info');
    } catch (err) {
      addToast('Failed to remove item', 'error');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
