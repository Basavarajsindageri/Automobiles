import React, { useState } from 'react';
import { Filter, X, RotateCcw, Check, Star } from 'lucide-react';

const FilterSidebar = ({
  availableBrands = [],
  subcategoriesList = [],
  filters = {},
  onFilterChange,
  onResetFilters,
  isOpen = false,
  onClose
}) => {
  const [compatSearch, setCompatSearch] = useState('');

  const handleBrandChange = (brandName) => {
    const currentBrands = filters.brands || [];
    let updated;
    if (currentBrands.includes(brandName)) {
      updated = currentBrands.filter(b => b !== brandName);
    } else {
      updated = [...currentBrands, brandName];
    }
    onFilterChange('brands', updated);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 p-5 transform transition-transform duration-300 overflow-y-auto lg:static lg:w-64 lg:transform-none lg:z-0 lg:border-r-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Filter className="w-5 h-5 text-brand-600" />
          <span>Filter Products</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-slate-100 space-y-6 pt-4 text-xs font-medium text-slate-700">
        {/* Availability */}
        <div className="pt-2">
          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="font-bold text-slate-900">In Stock Only</span>
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => onFilterChange('inStock', e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
            />
          </label>
        </div>

        {/* Subcategories */}
        {subcategoriesList && subcategoriesList.length > 0 && (
          <div className="pt-2">
            <h4 className="font-bold text-slate-900 mb-3 text-sm">Subcategories</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                <input
                  type="radio"
                  name="subcategory-filter"
                  checked={!filters.subcategory}
                  onChange={() => onFilterChange('subcategory', '')}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
                />
                <span>All Subcategories</span>
              </label>
              {subcategoriesList.map((sub) => (
                <label key={sub.id || sub.slug} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="radio"
                    name="subcategory-filter"
                    checked={filters.subcategory === sub.slug}
                    onChange={() => onFilterChange('subcategory', sub.slug)}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
                  />
                  <span>{sub.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        <div className="pt-4">
          <h4 className="font-bold text-slate-900 mb-3 text-sm">Brands</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {availableBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={(filters.brands || []).includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="pt-4">
          <h4 className="font-bold text-slate-900 mb-3 text-sm">Price Range (₹)</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Max Price</label>
              <input
                type="number"
                placeholder="10000"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Minimum Rating */}
        <div className="pt-4">
          <h4 className="font-bold text-slate-900 mb-3 text-sm">Customer Rating</h4>
          <div className="space-y-1.5">
            {[4, 3, 2].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="radio"
                  name="rating-filter"
                  checked={filters.minRating === rating}
                  onChange={() => onFilterChange('minRating', rating)}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
                />
                <span className="flex items-center gap-1 text-slate-800">
                  {rating} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" /> & above
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Minimum Discount */}
        <div className="pt-4">
          <h4 className="font-bold text-slate-900 mb-3 text-sm">Discount</h4>
          <div className="space-y-1.5">
            {[10, 30, 45].map((discount) => (
              <label key={discount} className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="radio"
                  name="discount-filter"
                  checked={filters.minDiscount === discount}
                  onChange={() => onFilterChange('minDiscount', discount)}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
                />
                <span>{discount}% or more</span>
              </label>
            ))}
          </div>
        </div>

        {/* Compatibility search */}
        <div className="pt-4">
          <h4 className="font-bold text-slate-900 mb-2 text-sm">Vehicle Compatibility</h4>
          <input
            type="text"
            placeholder="e.g. Honda City, Activa..."
            value={filters.compatibility || ''}
            onChange={(e) => onFilterChange('compatibility', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
