const STORAGE_KEYS = {
  TOKEN: 'automart_token',
  USER: 'automart_user',
  CART: 'automart_cart',
  WISHLIST: 'automart_wishlist',
  RECENT_SEARCHES: 'automart_recent_searches',
  ADDRESSES: 'automart_addresses',
  ORDERS: 'automart_orders'
};

export const getStoredToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);
export const setStoredToken = (token) => localStorage.setItem(STORAGE_KEYS.TOKEN, token);
export const removeStoredToken = () => localStorage.removeItem(STORAGE_KEYS.TOKEN);

export const getStoredUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem(STORAGE_KEYS.USER);

export const getStoredCart = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CART);
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};
export const setStoredCart = (cartItems) => localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));

export const getStoredWishlist = () => {
  const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};
export const setStoredWishlist = (items) => localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(items));

export const getRecentSearches = () => {
  const data = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};
export const addRecentSearch = (query) => {
  if (!query || !query.trim()) return;
  const cleaned = query.trim();
  let searches = getRecentSearches();
  searches = searches.filter(s => s.toLowerCase() !== cleaned.toLowerCase());
  searches.unshift(cleaned);
  if (searches.length > 5) searches = searches.slice(0, 5);
  localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(searches));
};

export const getStoredAddresses = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
  try {
    return data ? JSON.parse(data) : [
      {
        id: 1,
        name: 'Rahul Sharma',
        mobileNumber: '9876543210',
        addressLine: 'Flat 402, Royal Residency, MG Road',
        landmark: 'Near Metro Station',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560001',
        country: 'India',
        addressType: 'Home',
        isDefault: true
      }
    ];
  } catch (e) {
    return [];
  }
};
export const setStoredAddresses = (addresses) => localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));

export const getStoredOrders = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};
export const setStoredOrders = (orders) => localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
