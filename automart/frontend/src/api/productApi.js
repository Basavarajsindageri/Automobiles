import apiClient from './axios';
import { PRODUCTS } from '../data/products';

export const getProducts = async (params = {}) => {
  try {
    const res = await apiClient.get('/products', { params });
    if (res.data) return res.data;
  } catch (err) {
    let filtered = [...PRODUCTS];

    if (params.category) {
      const cat = params.category.toLowerCase();
      filtered = filtered.filter(p => 
        (p.category && p.category.slug && p.category.slug.toLowerCase() === cat) ||
        (p.category && p.category.name && p.category.name.toLowerCase() === cat) ||
        (typeof p.category === 'string' && p.category.toLowerCase() === cat) ||
        (p.vehicleType && p.vehicleType.toLowerCase() === cat)
      );
    }

    if (params.subcategory) {
      const sub = params.subcategory.toLowerCase();
      filtered = filtered.filter(p => 
        (p.subcategory && p.subcategory.slug && p.subcategory.slug.toLowerCase() === sub) ||
        (p.subcategory && p.subcategory.name && p.subcategory.name.toLowerCase() === sub) ||
        (typeof p.subcategory === 'string' && p.subcategory.toLowerCase() === sub)
      );
    }

    if (params.query || params.q) {
      const q = (params.query || params.q).trim().toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (params.brand && params.brand.length > 0) {
      const brands = Array.isArray(params.brand) ? params.brand : [params.brand];
      filtered = filtered.filter(p => brands.includes(p.brand));
    }

    if (params.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(params.minPrice));
    }

    if (params.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(params.maxPrice));
    }

    if (params.minRating) {
      filtered = filtered.filter(p => p.rating >= parseFloat(params.minRating));
    }

    if (params.inStock === 'true' || params.inStock === true) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    if (params.minDiscount) {
      filtered = filtered.filter(p => p.discountPercentage >= parseFloat(params.minDiscount));
    }

    if (params.sort) {
      switch (params.sort) {
        case 'price-low-high':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filtered.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
          break;
        case 'discount':
          filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
          break;
        default:
          break;
      }
    }

    return {
      content: filtered,
      totalElements: filtered.length,
      totalPages: 1,
      page: 0
    };
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const res = await apiClient.get(`/products/slug/${slug}`);
    if (res.data) return res.data;
  } catch (err) {
    const product = PRODUCTS.find(p => p.slug === slug || p.id === parseInt(slug));
    if (product) return product;
    throw new Error('Product not found');
  }
};

export const getFeaturedProducts = async () => {
  try {
    const res = await apiClient.get('/products/featured');
    if (res.data && res.data.length > 0) return res.data;
  } catch (err) {
    // fallback
  }
  return PRODUCTS.filter(p => p.featured).slice(0, 8);
};

export const getTrendingProducts = async () => {
  try {
    const res = await apiClient.get('/products/trending');
    if (res.data && res.data.length > 0) return res.data;
  } catch (err) {
    // fallback
  }
  return PRODUCTS.filter(p => p.trending).slice(0, 8);
};

export const getBestDeals = async () => {
  try {
    const res = await apiClient.get('/products/best-deals');
    if (res.data && res.data.length > 0) return res.data;
  } catch (err) {
    // fallback
  }
  return PRODUCTS.filter(p => p.discountPercentage >= 30).slice(0, 8);
};

export const getNewArrivals = async () => {
  try {
    const res = await apiClient.get('/products/new-arrivals');
    if (res.data && res.data.length > 0) return res.data;
  } catch (err) {
    // fallback
  }
  return PRODUCTS.filter(p => p.newArrival).slice(0, 8);
};

export const createProduct = async (data) => {
  const res = await apiClient.post('/products', data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await apiClient.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await apiClient.delete(`/products/${id}`);
  return res.data;
};
