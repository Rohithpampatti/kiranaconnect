import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { CreditCard, Smartphone, Wallet, QrCode } from 'lucide-react';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/cart');
    }
    setCartItems(cart);
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  }, []);

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'QR') {
      // Navigate to QR payment page
      navigate('/payment-qr');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total + 40,
        deliveryAddress: user?.address || 'Store Address',
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'Online'
      };
      
      const response = await api.post('/orders', orderData);
      if (response.data) {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        toast.success('Order placed successfully!');
        navigate('/orders');
      }
    } catch (error) {
      toast.error('Failed to place order');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="max-h-80 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between py-2 border-b">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between py-2 border-b mt-2">
              <span>Delivery Fee</span>
              <span>₹40</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg mt-2">
              <span>Total</span>
              <span className="text-emerald-600 text-2xl">₹{total + 40}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <p className="text-gray-600">{user?.address || 'Add your address in profile'}</p>
            
            <h2 className="text-xl font-bold mt-6 mb-4">Payment Method</h2>
            <div className="space-y-3">
              {/* Cash on Delivery */}
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
              
              {/* QR Code Payment */}
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
                  <p className="text-sm text-gray-500">Scan & Pay via UPI (Google Pay, PhonePe, Paytm)</p>
                </div>
              </label>
              
              {/* Card Payment - Coming Soon */}
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-not-allowed bg-gray-50 opacity-60">
                <input
                  type="radio"
                  name="payment"
                  value="CARD"
                  disabled
                  className="w-4 h-4"
                />
                <CreditCard size={20} className="text-gray-400" />
                <div>
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-gray-400">Coming Soon</p>
                </div>
              </label>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg mt-6 hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : paymentMethod === 'QR' ? 'Proceed to QR Payment' : 'Place Order (COD)'}
            </button>
            
            {paymentMethod === 'COD' && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Pay with cash when your order arrives
              </p>
            )}
            {paymentMethod === 'QR' && (
              <p className="text-xs text-gray-500 text-center mt-4">
                You will be redirected to QR payment page
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;