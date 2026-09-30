import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import SortDropdown from '../components/product/SortDropdown';
import { CATEGORIES } from '../data/categories';
import * as productApi from '../api/productApi';
import { getCategoryBySlug, getSubcategories } from '../api/categoryApi';
import { Filter, SlidersHorizontal, PackageX } from 'lucide-react';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const subcategoryParam = searchParams.get('subcategory') || '';

  const [currentCategory, setCurrentCategory] = useState({
    name: categorySlug ? categorySlug.toUpperCase() : 'Products',
    description: 'Browse top quality automobile products, accessories, and replacement parts.',
    slug: categorySlug
  });
  const [subcategoriesList, setSubcategoriesList] = useState([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    subcategory: subcategoryParam,
    brands: [],
    minPrice: '',
    maxPrice: '',
    minRating: null,
    inStock: false,
    minDiscount: null,
    compatibility: ''
  });

  // Sync url param subcategory to filter state
  useEffect(() => {
    setFilters(prev => ({ ...prev, subcategory: subcategoryParam }));
  }, [subcategoryParam]);

  // Load Category Details & Subcategories
  useEffect(() => {
    const fetchCategoryAndSubcats = async () => {
      const cat = await getCategoryBySlug(categorySlug);
      if (cat) setCurrentCategory(cat);

      const subs = await getSubcategories(null, categorySlug);
      setSubcategoriesList(subs || []);
    };
    fetchCategoryAndSubcats();
  }, [categorySlug]);

  useEffect(() => {
    loadCategoryProducts();
  }, [categorySlug, sortBy, filters]);

  const loadCategoryProducts = async () => {
    setLoading(true);
    try {
      const res = await productApi.getProducts({
        category: categorySlug,
        subcategory: filters.subcategory,
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
    if (key === 'subcategory') {
      if (value) {
        setSearchParams({ subcategory: value });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleResetFilters = () => {
    setFilters({
      subcategory: '',
      brands: [],
      minPrice: '',
      maxPrice: '',
      minRating: null,
      inStock: false,
      minDiscount: null,
      compatibility: ''
    });
    setSearchParams({});
  };

  const availableBrands = useMemo(() => {
    const brandSet = new Set();
    products.forEach(p => p.brand && brandSet.add(p.brand));
    return Array.from(brandSet);
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Categories' },
          { label: currentCategory.name, url: `/category/${categorySlug}` },
          ...(filters.subcategory ? [{ label: filters.subcategory.toUpperCase() }] : [])
        ]}
      />

      {/* Category Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
        {currentCategory.imageUrl && (
          <img 
            src={currentCategory.imageUrl} 
            alt={currentCategory.name}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block">
            Category Showcase
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">{currentCategory.name}</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
            {currentCategory.description}
          </p>
        </div>
      </div>

      {/* Toolbar & Controls */}
      <div className="flex items-center justify-between gap-4 pt-2 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <span className="text-xs font-bold text-slate-600">
            Showing <span className="text-slate-950 font-black">{products.length}</span> Products
          </span>
        </div>

        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="flex gap-8 items-start">
        {/* Filter Sidebar */}
        <FilterSidebar
          availableBrands={availableBrands.length > 0 ? availableBrands : ['Honda', 'Hyundai', 'Mahindra', 'Tata Motors', 'Maruti Suzuki', 'BMW', 'Bosch', 'Brembo', 'Monroe', 'Steelbird', 'AutoStyle', 'Sony', '3M']}
          subcategoriesList={subcategoriesList}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
        />

        {/* Product Grid Area */}
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
              <h3 className="text-lg font-bold text-slate-900">No Products Found</h3>
              <p className="text-xs text-slate-500">
                No items match your selected filter criteria. Try changing or clearing your subcategory and brand filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-brand-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id || product.productId} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
