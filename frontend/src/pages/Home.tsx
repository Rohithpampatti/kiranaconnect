import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Star, Clock, ShieldCheck, Truck, Plus, Minus, Search, X } from 'lucide-react';
import Header from '../components/Header';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
    loadCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setAllProducts(response.data);
      setProducts(response.data);
      const uniqueCategories = ['all', ...new Set(response.data.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartMap = {};
    cart.forEach(item => {
      cartMap[item.id] = item.quantity;
    });
    setCartItems(cartMap);
  };

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setIsSearching(term.length > 0);
    
    if (term.length === 0) {
      setProducts(allProducts);
      setSelectedCategory('all');
    } else {
      const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(term)
      );
      setProducts(filtered);
      setSelectedCategory('all');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setProducts(allProducts);
    setSelectedCategory('all');
  };

  // Category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      setProducts(allProducts.filter(p => 
        searchTerm.length === 0 || p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      const filtered = allProducts.filter(p => 
        p.category === category &&
        (searchTerm.length === 0 || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setProducts(filtered);
    }
  };

  const addToCart = (e: React.MouseEvent, product) => {
    e.preventDefault(); // Prevent navigation to product details
    if (!isAuthenticated) {
      toast.warning('Please login to add items to cart');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product._id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ 
        id: product._id, 
        name: product.name, 
        price: product.price, 
        image: product.image,
        quantity: 1,
        unit: product.unit
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${product.name} added to cart!`);
  };

  const updateQuantity = (e: React.MouseEvent, productId, change) => {
    e.preventDefault(); // Prevent navigation to product details
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
      const newQuantity = cart[itemIndex].quantity + change;
      if (newQuantity <= 0) {
        cart.splice(itemIndex, 1);
        toast.info('Item removed from cart');
      } else {
        cart[itemIndex].quantity = newQuantity;
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50 -z-10 rounded-bl-[100px]" />
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-6">
                Freshness Guaranteed 🌿
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-tight mb-6">
                Your Local Kirana, <br />
                <span className="text-emerald-600">Now Online.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                Get fresh groceries, staples, and household essentials delivered from your favorite local store in under 30 minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-700 hover:scale-105 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2"
                >
                  Shop Now <ArrowRight size={20} />
                </button>
                <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold border border-slate-200 hover:bg-slate-50 transition-all">
                  View Offers
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" 
                alt="Fresh Groceries" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Clock className="text-amber-600" size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fast Delivery</p>
                  <p className="text-lg font-bold text-slate-900">25-30 Mins</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-24 bg-white" id="products">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Shop by Category</h2>
                <p className="text-slate-500">Explore our wide range of fresh products</p>
              </div>
              
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-12 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Search Results Info */}
            {isSearching && (
              <div className="mb-6 text-center">
                <p className="text-slate-600">
                  Found <span className="font-bold text-emerald-600">{products.length}</span> results for "<span className="font-semibold">{searchTerm}</span>"
                </p>
              </div>
            )}
            
            {/* Categories */}
            <div className="flex gap-3 mb-12 overflow-x-auto pb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-6 py-3 rounded-full capitalize whitespace-nowrap transition-all font-medium ${
                    selectedCategory === cat 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'bg-slate-100 text-slate-700 hover:bg-emerald-100'
                  }`}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              ))}
            </div>

            {/* Products Grid with Links to Product Details */}
            {products.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="h-20 w-20 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
                <p className="text-slate-500">Try searching with different keywords</p>
                <button
                  onClick={clearSearch}
                  className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="block bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                      <img 
                        src={product.image || `https://placehold.co/400x400/22c55e/white?text=${encodeURIComponent(product.name)}`} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{product.category}</p>
                      <h3 className="font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-slate-500">per {product.unit}</p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-slate-900">₹{product.price}</span>
                        </div>
                        {cartItems[product._id] ? (
                          <div className="flex items-center gap-2 bg-emerald-100 rounded-xl p-1">
                            <button
                              onClick={(e) => updateQuantity(e, product._id, -1)}
                              className="bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-bold text-emerald-700 min-w-[24px] text-center">
                              {cartItems[product._id]}
                            </span>
                            <button
                              onClick={(e) => updateQuantity(e, product._id, 1)}
                              className="bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => addToCart(e, product)}
                            className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                          >
                            <ShoppingBag size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-emerald-900 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-800 rounded-2xl flex items-center justify-center mb-2">
                  <Truck className="text-emerald-400" size={32} />
                </div>
                <h3 className="text-xl font-bold">Lightning Fast Delivery</h3>
                <p className="text-emerald-100/70 text-sm leading-relaxed">We deliver your groceries within 30 minutes of ordering, guaranteed.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-800 rounded-2xl flex items-center justify-center mb-2">
                  <ShieldCheck className="text-emerald-400" size={32} />
                </div>
                <h3 className="text-xl font-bold">Quality Assurance</h3>
                <p className="text-emerald-100/70 text-sm leading-relaxed">Every item is handpicked and checked for quality before it leaves the store.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-800 rounded-2xl flex items-center justify-center mb-2">
                  <Star className="text-emerald-400" size={32} />
                </div>
                <h3 className="text-xl font-bold">Best Prices</h3>
                <p className="text-emerald-100/70 text-sm leading-relaxed">Get the best deals and discounts on all your daily essentials.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;