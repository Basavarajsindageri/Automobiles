import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/currency';
import RatingStars from '../components/common/RatingStars';
import VehicleBadge from '../components/product/VehicleBadge';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'My Saved Wishlist' }]} />

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> My Saved Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Keep track of your favorite accessories and move them to cart anytime.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-700">
          {wishlistItems.length} Items Saved
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500">
            Explore our automotive catalog and click the heart icon on products to save them here.
          </p>
          <Link
            to="/category/cars"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-extrabold text-xs rounded-xl hover:bg-brand-600 transition-colors shadow-md"
          >
            <span>Explore Accessories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between p-4 space-y-3 relative group"
            >
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-rose-600 transition-colors z-10"
                title="Remove from Wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <Link to={`/product/${product.slug}`} className="block">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">{product.brand}</span>
                    <VehicleBadge vehicleType={product.vehicleType} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-brand-600 transition-colors">
                    {product.name}
                  </h3>
                  <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
                </div>
              </Link>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-slate-950">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through block">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleMoveToCart(product)}
                  className="px-3 py-2 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
