import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Bike, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Headset, 
  Flame, 
  Sparkles, 
  Percent, 
  ChevronRight,
  Zap,
  Award,
  CheckCircle2
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { CATEGORIES } from '../data/categories';
import * as productApi from '../api/productApi';
import { getCategories } from '../api/categoryApi';

const HomePage = () => {
  const [categories, setCategories] = useState(CATEGORIES);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [cats, featured, trending, deals, arrivals] = await Promise.all([
          getCategories(),
          productApi.getFeaturedProducts(),
          productApi.getTrendingProducts(),
          productApi.getBestDeals(),
          productApi.getNewArrivals()
        ]);
        if (cats && cats.length > 0) setCategories(cats);
        setFeaturedProducts(featured || []);
        setTrendingProducts(trending || []);
        setBestDeals(deals || []);
        setNewArrivals(arrivals || []);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 lg:py-24">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-brand-500 animate-pulse" />
              Automobile Accessories Superstore
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Drive Better. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-amber-400">
                Ride Smarter.
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Explore 100% genuine car seat covers, 4K dash cams, LED fog lights, motorcycle riding gear, and helmet locks crafted for peak performance and style.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/category/cars"
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 group"
              >
                <span>Shop Car Accessories</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/category/motorcycles"
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-extrabold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Riding Gear</span>
              </Link>
            </div>

            {/* Micro stats */}
            <div className="pt-8 border-t border-slate-900 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-slate-400 text-xs">
              <div>
                <span className="block text-xl font-black text-white">60+</span>
                <span>Premium Parts</span>
              </div>
              <div>
                <span className="block text-xl font-black text-white">100%</span>
                <span>Genuine Guarantee</span>
              </div>
              <div>
                <span className="block text-xl font-black text-white">4.8★</span>
                <span>Customer Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                alt="AutoMart Accessories Showcase"
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-brand-400 font-bold uppercase tracking-wider block text-[10px]">
                    Top Rated Item
                  </span>
                  <h4 className="font-bold text-white text-sm">Nappa Leather Seat Cover Set</h4>
                  <span className="text-slate-400">Save 37% Today • ₹4,999</span>
                </div>
                <Link
                  to="/product/royal-oak-premium-leather-seat-cover-set"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Vehicle Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
              Vehicle Specialization
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Shop By Vehicle Category</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Select your vehicle type to see custom fitted accessories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id || cat.slug}
              className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[16/11] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

              <div className="relative z-10 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-brand-600/90 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                    {cat.subcategories ? cat.subcategories.length : 4} Subcategories
                  </span>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div>
                  <Link to={`/category/${cat.slug}`}>
                    <h3 className="text-2xl font-black hover:text-brand-400 transition-colors">{cat.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-300 line-clamp-1 font-medium mt-0.5">{cat.description}</p>
                </div>

                {/* Subcategory Pills */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id || sub.slug}
                        to={`/category/${cat.slug}?subcategory=${sub.slug}`}
                        className="px-2.5 py-1 bg-white/20 hover:bg-brand-600 backdrop-blur-md rounded-lg text-[11px] font-semibold text-white transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
              Handpicked Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Featured Products</h2>
          </div>
          <Link
            to="/category/cars"
            className="text-xs font-bold text-slate-900 hover:text-brand-600 flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Deals Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-brand-600 text-white font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-1.5">
              <Percent className="w-4 h-4" /> Mega Savings Festival
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Up to <span className="text-brand-500">50% OFF</span> on Top Rated Accessories
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Upgrade your ride today with discount prices on dash cameras, LED fog lights, helmet security locks, and 7D floor mats.
            </p>
            <div className="pt-2">
              <Link
                to="/search?q=deal"
                className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs rounded-xl transition-all inline-flex items-center gap-2 shadow-lg"
              >
                <span>Explore Discount Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
                Popular Right Now
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Trending Products</h2>
            </div>
          </div>
          <Link
            to="/category/motorcycles"
            className="text-xs font-bold text-slate-900 hover:text-brand-600 flex items-center gap-1 transition-colors"
          >
            See More <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
                Fresh Inventory
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">New Arrivals</h2>
            </div>
          </div>
          <Link
            to="/category/scooters"
            className="text-xs font-bold text-slate-900 hover:text-brand-600 flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Why Choose AutoMart Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
            The AutoMart Promise
          </span>
          <h2 className="text-3xl font-black text-slate-950">Why Vehicle Owners Choose Us</h2>
          <p className="text-xs text-slate-500">
            We prioritize quality control, precision fitment, and customer satisfaction above all else.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Genuine Products</h4>
            <p className="text-slate-500 text-xs leading-relaxed">Direct sourcing from OEM certified automobile part makers.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Secure Payments</h4>
            <p className="text-slate-500 text-xs leading-relaxed">256-bit SSL encrypted UPI, Cards & Cash on Delivery.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Easy Returns</h4>
            <p className="text-slate-500 text-xs leading-relaxed">Hassle-free 7 day replacement if fitment is inaccurate.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Fast Delivery</h4>
            <p className="text-slate-500 text-xs leading-relaxed">Express courier shipping directly to your doorstep.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Headset className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Customer Support</h4>
            <p className="text-slate-500 text-xs leading-relaxed">Dedicated phone & email assistance for all order queries.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
