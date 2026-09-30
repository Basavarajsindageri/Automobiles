import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import RatingStars from '../components/common/RatingStars';
import VehicleBadge from '../components/product/VehicleBadge';
import ProductCard from '../components/product/ProductCard';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import * as productApi from '../api/productApi';
import { 
  Heart, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Check, 
  Plus, 
  Minus, 
  Star, 
  Tag, 
  ChevronRight,
  Info
} from 'lucide-react';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColour, setSelectedColour] = useState('');
  const [selectedCompatibility, setSelectedCompatibility] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    loadProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const loadProductDetails = async () => {
    setLoading(true);
    try {
      const data = await productApi.getProductBySlug(slug);
      setProduct(data);
      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0]);
      }
      if (data.colours && data.colours.length > 0) {
        setSelectedColour(data.colours[0]);
      }
      if (data.compatibility && data.compatibility.length > 0) {
        setSelectedCompatibility(data.compatibility[0]);
      }

      // Fetch related products
      const related = await productApi.getProducts({ category: data.vehicleType });
      setRelatedProducts((related.content || []).filter(p => p.id !== data.id).slice(0, 4));
    } catch (err) {
      // product not found
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-200 aspect-[4/3] rounded-3xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              <div className="h-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="inline-block px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl">
          Return to Home
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColour, selectedCompatibility);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { 
            label: product.category?.name || product.category || 'Category', 
            link: `/category/${product.category?.slug || product.vehicleType || 'cars'}` 
          },
          ...(product.subcategory?.name ? [{
            label: product.subcategory.name,
            link: `/category/${product.category?.slug || product.vehicleType || 'cars'}?subcategory=${product.subcategory.slug}`
          }] : []),
          { label: product.name }
        ]}
      />

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left Gallery Column */}
        <div className="space-y-4">
          <div className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden aspect-[4/3] shadow-sm">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-brand-600 text-white text-xs font-extrabold rounded-full shadow-md">
                -{product.discountPercentage}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-all ${
                isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img ? 'border-brand-600 scale-95 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">{product.brand}</span>
              <VehicleBadge vehicleType={product.vehicleType} />
              <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">{product.name}</h1>

            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
          </div>

          {/* Price Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-950">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through font-semibold">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full ml-auto">
              You Save {formatCurrency(product.originalPrice - product.price)}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {product.shortDescription}
          </p>

          {/* Colour Selection */}
          {product.colours && product.colours.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 block">
                Select Colour Variant: <span className="text-brand-600">{selectedColour}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colours.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColour(col)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedColour === col
                        ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Compatibility Selector */}
          {product.compatibility && product.compatibility.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 block">
                Select Vehicle Fitment:
              </label>
              <select
                value={selectedCompatibility}
                onChange={(e) => setSelectedCompatibility(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {product.compatibility.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-900">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => addToCart(product, quantity, selectedColour, selectedCompatibility)}
                disabled={product.stock === 0}
                className="py-3.5 px-6 rounded-2xl font-extrabold text-xs bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Shopping Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="py-3.5 px-6 rounded-2xl font-extrabold text-xs bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-600/30 active:scale-95"
              >
                <Zap className="w-4 h-4" /> Buy Now
              </button>
            </div>
          </div>

          {/* Offers callout box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <Tag className="w-4 h-4 text-amber-600" /> Exclusive Offers Available:
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] font-medium text-amber-800">
              <li>Use Code <span className="font-bold">AUTOMART10</span> for extra 10% discount</li>
              <li>Free Express Courier Delivery on orders above ₹999</li>
              <li>10% Instant Discount on HDFC Bank Credit & Debit Cards</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specs, Reviews */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-3.5 px-6 border-b-2 transition-colors ${
              activeTab === 'description' ? 'border-brand-600 text-brand-600 bg-white' : 'border-transparent text-slate-600 hover:text-slate-950'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3.5 px-6 border-b-2 transition-colors ${
              activeTab === 'specs' ? 'border-brand-600 text-brand-600 bg-white' : 'border-transparent text-slate-600 hover:text-slate-950'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-6 border-b-2 transition-colors ${
              activeTab === 'reviews' ? 'border-brand-600 text-brand-600 bg-white' : 'border-transparent text-slate-600 hover:text-slate-950'
            }`}
          >
            Customer Reviews ({product.reviewCount})
          </button>
        </div>

        <div className="p-6 sm:p-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Detailed Description</h3>
              <p>{product.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Custom Vehicle Precision Fit</h4>
                    <p className="text-xs text-slate-500">Engineered to exact OEM dimensions for seamless installation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Heavy Duty All-Weather Durability</h4>
                    <p className="text-xs text-slate-500">Built to withstand heat, rain, mud, and intense UV exposure.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Key Specs</h3>
              <table className="w-full text-left border-collapse text-xs">
                <tbody>
                  <tr className="border-b border-slate-100 py-2">
                    <td className="py-2.5 font-bold text-slate-900 w-1/3">Brand</td>
                    <td className="py-2.5 text-slate-600">{product.brand}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-2">
                    <td className="py-2.5 font-bold text-slate-900">Category</td>
                    <td className="py-2.5 text-slate-600">{product.category}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-2">
                    <td className="py-2.5 font-bold text-slate-900">SKU Code</td>
                    <td className="py-2.5 text-slate-600">{product.sku}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-2">
                    <td className="py-2.5 font-bold text-slate-900">Compatible Models</td>
                    <td className="py-2.5 text-slate-600">{product.compatibility.join(', ')}</td>
                  </tr>
                  <tr className="py-2">
                    <td className="py-2.5 font-bold text-slate-900">Warranty</td>
                    <td className="py-2.5 text-slate-600">1 Year AutoMart Manufacturer Replacement Warranty</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                <div className="text-center border-r border-slate-200 pr-6">
                  <span className="text-4xl font-black text-slate-950">{product.rating}</span>
                  <span className="text-xs text-slate-400 block font-semibold">out of 5</span>
                </div>
                <div>
                  <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
                  <p className="text-xs text-slate-500 mt-1">Based on {product.reviewCount} verified buyer reviews</p>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Vikram R. (Verified Buyer)</span>
                    <span className="text-slate-400">2 days ago</span>
                  </div>
                  <RatingStars rating={5} showCount={false} size="sm" />
                  <p className="text-xs text-slate-600">
                    "Excellent build quality! Fits my vehicle perfectly and looks super premium. Delivered within 3 days in Bengaluru."
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Ananya S. (Verified Buyer)</span>
                    <span className="text-slate-400">1 week ago</span>
                  </div>
                  <RatingStars rating={4.5} showCount={false} size="sm" />
                  <p className="text-xs text-slate-600">
                    "Very easy to install. Material feels durable and looks genuine. Totally worth the price!"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-950">Related Accessories You May Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;
