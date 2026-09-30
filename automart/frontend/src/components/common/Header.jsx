import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Package, 
  ShieldCheck, 
  ChevronDown, 
  Car, 
  Bike, 
  Clock, 
  Trash2,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { getRecentSearches, addRecentSearch } from '../../utils/storage';
import { PRODUCTS } from '../../data/products';
import { getCategories } from '../../api/categoryApi';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('Bengaluru 560001');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');

  const [categoriesList, setCategoriesList] = useState([]);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);

  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await getCategories();
      setCategoriesList(cats || []);
    };
    fetchCats();
  }, []);

  // Sync recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Filter live search suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 5);
    setSuggestions(matches);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const cleanQuery = searchQuery.trim();
    addRecentSearch(cleanQuery);
    setRecentSearches(getRecentSearches());
    setShowSearchDropdown(false);
    navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

  const handleSelectSearch = (term) => {
    setSearchQuery(term);
    addRecentSearch(term);
    setRecentSearches(getRecentSearches());
    setShowSearchDropdown(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (pincodeInput.trim().length === 6) {
      setDeliveryLocation(`PIN ${pincodeInput.trim()}`);
      setIsLocationModalOpen(false);
      setPincodeInput('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
              100% Genuine Automobile Accessories & Parts
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Fast Express Delivery Across India</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <span className="text-brand-400 font-bold">Offer: Use code AUTOMART10 for 10% OFF</span>
            <span className="text-slate-600">|</span>
            <a href="tel:18001234567" className="hover:text-white transition-colors">
              Support: 1800-123-4567
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-950 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-md group-hover:bg-brand-600 transition-colors">
              <Car className="w-6 h-6 text-brand-500 group-hover:text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-950 block leading-none">
                Auto<span className="text-brand-600">Mart</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider block uppercase">
                Drive Better. Ride Smarter.
              </span>
            </div>
          </Link>

          {/* Delivery Location Selector */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden md:flex items-center gap-2 text-left p-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs"
          >
            <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Deliver to</span>
              <span className="font-bold text-slate-800 line-clamp-1">{deliveryLocation}</span>
            </div>
          </button>

          {/* Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-xl hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search by accessory name, vehicle (e.g. Honda City), category, brand..."
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 pl-4 pr-12 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.2 p-2 bg-slate-900 hover:bg-brand-600 text-white rounded-xl transition-colors shadow-sm"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                {/* Live Suggestions */}
                {suggestions.length > 0 && (
                  <div className="p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
                      Matching Products ({suggestions.length})
                    </span>
                    <div className="space-y-1">
                      {suggestions.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setShowSearchDropdown(false);
                            navigate(`/product/${p.slug}`);
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-9 h-9 object-cover rounded-lg bg-slate-100"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {p.brand} • <span className="text-slate-950 font-bold">₹{p.price}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-3 border-t border-slate-100">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Recent Searches
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectSearch(term)}
                          className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-full transition-colors"
                        >
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User & Cart Icons Group */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-slate-900 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Account Menu */}
            <div ref={accountRef} className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline font-bold text-slate-800 max-w-[100px] truncate">
                    {user?.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Account Dropdown */}
              {isAccountDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 p-2 space-y-1">
                  <div className="p-3 bg-slate-50 rounded-xl mb-1">
                    <p className="text-xs font-bold text-slate-900">{user?.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/account/profile"
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/account/orders"
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Package className="w-4 h-4 text-slate-500" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/account/addresses"
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>Saved Addresses</span>
                  </Link>
                  <Link
                    to="/account/change-password"
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <KeyRound className="w-4 h-4 text-slate-500" />
                    <span>Change Password</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsAccountDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search car, scooter, motorcycle accessories..."
              className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-400 pl-4 pr-10 py-2 rounded-xl text-xs font-medium outline-none border border-slate-200 focus:border-brand-500"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-500">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Main Navigation Bar */}
      <nav className="hidden lg:block bg-slate-100/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 text-xs font-bold tracking-wide uppercase">
          <Link
            to="/"
            className={`py-3 transition-colors border-b-2 ${
              location.pathname === '/' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-700 hover:text-brand-600'
            }`}
          >
            Home
          </Link>

          {/* Products Mega Dropdown */}
          <div 
            className="relative py-3 group"
            onMouseEnter={() => setShowProductsDropdown(true)}
            onMouseLeave={() => setShowProductsDropdown(false)}
          >
            <button className="flex items-center gap-1.5 text-slate-700 hover:text-brand-600 transition-colors uppercase font-bold">
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showProductsDropdown && (
              <div className="absolute top-full left-0 w-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 grid grid-cols-3 gap-6 z-50 normal-case tracking-normal">
                {categoriesList.map((cat) => (
                  <div key={cat.id || cat.slug} className="space-y-2">
                    <Link
                      to={`/category/${cat.slug}`}
                      onClick={() => setShowProductsDropdown(false)}
                      className="font-extrabold text-slate-900 text-sm hover:text-brand-600 flex items-center gap-1 border-b border-slate-100 pb-1.5"
                    >
                      {cat.name}
                    </Link>
                    <div className="space-y-1">
                      {cat.subcategories && cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id || sub.slug}
                          to={`/category/${cat.slug}?subcategory=${sub.slug}`}
                          onClick={() => setShowProductsDropdown(false)}
                          className="block text-xs text-slate-600 hover:text-brand-600 font-medium py-1 hover:translate-x-1 transition-all"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/category/cars"
            className={`py-3 flex items-center gap-1.5 transition-colors border-b-2 ${
              location.pathname.includes('/category/cars') ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-700 hover:text-brand-600'
            }`}
          >
            <Car className="w-4 h-4" /> Cars
          </Link>

          <Link
            to="/category/auto-parts"
            className={`py-3 flex items-center gap-1.5 transition-colors border-b-2 ${
              location.pathname.includes('/category/auto-parts') ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-700 hover:text-brand-600'
            }`}
          >
            Auto Parts
          </Link>

          <Link
            to="/category/accessories"
            className={`py-3 flex items-center gap-1.5 transition-colors border-b-2 ${
              location.pathname.includes('/category/accessories') ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-700 hover:text-brand-600'
            }`}
          >
            Accessories
          </Link>

          <Link
            to="/admin"
            className={`py-3 flex items-center gap-1 transition-colors border-b-2 ${
              location.pathname.includes('/admin') ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-700 hover:text-brand-600'
            }`}
          >
            Admin Panel
          </Link>

          <Link
            to="/search?q=deal"
            className="py-3 flex items-center gap-1 text-brand-600 hover:text-brand-700 ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5" /> Best Offers
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-3 animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-slate-900 rounded-lg hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/category/cars"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-slate-900 rounded-lg hover:bg-slate-100"
          >
            Car Accessories
          </Link>
          <Link
            to="/category/scooters"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-slate-900 rounded-lg hover:bg-slate-100"
          >
            Scooter Accessories
          </Link>
          <Link
            to="/category/motorcycles"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-slate-900 rounded-lg hover:bg-slate-100"
          >
            Motorcycle Accessories
          </Link>
        </div>
      )}

      {/* Pincode Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setIsLocationModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Choose Delivery Location</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your 6-digit PIN code to check product availability & express delivery dates.
              </p>
            </div>
            <form onSubmit={handlePincodeSubmit} className="space-y-3">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode (e.g. 560001)"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md"
              >
                Apply Location
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
