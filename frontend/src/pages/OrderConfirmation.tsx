import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  MapPin, Clock, CreditCard, Smartphone, Wallet, 
  QrCode, ChevronRight, Plus, Edit2, Check, 
  Home, Briefcase, Building, Truck, Package, 
  IndianRupee, Tag, AlertCircle, ShieldCheck,
  Crosshair, Loader, Navigation
} from 'lucide-react';

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// Location service functions
const getCurrentLocation = (): Promise<{lat: number; lng: number; address: string}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Get address from coordinates using OpenStreetMap
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          const address = data.display_name || `${lat}, ${lng}`;
          resolve({ lat, lng, address });
        } catch (error) {
          resolve({ lat, lng, address: `${lat}, ${lng}` });
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const OrderConfirmation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(40);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [liveLocation, setLiveLocation] = useState<{lat: number; lng: number} | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  
  // Delivery time state
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Store coordinates (YOUR STORE LOCATION - Updated)
  const STORE_LAT = 17.563138;
  const STORE_LNG = 78.555641;

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM',
    '7:00 PM - 9:00 PM'
  ];

  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
    setCartItems(cart);
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(sum);
    setTotal(sum + deliveryFee - discount);
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/auth/addresses');
      setAddresses(response.data);
      const defaultAddr = response.data.find((addr: Address) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      } else if (response.data.length > 0) {
        setSelectedAddress(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const getLiveLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      setLiveLocation({ lat: location.lat, lng: location.lng });
      
      const dist = calculateDistance(STORE_LAT, STORE_LNG, location.lat, location.lng);
      setDistance(dist);
      
      // Calculate delivery fee based on distance
      let fee = 40;
      if (dist <= 3) fee = 30;
      else if (dist <= 5) fee = 40;
      else if (dist <= 8) fee = 60;
      else if (dist <= 12) fee = 80;
      else fee = 100;
      setDeliveryFee(fee);
      setTotal(subtotal + fee - discount);
      
      // Extract address components
      const addressParts = location.address.split(',');
      setNewAddress({
        ...newAddress,
        address: addressParts[0] || '',
        city: addressParts[1]?.trim() || '',
        state: addressParts[2]?.trim() || '',
      });
      
      toast.success(`Location detected! ${dist.toFixed(1)} km from store`);
    } catch (error) {
      console.error('Error getting location:', error);
      toast.error('Unable to get location. Please allow location access.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.address || !newAddress.city || !newAddress.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const addressData = {
        ...newAddress,
        isDefault: addresses.length === 0
      };
      await api.post('/auth/addresses', addressData);
      toast.success('Address added successfully');
      setShowAddressForm(false);
      setNewAddress({
        type: 'home',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
      });
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const applyCoupon = () => {
    if (couponCode === 'SAVE50' && subtotal >= 500) {
      setDiscount(50);
      setCouponApplied(true);
      setTotal(subtotal + deliveryFee - 50);
      toast.success('Coupon applied! ₹50 off');
    } else if (couponCode === 'FIRST20' && subtotal >= 300) {
      setDiscount(20);
      setCouponApplied(true);
      setTotal(subtotal + deliveryFee - 20);
      toast.success('Coupon applied! ₹20 off');
    } else {
      toast.error('Invalid coupon or minimum order not met');
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCouponApplied(false);
    setCouponCode('');
    setTotal(subtotal + deliveryFee);
    toast.info('Coupon removed');
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home size={18} />;
      case 'office': return <Briefcase size={18} />;
      default: return <Building size={18} />;
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select delivery address');
      setStep(1);
      return;
    }
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select delivery date and time');
      setStep(2);
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
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        totalAmount: total,
        deliveryAddress: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
        deliveryDate: selectedDate,
        deliveryTimeSlot: selectedTimeSlot,
        paymentMethod: paymentMethod,
        couponApplied: couponApplied ? couponCode : null,
        customerLocation: liveLocation
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Confirm Order</h1>
        <p className="text-gray-600 mb-8">Review your order and confirm delivery details</p>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {[
            { step: 1, name: 'Address', icon: MapPin },
            { step: 2, name: 'Delivery Time', icon: Clock },
            { step: 3, name: 'Payment', icon: CreditCard }
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center">
              <button
                onClick={() => setStep(s.step)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  step >= s.step ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                <s.icon size={22} />
              </button>
              <span className={`text-xs mt-2 ${step >= s.step ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address Selection */}
            <div className={`bg-white rounded-2xl shadow-md p-6 ${step === 1 ? 'ring-2 ring-emerald-500' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Delivery Address</h2>
                <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-emerald-600 text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> Add New Address
                </button>
              </div>

              {showAddressForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Add Delivery Address</h3>
                    <button
                      onClick={getLiveLocation}
                      disabled={isGettingLocation}
                      className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-emerald-700"
                    >
                      {isGettingLocation ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Crosshair size={16} />
                      )}
                      Use My Location
                    </button>
                  </div>

                  {liveLocation && (
                    <div className="p-2 bg-emerald-50 rounded-lg text-sm">
                      <p className="text-emerald-700">📍 Distance: {distance?.toFixed(1)} km from store</p>
                      <p className="text-xs text-gray-500 mt-1">Delivery fee: ₹{deliveryFee}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setNewAddress({ ...newAddress, type: 'home' })}
                      className={`p-2 rounded-lg text-sm ${newAddress.type === 'home' ? 'bg-emerald-100 text-emerald-700' : 'bg-white'}`}
                    >
                      <Home size={16} className="inline mr-1" /> Home
                    </button>
                    <button
                      onClick={() => setNewAddress({ ...newAddress, type: 'office' })}
                      className={`p-2 rounded-lg text-sm ${newAddress.type === 'office' ? 'bg-emerald-100 text-emerald-700' : 'bg-white'}`}
                    >
                      <Briefcase size={16} className="inline mr-1" /> Office
                    </button>
                    <button
                      onClick={() => setNewAddress({ ...newAddress, type: 'other' })}
                      className={`p-2 rounded-lg text-sm ${newAddress.type === 'other' ? 'bg-emerald-100 text-emerald-700' : 'bg-white'}`}
                    >
                      <Building size={16} className="inline mr-1" /> Other
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Flat/House No., Building, Street *"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    value={newAddress.landmark}
                    onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="City *"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleAddAddress}
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                  >
                    Save Address
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                      selectedAddress?.id === addr.id ? 'border-emerald-500 bg-emerald-50' : 'hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?.id === addr.id}
                      onChange={() => setSelectedAddress(addr)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getAddressIcon(addr.type)}
                        <span className="font-medium capitalize">{addr.type}</span>
                        {addr.isDefault && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </label>
                ))}
              </div>

              {addresses.length === 0 && !showAddressForm && (
                <div className="text-center py-8">
                  <MapPin size={48} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No saved addresses</p>
                  <button onClick={() => setShowAddressForm(true)} className="text-emerald-600 mt-2">
                    Add Delivery Address
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Delivery Time */}
            <div className={`bg-white rounded-2xl shadow-md p-6 ${step === 2 ? 'ring-2 ring-emerald-500' : ''}`}>
              <h2 className="text-lg font-semibold mb-4">Delivery Time</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Date</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {getDates().map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date.toISOString())}
                      className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                        selectedDate === date.toISOString()
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2 rounded-lg text-sm transition-all ${
                        selectedTimeSlot === slot
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className={`bg-white rounded-2xl shadow-md p-6 ${step === 3 ? 'ring-2 ring-emerald-500' : ''}`}>
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <Wallet size={20} className="text-emerald-600" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when you receive</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="QR"
                    checked={paymentMethod === 'QR'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <QrCode size={20} className="text-emerald-600" />
                  <div>
                    <p className="font-medium">QR Code Payment</p>
                    <p className="text-xs text-gray-500">Scan & Pay via UPI</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="max-h-64 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t">
                {!couponApplied ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-600">Coupon applied! ₹{discount} off</span>
                    <button onClick={removeCoupon} className="text-red-500 text-xs">Remove</button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-4 pt-3 border-t font-bold text-lg">
                <span>Total</span>
                <span className="text-emerald-600">₹{total}</span>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress || !selectedDate || !selectedTimeSlot}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl mt-6 hover:bg-emerald-700 transition-colors disabled:opacity-50 font-semibold"
              >
                {loading ? 'Placing Order...' : `Confirm Order • ₹${total}`}
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

export default OrderConfirmation;