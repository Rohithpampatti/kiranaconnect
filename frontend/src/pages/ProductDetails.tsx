import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Star, Truck, ShieldCheck, Clock, 
  Minus, Plus, Heart, Share2, ChevronLeft, 
  CheckCircle, Package, RotateCcw 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  unit: string;
  description: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      
      // Fetch related products (same category, different products)
      const allProducts = await api.get('/products');
      const related = allProducts.data
        .filter((p: Product) => p.category === response.data.category && p._id !== id)
        .slice(0, 4);
      setRelatedProducts(related);
      
      // Check if product is in cart
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item: any) => item.id === id);
      setIsInCart(!!existingItem);
      if (existingItem) {
        setQuantity(existingItem.quantity);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!isAuthenticated) {
      toast.warning('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex((item: any) => item.id === product._id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity = quantity;
    } else {
      cart.push({ 
        id: product._id, 
        name: product.name, 
        price: product.price, 
        image: product.image,
        quantity: quantity,
        unit: product.unit
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    setIsInCart(true);
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${quantity} × ${product.name} added to cart!`);
  };

  const updateQuantity = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
      
      // If already in cart, update cart quantity
      if (isInCart) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemIndex = cart.findIndex((item: any) => item.id === id);
        if (itemIndex > -1) {
          cart[itemIndex].quantity = newQuantity;
          localStorage.setItem('cart', JSON.stringify(cart));
          window.dispatchEvent(new Event('cartUpdated'));
        }
      }
    }
  };

  const buyNow = () => {
    addToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
          <Link to="/" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        {/* Product Main Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={product.image || `https://placehold.co/600x600/emerald/white?text=${product.name}`}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              {product.stock < 10 && product.stock > 0 && (
                <span className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Only {product.stock} left
                </span>
              )}
              {product.stock === 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Out of Stock
                </span>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <div className="mb-2">
                <span className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-emerald-500 text-emerald-500" />
                  ))}
                  <span className="text-sm text-slate-500 ml-2">(128 reviews)</span>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                {product.description || `Fresh ${product.name} - Premium quality ${product.category} item. 
                Sourced directly from local farmers and suppliers to ensure maximum freshness. 
                Perfect for your daily cooking needs.`}
              </p>
              
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-emerald-600">₹{product.price}</span>
                <span className="text-slate-400">per {product.unit}</span>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-2">
                    <button
                      onClick={() => updateQuantity(-1)}
                      disabled={quantity <= 1}
                      className="p-2 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-semibold text-lg min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(1)}
                      disabled={quantity >= product.stock}
                      className="p-2 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span className="text-sm text-slate-500">
                    {product.stock} units available
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInCart ? 'Update Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={buyNow}
                  disabled={product.stock === 0}
                  className="flex-1 border-2 border-emerald-600 text-emerald-600 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-50"
                >
                  Buy Now
                </button>
                <button className="p-3 border border-slate-200 rounded-xl hover:border-emerald-600 transition-colors">
                  <Heart size={20} className="text-slate-400 hover:text-red-500" />
                </button>
                <button className="p-3 border border-slate-200 rounded-xl hover:border-emerald-600 transition-colors">
                  <Share2 size={20} className="text-slate-400 hover:text-emerald-600" />
                </button>
              </div>
              
              {/* Delivery Info */}
              <div className="border-t border-slate-100 pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Truck size={18} className="text-emerald-600" />
                  <span className="text-sm text-slate-600">Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-emerald-600" />
                  <span className="text-sm text-slate-600">Delivery in 25-30 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={18} className="text-emerald-600" />
                  <span className="text-sm text-slate-600">Easy returns within 24 hours</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  to={`/product/${related._id}`}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-slate-100">
                    <img
                      src={related.image || `https://placehold.co/400x400/emerald/white?text=${related.name}`}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{related.name}</h3>
                  <p className="text-emerald-600 font-bold">₹{related.price}</p>
                  <p className="text-xs text-slate-500">per {related.unit}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;