import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import RatingStars from '../common/RatingStars';
import VehicleBadge from './VehicleBadge';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.discountPercentage > 0 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow-sm">
              -{product.discountPercentage}% OFF
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500 text-slate-950 uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-sm ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{product.brand}</span>
            {product.subcategory?.name ? (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold">
                {product.subcategory.name}
              </span>
            ) : product.category?.name ? (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold">
                {product.category.name}
              </span>
            ) : (
              <VehicleBadge vehicleType={product.vehicleType} />
            )}
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="block text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-950">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] text-amber-600 font-semibold block">
                Only {product.stock} left in stock!
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-brand-600 active:scale-95'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
