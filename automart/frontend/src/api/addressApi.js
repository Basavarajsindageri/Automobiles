import apiClient from './axios';
import { getStoredAddresses, setStoredAddresses } from '../utils/storage';

export const getAddressesApi = async () => {
  try {
    const res = await apiClient.get('/users/addresses');
    if (res.data) return res.data;
  } catch (err) {
    return getStoredAddresses();
  }
};

export const createAddressApi = async (addressData) => {
  try {
    const res = await apiClient.post('/users/addresses', addressData);
    if (res.data) return res.data;
  } catch (err) {
    const current = getStoredAddresses();
    const newAddress = {
      id: Date.now(),
      ...addressData,
      country: addressData.country || 'India',
      isDefault: addressData.isDefault || current.length === 0
    };
    if (newAddress.isDefault) {
      current.forEach(a => a.isDefault = false);
    }
    const updated = [...current, newAddress];
    setStoredAddresses(updated);
    return newAddress;
  }
};

export const updateAddressApi = async (addressId, addressData) => {
  try {
    const res = await apiClient.put(`/users/addresses/${addressId}`, addressData);
    if (res.data) return res.data;
  } catch (err) {
    let current = getStoredAddresses();
    if (addressData.isDefault) {
      current.forEach(a => a.isDefault = false);
    }
    current = current.map(a => a.id === addressId ? { ...a, ...addressData } : a);
    setStoredAddresses(current);
    return current;
  }
};

export const deleteAddressApi = async (addressId) => {
  try {
    await apiClient.delete(`/users/addresses/${addressId}`);
  } catch (err) {
    // ignore
  } finally {
    const current = getStoredAddresses().filter(a => a.id !== addressId);
    setStoredAddresses(current);
    return current;
  }
};
