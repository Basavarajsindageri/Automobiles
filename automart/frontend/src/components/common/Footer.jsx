import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Truck, RefreshCw, Headset, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 mt-20">
      {/* Value Proposition Grid */}
      <div className="border-b border-slate-900/80 bg-slate-900/40 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">Genuine Products</h4>
            <p className="text-slate-500 max-w-xs">100% verified authentic automobile accessories direct from manufacturers.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-500">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">Fast Delivery</h4>
            <p className="text-slate-500 max-w-xs">Express dispatch across pan-India with real-time tracking.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-500">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">Easy 7-Day Returns</h4>
            <p className="text-slate-500 max-w-xs">Hassle-free replacement policy if your accessory fit is incorrect.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-500">
              <Headset className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-200 text-sm">24/7 Support</h4>
            <p className="text-slate-500 max-w-xs">Dedicated automobile specialists to guide your purchase.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white">
              Auto<span className="text-brand-500">Mart</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            India's trusted destination for car seat covers, dash cams, LED headlights, riding gloves, helmet locks, and motorcycle touring gear.
          </p>
          <div className="space-y-2 text-slate-400 font-medium">
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-500" /> Toll-Free: 1800-123-4567
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-500" /> support@automart.com
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">Top Categories</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/category/cars" className="hover:text-white transition-colors">
                Car Accessories
              </Link>
            </li>
            <li>
              <Link to="/category/scooters" className="hover:text-white transition-colors">
                Scooter Accessories
              </Link>
            </li>
            <li>
              <Link to="/category/motorcycles" className="hover:text-white transition-colors">
                Motorcycle Accessories
              </Link>
            </li>
            <li>
              <Link to="/search?q=leather" className="hover:text-white transition-colors">
                Nappa Leather Seat Covers
              </Link>
            </li>
            <li>
              <Link to="/search?q=dash" className="hover:text-white transition-colors">
                4K Smart Dash Cams
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">Account & Help</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/account/profile" className="hover:text-white transition-colors">
                My Profile
              </Link>
            </li>
            <li>
              <Link to="/account/orders" className="hover:text-white transition-colors">
                Track My Orders
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-white transition-colors">
                Saved Wishlist
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white transition-colors">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/account/addresses" className="hover:text-white transition-colors">
                Shipping Addresses
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">Newsletter</h4>
          <p className="text-slate-400">
            Subscribe to receive exclusive deals, new accessory arrivals, and vehicle maintenance guides.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AutoMart E-Commerce. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>UPI Payments</span>
            <span>•</span>
            <span>Credit & Debit Cards</span>
            <span>•</span>
            <span>Net Banking</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
