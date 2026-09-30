import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import SortDropdown from '../components/product/SortDropdown';
import * as productApi from '../api/productApi';
import { Search, SlidersHorizontal, PackageX, Sparkles } from 'lucide-react';

const POPULAR_SEARCH_CHIPS = ['Leather Seat Cover', 'Dash Cam', 'Phone Mount', 'Chain Lube', 'Helmet Lock', '7D Mats', 'LED Bulbs'];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    brands: [],
    minPrice: '',
    maxPrice: '',
    minRating: null,
    inStock: false,
    minDiscount: null,
    compatibility: ''
  });

  useEffect(() => {
    executeSearch();
  }, [query, sortBy, filters]);

  const executeSearch = async () => {
    setLoading(true);
    try {
      const res = await productApi.getProducts({
        q: query,
        sort: sortBy,
        brand: filters.brands,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        inStock: filters.inStock,
        minDiscount: filters.minDiscount,
        compatibility: filters.compatibility
      });
      setProducts(res.content || []);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      brands: [],
      minPrice: '',
      maxPrice: '',
      minRating: null,
      inStock: false,
      minDiscount: null,
      compatibility: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Search Results' }, { label: `"${query}"` }]} />

      {/* Search Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block">
              Search Results
            </span>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <Search className="w-6 h-6 text-brand-500" /> Results for "{query}"
            </h1>
          </div>
          <span className="px-4 py-2 bg-slate-800 rounded-2xl text-xs font-extrabold text-slate-200 border border-slate-700">
            {products.length} Products Found
          </span>
        </div>

        {/* Popular Keyword Chips */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Popular:
          </span>
          {POPULAR_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setSearchParams({ q: chip })}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full font-medium transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar & Sort */}
      <div className="flex items-center justify-between gap-4 pt-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filter Options
        </button>

        <div className="ml-auto">
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Search Grid & Sidebar */}
      <div className="flex gap-8 items-start">
        <FilterSidebar
          availableBrands={['AutoPro', 'GripMax', 'RoadGuard', 'VoltDrive', 'CleanRide', 'FloorGuard', 'LuminaDrive', 'ArmorShield', 'PackPro', 'ScootPro', 'LockShield', 'MotoArmor']}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
        />

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-4 animate-pulse">
                  <div className="bg-slate-200 aspect-[4/3] rounded-xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 max-w-md mx-auto my-12">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Matching Search Results</h3>
              <p className="text-xs text-slate-500">
                We couldn't find any accessories matching "{query}". Try checking your spelling or searching for broad terms like "cover", "led", or "holder".
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-brand-600 transition-colors"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
