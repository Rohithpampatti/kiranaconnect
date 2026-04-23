import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Truck, CheckCircle, Clock, MapPin, 
  Phone, User, Navigation, RefreshCw, Bell, 
  ShoppingBag, Star, AlertCircle, Crosshair, Loader,
  Wallet, TrendingUp, Award, Calendar, ChevronRight,
  Eye, MessageCircle, Headphones, LogOut, 
  Zap, Shield, ThumbsUp, Battery, Wifi, Sun,
  Home, Briefcase, Navigation2, Circle, Map, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface DeliveryOrder {
  _id: string;
  user: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryAddress: string;
  paymentMethod: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  distance?: number;
}

const Delivery = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(true);
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<DeliveryOrder[]>([]);
  const [completedOrders, setCompletedOrders] = useState<DeliveryOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState<{lat: number; lng: number} | null>(null);
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0
  });
  const [deliveryStats, setDeliveryStats] = useState({
    totalDeliveries: 0,
    rating: 4.8,
    acceptanceRate: 98,
    onTimeRate: 96
  });
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  let watchId: number | null = null;

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'delivery') {
      navigate('/');
      toast.error('Access denied. Delivery partner only.');
      return;
    }
    fetchOrders();
    fetchEarnings();
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      clearInterval(timer);
    };
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (activeTab === 'available') {
        const response = await api.get('/delivery/all-orders');
        setAvailableOrders(response.data);
      } else if (activeTab === 'active') {
        const response = await api.get('/delivery/orders');
        setMyDeliveries(response.data);
        if (response.data.length > 0 && !currentOrderId) {
          setCurrentOrderId(response.data[0]._id);
          setSelectedOrder(response.data[0]);
        }
      } else {
        const response = await api.get('/orders/my-orders');
        const completed = response.data.filter((order: any) => order.status === 'delivered');
        setCompletedOrders(completed);
        setDeliveryStats(prev => ({ ...prev, totalDeliveries: completed.length }));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await api.get('/delivery/earnings');
      setEarnings(response.data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const sendLocationToBackend = async (lat: number, lng: number) => {
    if (!currentOrderId) return;
    try {
      await api.post('/delivery/update-location', { orderId: currentOrderId, lat, lng });
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }

    setIsTracking(true);
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDeliveryLocation({ lat: latitude, lng: longitude });
        sendLocationToBackend(latitude, longitude);
      },
      (error) => {
        toast.error('Unable to track location. Please enable GPS.');
        setIsTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 60000 }
    );
    toast.success('📍 Live location sharing started! Customer can track you');
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    setIsTracking(false);
    toast.info('Location sharing stopped');
  };

 const acceptDelivery = async (orderId: string) => {
  try {
    const response = await api.post('/delivery/accept-order', { orderId });
    if (response.data.success) {
      setCurrentOrderId(orderId);
      toast.success('Order accepted! Start delivery now');
      fetchOrders();
      startTracking();
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to accept order');
  }
};
  const markAsDelivered = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: 'delivered' });
      toast.success('🎉 Order delivered! +₹50 added to earnings');
      stopTracking();
      setCurrentOrderId(null);
      setSelectedOrder(null);
      fetchOrders();
      fetchEarnings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string; icon: JSX.Element }> = {
      'confirmed': { color: 'bg-blue-500', text: 'Ready for Pickup', icon: <Clock size={12} /> },
      'preparing': { color: 'bg-orange-500', text: 'Being Prepared', icon: <Package size={12} /> },
      'out-for-delivery': { color: 'bg-purple-500', text: 'Out for Delivery', icon: <Truck size={12} /> },
      'delivered': { color: 'bg-green-500', text: 'Delivered', icon: <CheckCircle size={12} /> }
    };
    const b = badges[status] || { color: 'bg-gray-500', text: status, icon: <Clock size={12} /> };
    return (
      <span className={`${b.color} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
        {b.icon} {b.text}
      </span>
    );
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Status Bar */}
      <div className="bg-emerald-600 text-white px-4 py-2 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Wifi size={12} /> Live</span>
            <span>{formatDate()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Battery size={14} /> {formatTime()}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 text-sm">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},</p>
              <h1 className="text-2xl font-bold mt-1">{user?.name?.split(' ')[0] || 'Partner'}!</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{deliveryStats.rating}</span>
                  <span className="text-xs">★</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                  <Zap size={14} />
                  <span className="text-sm">{deliveryStats.acceptanceRate}% Acceptance</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                  <ThumbsUp size={14} />
                  <span className="text-sm">{deliveryStats.onTimeRate}% On-Time</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-xl px-4 py-2">
                <p className="text-xs">Today's Earnings</p>
                <p className="text-2xl font-bold">₹{earnings.today}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="h-6 w-6 text-emerald-600" />
              <span className="text-xs text-gray-400">This Week</span>
            </div>
            <p className="text-2xl font-bold">₹{earnings.week}</p>
            <p className="text-xs text-gray-500">Weekly Earnings</p>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold">₹{earnings.total}</p>
            <p className="text-xs text-gray-500">Total Earnings</p>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Truck className="h-6 w-6 text-emerald-600" />
              <span className="text-xs text-gray-400">Lifetime</span>
            </div>
            <p className="text-2xl font-bold">{deliveryStats.totalDeliveries}</p>
            <p className="text-xs text-gray-500">Total Deliveries</p>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-6 w-6 text-emerald-600" />
              <span className="text-xs text-gray-400">Active</span>
            </div>
            <p className="text-2xl font-bold">{myDeliveries.length}</p>
            <p className="text-xs text-gray-500">Active Deliveries</p>
          </motion.div>
        </div>

        {/* Live Tracking Card */}
        {activeTab === 'active' && myDeliveries.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-6 border border-emerald-200"
          >
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  {isTracking && <div className="absolute -inset-1 bg-green-500 rounded-full animate-ping opacity-75"></div>}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Live Location Status</p>
                  <p className="text-sm text-gray-600">
                    {isTracking ? '📍 Sharing live location with customer' : '🔴 Not sharing location'}
                  </p>
                </div>
              </div>
              <button
                onClick={isTracking ? stopTracking : startTracking}
                className={`px-5 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                  isTracking 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-md' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                }`}
              >
                {isTracking ? (
                  <>
                    <Crosshair size={16} />
                    Stop Sharing
                  </>
                ) : (
                  <>
                    <Navigation size={16} />
                    Share Live Location
                  </>
                )}
              </button>
            </div>
            {deliveryLocation && isTracking && (
              <div className="mt-3 pt-3 border-t border-emerald-200">
                <a 
                  href={`https://maps.google.com/?q=${deliveryLocation.lat},${deliveryLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 text-sm flex items-center gap-2 hover:underline"
                >
                  <Map size={14} /> View my current location on Google Maps
                </a>
              </div>
            )}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
          {[
            { id: 'available', label: 'Available Orders', icon: Bell, count: availableOrders.length },
            { id: 'active', label: 'My Deliveries', icon: Truck, count: myDeliveries.length },
            { id: 'completed', label: 'History', icon: CheckCircle, count: completedOrders.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Available Orders */}
        <AnimatePresence mode="wait">
          {activeTab === 'available' && (
            <motion.div
              key="available"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {availableOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">No orders available</h3>
                  <p className="text-gray-400 text-sm mt-1">Orders will appear here when customers place them</p>
                </div>
              ) : (
                availableOrders.map((order, idx) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              #{order._id.slice(-8)}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-2xl font-bold text-emerald-600">₹{order.totalAmount}</p>
                          {order.deliveryTimeSlot && (
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Clock size={10} /> {order.deliveryTimeSlot}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => acceptDelivery(order._id)}
                          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 flex items-center gap-2 font-medium shadow-md"
                        >
                          <Truck size={18} />
                          Accept & Pickup
                        </button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-start gap-3">
                          <div className="bg-emerald-100 p-2 rounded-xl">
                            <User size={16} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium">{order.user?.name || 'Customer'}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={12} /> {order.user?.phone || 'Not provided'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-gray-100 p-2 rounded-xl">
                            <MapPin size={16} className="text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 line-clamp-2">{order.deliveryAddress}</p>
                            <a 
                              href={`https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 text-xs mt-1 flex items-center gap-1 hover:underline"
                            >
                              <Navigation2 size={12} /> Get Directions
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-gray-400" />
                          <span className="text-gray-600">{order.items.reduce((sum, i) => sum + i.quantity, 0)} items</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShoppingBag size={14} className="text-gray-400" />
                          <span className="text-gray-600">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}</span>
                        </div>
                        <button 
                          onClick={() => { setSelectedOrder(order); setShowOrderDetails(true); }}
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Active Deliveries */}
          {activeTab === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {myDeliveries.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">No active deliveries</h3>
                  <p className="text-gray-400 text-sm mt-1">Accept orders from Available Orders tab</p>
                </div>
              ) : (
                myDeliveries.map((order, idx) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              #{order._id.slice(-8)}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-xl font-bold text-emerald-600">₹{order.totalAmount}</p>
                        </div>
                        {order.status === 'out-for-delivery' && (
                          <button
                            onClick={() => markAsDelivered(order._id)}
                            className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 flex items-center gap-2 font-medium shadow-md"
                          >
                            <CheckCircle size={18} />
                            Mark Delivered
                          </button>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-start gap-3">
                          <div className="bg-emerald-100 p-2 rounded-xl">
                            <User size={16} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium">{order.user?.name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={12} /> {order.user?.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-gray-100 p-2 rounded-xl">
                            <MapPin size={16} className="text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                            <a 
                              href={`https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 text-xs mt-1 flex items-center gap-1 hover:underline"
                            >
                              <Navigation2 size={12} /> Get Directions
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Delivery Partner:</span>
                          <span className="font-medium">{user?.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-gray-600">Est. Delivery Time:</span>
                          <span className="font-medium text-emerald-600">25-30 min</span>
                        </div>
                        {isTracking && currentOrderId === order._id && (
                          <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-emerald-200">
                            <span className="text-gray-600">Live Tracking:</span>
                            <span className="flex items-center gap-1 text-green-600">
                              <Circle size={8} className="fill-green-500 animate-pulse" />
                              Active
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Completed Orders */}
          {activeTab === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {completedOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">No completed deliveries</h3>
                  <p className="text-gray-400 text-sm mt-1">Your delivery history will appear here</p>
                </div>
              ) : (
                completedOrders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            #{order._id.slice(-8)}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="font-semibold mt-2">₹{order.totalAmount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">Delivered ✓</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t text-sm text-gray-500 flex items-center gap-2">
                      <MapPin size={12} />
                      <span className="truncate">{order.deliveryAddress}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors shadow-sm border border-gray-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowOrderDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold">Order Details</h3>
                <button onClick={() => setShowOrderDetails(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-mono text-sm">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Items</p>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-1">Delivery Address</p>
                  <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress}</p>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(selectedOrder.deliveryAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 text-sm mt-2 flex items-center gap-1"
                  >
                    <Navigation2 size={14} /> Open in Maps
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Payment Method</p>
                  <p className="text-sm text-gray-600">{selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : selectedOrder.paymentMethod}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Delivery;