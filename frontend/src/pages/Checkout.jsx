import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Wallet, QrCode } from 'lucide-react';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [address, setAddress] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(cart);
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(sum);
    setTotal(sum + 40);
    
    if (user?.address) {
      setAddress(user.address);
    }
  }, []);

  // Handle COD Order
  const handleCODOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: subtotal,
        deliveryFee: 40,
        discount: 0,
        totalAmount: total,
        deliveryAddress: address || 'Store Address',
        paymentMethod: 'COD'
      };
      
      const response = await api.post('/orders', orderData);
      if (response.data) {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        toast.success('Order placed successfully!');
        navigate('/orders');
      }
    } catch (error) {
      console.error('COD order error:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Handle QR Payment - Navigate to QR page
  const handleQRPayment = () => {
    // Save order data to localStorage for QR payment page
    const pendingOrder = {
      items: cartItems,
      subtotal: subtotal,
      total: total,
      deliveryFee: 40,
      address: address || 'Store Address',
      timestamp: Date.now()
    };
    localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
    // Navigate to QR payment page (NOT place order directly)
    navigate('/payment-qr');
  };

  // Main handler
  const handlePlaceOrder = () => {
    if (paymentMethod === 'QR') {
      handleQRPayment();
    } else {
      handleCODOrder();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <p className="text-gray-500">Your cart is empty</p>
          <button onClick={() => navigate('/')} className="mt-4 text-emerald-600 hover:text-emerald-700">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🛒</span>
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                    <p className="font-bold text-emerald-600">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              {address ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-gray-600 mt-1">{address}</p>
                  <p className="text-gray-600">{user?.phone}</p>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="mt-3 text-emerald-600 text-sm hover:underline"
                  >
                    Change Address
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No delivery address saved</p>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="mt-2 text-emerald-600 hover:underline"
                  >
                    Add Address in Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₹40</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-emerald-600">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Select Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <Wallet size={20} className="text-emerald-600" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="QR"
                      checked={paymentMethod === 'QR'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <QrCode size={20} className="text-emerald-600" />
                    <div>
                      <p className="font-medium">QR Code Payment</p>
                      <p className="text-sm text-gray-500">Scan & Pay via UPI</p>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === 'COD' && !address && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">⚠️ Please add delivery address in profile before placing order</p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading || (paymentMethod === 'COD' && !address)}
                className={`w-full py-3 rounded-lg mt-6 font-semibold transition-colors ${
                  loading || (paymentMethod === 'COD' && !address)
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {loading ? 'Processing...' : paymentMethod === 'QR' ? 'Proceed to QR Payment' : `Place Order • ₹${total}`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing order, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;