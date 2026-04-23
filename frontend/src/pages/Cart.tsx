import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    calculateTotal(cart);
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const updateQuantity = (productId, change) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
      const newQuantity = cart[itemIndex].quantity + change;
      if (newQuantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = newQuantity;
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const removeItem = (productId) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const filtered = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(filtered));
    loadCart();
    window.dispatchEvent(new Event('cartUpdated'));
    toast.info('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.warning('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    navigate('/order-confirmation');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-20">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <ShoppingBag className="h-24 w-24 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items yet</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Start Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md p-4 flex gap-4"
              >
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.image || `https://placehold.co/400x400/emerald/white?text=${item.name}`}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-emerald-600 font-bold mt-1">₹{item.price}</p>
                  <p className="text-xs text-gray-500">per {item.unit}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">₹40</span>
              </div>
              {total > 500 && (
                <div className="flex justify-between text-green-600">
                  <span>Free Delivery Discount</span>
                  <span>-₹40</span>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-emerald-600">₹{total > 500 ? total : total + 40}</span>
            </div>
            {total < 500 && (
              <p className="text-xs text-gray-500 mt-2">
                Add ₹{500 - total} more to get free delivery
              </p>
            )}
            <button
              onClick={handleCheckout}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg mt-6 hover:bg-emerald-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;