import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'discount', label: 'Highest Discount' }
];

const SortDropdown = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:flex items-center gap-1">
        <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer shadow-sm"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
