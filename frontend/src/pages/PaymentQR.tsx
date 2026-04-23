import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Copy, Check, ArrowLeft, Smartphone, Clock } from 'lucide-react';

const PaymentQR = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Your UPI ID (Replace with your actual UPI ID)
  const UPI_ID = '9100720256-3@ybl'; // Change this to your UPI ID
  const UPI_NAME = 'pampatti rohith';
  const UPI_NOTE = 'Grocery Payment';

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(cart);
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum + 40); // Including delivery fee
    setOrderId(`ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`);
  }, []);

  // Generate UPI Payment URL with dynamic amount
  const generateUPIUrl = () => {
    const amount = total;
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`${UPI_NOTE} - ${orderId}`)}`;
    return upiUrl;
  };

  // Generate QR Code value
  const qrValue = generateUPIUrl();

  const copyUPIId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const checkPaymentAndPlaceOrder = async () => {
    setPaymentStatus('checking');
    
    // Simulate payment check (In real scenario, you'd need a webhook)
    toast.info('Please complete payment in your UPI app');
    
    // For demo: Ask user to confirm payment
    const confirmed = window.confirm('Have you completed the payment?');
    
    if (confirmed) {
      try {
        // Place order after payment confirmation
        const orderData = {
          items: cartItems.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: total,
          deliveryAddress: user?.address || 'Store Address',
          paymentMethod: 'UPI QR',
          paymentStatus: 'completed',
          orderId: orderId
        };
        
        const response = await api.post('/orders', orderData);
        if (response.data) {
          localStorage.removeItem('cart');
          window.dispatchEvent(new Event('cartUpdated'));
          toast.success('Payment successful! Order placed.');
          navigate('/orders');
        }
      } catch (error) {
        toast.error('Failed to place order');
        setPaymentStatus('pending');
      }
    } else {
      toast.warning('Please complete payment first');
      setPaymentStatus('pending');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-emerald-600">
          <ArrowLeft size={20} /> Back to Cart
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
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
              <span>Total Amount</span>
              <span className="text-emerald-600 text-2xl">₹{total}</span>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Order ID: <span className="font-mono text-xs">{orderId}</span></p>
            </div>
          </div>

          {/* QR Payment */}
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Scan & Pay</h2>
            <p className="text-gray-600 mb-2">Pay using any UPI app</p>
            
            <div className="flex justify-center my-6">
              <div className="bg-white p-4 rounded-2xl shadow-lg inline-block">
                <QRCodeSVG 
                  value={qrValue} 
                  size={250}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="L"
                  includeMargin={true}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">UPI ID:</span>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm">{UPI_ID}</code>
                  <button onClick={copyUPIId} className="text-emerald-600 hover:text-emerald-700">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <span className="text-gray-600">Amount to Pay:</span>
                <span className="text-2xl font-bold text-emerald-600">₹{total}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                <Smartphone size={16} />
                <span>Google Pay | PhonePe | Paytm | Any UPI App</span>
              </div>

              <button
                onClick={checkPaymentAndPlaceOrder}
                disabled={paymentStatus === 'checking'}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors mt-4"
              >
                {paymentStatus === 'checking' ? 'Checking Payment...' : 'I have Completed Payment'}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                <Clock size={12} className="inline mr-1" />
                After scanning QR, complete payment in your UPI app then click above button
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
          <h3 className="font-semibold mb-3">How to Pay:</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>1. Open any UPI app (Google Pay / PhonePe / Paytm)</li>
            <li>2. Scan the QR code above</li>
            <li>3. Amount ₹{total} will be auto-filled</li>
            <li>4. Complete the payment</li>
            <li>5. Click "I have Completed Payment" button</li>
          </ol>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Note: This is a demo. In production, payment verification would be automatic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentQR;