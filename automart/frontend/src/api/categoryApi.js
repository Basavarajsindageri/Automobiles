import apiClient from './axios';
import { CATEGORIES } from '../data/categories';

export const getCategories = async () => {
  try {
    const res = await apiClient.get('/categories');
    if (res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.warn('Backend unavailable, using fallback categories', err);
  }
  return CATEGORIES;
};

export const getCategoryBySlug = async (slug) => {
  try {
    const res = await apiClient.get(`/categories/slug/${slug}`);
    if (res.data) return res.data;
  } catch (err) {
    const found = CATEGORIES.find(c => c.slug.toLowerCase() === slug.toLowerCase() || c.name.toLowerCase() === slug.toLowerCase());
    if (found) return found;
  }
  return CATEGORIES[0];
};

export const getSubcategories = async (categoryId = null, categorySlug = null) => {
  try {
    const params = {};
    if (categoryId) params.categoryId = categoryId;
    if (categorySlug) params.categorySlug = categorySlug;
    const res = await apiClient.get('/subcategories', { params });
    if (res.data) return res.data;
  } catch (err) {
    console.warn('Backend unavailable, using fallback subcategories', err);
  }

  let subs = [];
  CATEGORIES.forEach(cat => {
    if (cat.subcategories) {
      if ((!categoryId && !categorySlug) ||
          (categoryId && cat.id === categoryId) ||
          (categorySlug && cat.slug.toLowerCase() === categorySlug.toLowerCase())) {
        subs = [...subs, ...cat.subcategories.map(s => ({ ...s, category: cat }))];
      }
    }
  });
  return subs;
};

export const createCategory = async (data) => {
  const res = await apiClient.post('/categories', data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await apiClient.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await apiClient.delete(`/categories/${id}`);
  return res.data;
};

export const createSubcategory = async (data) => {
  const res = await apiClient.post('/subcategories', data);
  return res.data;
};

export const updateSubcategory = async (id, data) => {
  const res = await apiClient.put(`/subcategories/${id}`, data);
  return res.data;
};

export const deleteSubcategory = async (id) => {
  const res = await apiClient.delete(`/subcategories/${id}`);
  return res.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.imageUrl;
};
