/**
 * Formats a number to Indian Rupees (INR) currency format
 * @param {number} amount 
 * @returns {string} Formatted currency string e.g. ₹4,999
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
