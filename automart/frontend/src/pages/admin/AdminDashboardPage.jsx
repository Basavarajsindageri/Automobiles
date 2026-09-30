import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  FolderPlus, 
  Package, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';
import * as categoryApi from '../../api/categoryApi';
import * as productApi from '../../api/productApi';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories', 'subcategories', 'products'

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Category Modal Form State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', imageUrl: '' });
  const [uploadingCatImg, setUploadingCatImg] = useState(false);

  // Subcategory Modal Form State
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [subcategoryForm, setSubcategoryForm] = useState({ categoryId: '', name: '', description: '', imageUrl: '' });
  const [uploadingSubImg, setUploadingSubImg] = useState(false);

  // Product Modal Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    categoryId: '',
    subcategoryId: '',
    name: '',
    brand: '',
    shortDescription: '',
    description: '',
    price: '',
    originalPrice: '',
    discountPercentage: '',
    stock: 50,
    sku: '',
    compatibility: '',
    featured: false,
    trending: false,
    newArrival: true,
    mainImageUrl: '',
    imageUrls: []
  });
  const [uploadingProdImg, setUploadingProdImg] = useState(false);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [cats, subs, prods] = await Promise.all([
        categoryApi.getCategories(),
        categoryApi.getSubcategories(),
        productApi.getProducts()
      ]);
      setCategories(cats || []);
      setSubcategories(subs || []);
      setProductsList(prods.content || prods || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 4000);
  };

  // Image Upload Handler
  const handleImageUpload = async (e, setUrlCallback, setUploadingCallback) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCallback(true);
    try {
      const url = await categoryApi.uploadImage(file);
      setUrlCallback(url);
      showSuccess('Image uploaded successfully!');
    } catch (err) {
      showError('Image upload failed. Please try again.');
    } finally {
      setUploadingCallback(false);
    }
  };

  // CATEGORY ACTIONS
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory.id || editingCategory.categoryId, categoryForm);
        showSuccess('Category updated successfully!');
      } else {
        await categoryApi.createCategory(categoryForm);
        showSuccess('Category created successfully!');
      }
      setShowCategoryModal(false);
      loadAllAdminData();
    } catch (err) {
      showError('Failed to save category. ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryApi.deleteCategory(id);
      showSuccess('Category deleted successfully!');
      loadAllAdminData();
    } catch (err) {
      showError('Failed to delete category.');
    }
  };

  // SUBCATEGORY ACTIONS
  const handleSaveSubcategory = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...subcategoryForm,
        categoryId: parseInt(subcategoryForm.categoryId)
      };
      if (editingSubcategory) {
        await categoryApi.updateSubcategory(editingSubcategory.id || editingSubcategory.subcategoryId, payload);
        showSuccess('Subcategory updated successfully!');
      } else {
        await categoryApi.createSubcategory(payload);
        showSuccess('Subcategory created successfully!');
      }
      setShowSubcategoryModal(false);
      loadAllAdminData();
    } catch (err) {
      showError('Failed to save subcategory.');
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
    try {
      await categoryApi.deleteSubcategory(id);
      showSuccess('Subcategory deleted successfully!');
      loadAllAdminData();
    } catch (err) {
      showError('Failed to delete subcategory.');
    }
  };

  // PRODUCT ACTIONS
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        categoryId: parseInt(productForm.categoryId),
        subcategoryId: productForm.subcategoryId ? parseInt(productForm.subcategoryId) : null,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
        discountPercentage: productForm.discountPercentage ? parseInt(productForm.discountPercentage) : null,
        stock: parseInt(productForm.stock)
      };

      if (editingProduct) {
        await productApi.updateProduct(editingProduct.id || editingProduct.productId, payload);
        showSuccess('Product updated successfully!');
      } else {
        await productApi.createProduct(payload);
        showSuccess('Product created successfully!');
      }
      setShowProductModal(false);
      loadAllAdminData();
    } catch (err) {
      showError('Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productApi.deleteProduct(id);
      showSuccess('Product deleted successfully!');
      loadAllAdminData();
    } catch (err) {
      showError('Failed to delete product.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block">
            AutoVerse Admin Management
          </span>
          <h1 className="text-3xl font-black">Catalog Control Panel</h1>
          <p className="text-xs text-slate-300 mt-1">Manage Categories, Subcategories, Products, and Image Assets.</p>
        </div>
        <button
          onClick={loadAllAdminData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab Navigation Bar */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'categories' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderPlus className="w-4 h-4" /> Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('subcategories')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'subcategories' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" /> Subcategories ({subcategories.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'products' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" /> Products ({productsList.length})
        </button>
      </div>

      {/* TAB 1: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Categories List</h3>
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', description: '', imageUrl: '' });
                setShowCategoryModal(true);
              }}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id || cat.categoryId} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-4 space-y-3">
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'}
                  alt={cat.name}
                  className="w-full h-36 object-cover rounded-xl bg-slate-100"
                />
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-base">{cat.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                    {cat.slug}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>
                <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setCategoryForm({ name: cat.name, description: cat.description || '', imageUrl: cat.imageUrl || '' });
                      setShowCategoryModal(true);
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id || cat.categoryId)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SUBCATEGORIES */}
      {activeTab === 'subcategories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Subcategories List</h3>
            <button
              onClick={() => {
                setEditingSubcategory(null);
                setSubcategoryForm({ categoryId: categories[0]?.id || categories[0]?.categoryId || '', name: '', description: '', imageUrl: '' });
                setShowSubcategoryModal(true);
              }}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Subcategory
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subcategories.map((sub) => (
              <div key={sub.id || sub.subcategoryId} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-4 space-y-3">
                <img
                  src={sub.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'}
                  alt={sub.name}
                  className="w-full h-32 object-cover rounded-xl bg-slate-100"
                />
                <div>
                  <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                    Category: {sub.category?.name || 'Assigned'}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{sub.name}</h4>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingSubcategory(sub);
                      setSubcategoryForm({
                        categoryId: sub.category?.categoryId || sub.category?.id || '',
                        name: sub.name,
                        description: sub.description || '',
                        imageUrl: sub.imageUrl || ''
                      });
                      setShowSubcategoryModal(true);
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubcategory(sub.id || sub.subcategoryId)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Products Catalog</h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  categoryId: categories[0]?.id || categories[0]?.categoryId || '',
                  subcategoryId: '',
                  name: '',
                  brand: '',
                  shortDescription: '',
                  description: '',
                  price: '',
                  originalPrice: '',
                  discountPercentage: '',
                  stock: 50,
                  sku: '',
                  compatibility: '',
                  featured: false,
                  trending: false,
                  newArrival: true,
                  mainImageUrl: '',
                  imageUrls: []
                });
                setShowProductModal(true);
              }}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category / Subcategory</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productsList.map((p) => (
                  <tr key={p.id || p.productId} className="hover:bg-slate-50/80">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf'}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400">SKU: {p.sku || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block">
                        {p.category?.name || p.category || 'N/A'}
                      </span>
                      <span className="text-[10px] text-brand-600 font-semibold block">
                        {p.subcategory?.name || p.subcategory || 'General'}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{p.brand}</td>
                    <td className="p-4 font-extrabold text-slate-900">₹{p.price}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setProductForm({
                            categoryId: p.category?.categoryId || p.category?.id || categories[0]?.id || '',
                            subcategoryId: p.subcategory?.subcategoryId || p.subcategory?.id || '',
                            name: p.name,
                            brand: p.brand || '',
                            shortDescription: p.shortDescription || '',
                            description: p.description || '',
                            price: p.price,
                            originalPrice: p.originalPrice || '',
                            discountPercentage: p.discountPercentage || '',
                            stock: p.stock || 50,
                            sku: p.sku || '',
                            compatibility: p.compatibility || '',
                            featured: p.featured || false,
                            trending: p.trending || false,
                            newArrival: p.newArrival || false,
                            mainImageUrl: p.images && p.images[0] ? p.images[0] : '',
                            imageUrls: p.images || []
                          });
                          setShowProductModal(true);
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id || p.productId)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Cars, Auto Parts, Accessories"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Category overview..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={categoryForm.imageUrl}
                    onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                    placeholder="https://... or upload"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <label className="px-3 py-2 bg-slate-900 text-white rounded-xl cursor-pointer hover:bg-brand-600 transition-colors flex items-center gap-1 font-bold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingCatImg ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, (url) => setCategoryForm(prev => ({ ...prev, imageUrl: url })), setUploadingCatImg)}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBCATEGORY MODAL */}
      {showSubcategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h3>
            <form onSubmit={handleSaveSubcategory} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Parent Category</label>
                <select
                  required
                  value={subcategoryForm.categoryId}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, categoryId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id || c.categoryId} value={c.id || c.categoryId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subcategory Name</label>
                <input
                  type="text"
                  required
                  value={subcategoryForm.name}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                  placeholder="e.g. Sedan, SUV, Engine Parts, Helmets"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={subcategoryForm.description}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                  placeholder="Subcategory description..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subcategory Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={subcategoryForm.imageUrl}
                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, imageUrl: e.target.value })}
                    placeholder="https://... or upload"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <label className="px-3 py-2 bg-slate-900 text-white rounded-xl cursor-pointer hover:bg-brand-600 transition-colors flex items-center gap-1 font-bold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingSubImg ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, (url) => setSubcategoryForm(prev => ({ ...prev, imageUrl: url })), setUploadingSubImg)}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubcategoryModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    required
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.categoryId} value={c.id || c.categoryId}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subcategory</label>
                  <select
                    value={productForm.subcategoryId}
                    onChange={(e) => setProductForm({ ...productForm, subcategoryId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories
                      .filter(s => s.category?.id == productForm.categoryId || s.category?.categoryId == productForm.categoryId)
                      .map((s) => (
                        <option key={s.id || s.subcategoryId} value={s.id || s.subcategoryId}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Honda City 5th Gen Sedan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="e.g. Honda, Bosch, Brembo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Short Description</label>
                <input
                  type="text"
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  placeholder="Key summary..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Comprehensive specs and details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Main Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={productForm.mainImageUrl}
                    onChange={(e) => setProductForm({ ...productForm, mainImageUrl: e.target.value })}
                    placeholder="https://... or upload"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <label className="px-3 py-2 bg-slate-900 text-white rounded-xl cursor-pointer hover:bg-brand-600 transition-colors flex items-center gap-1 font-bold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingProdImg ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, (url) => setProductForm(prev => ({ ...prev, mainImageUrl: url })), setUploadingProdImg)}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span>Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.trending}
                    onChange={(e) => setProductForm({ ...productForm, trending: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span>Trending</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.newArrival}
                    onChange={(e) => setProductForm({ ...productForm, newArrival: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
