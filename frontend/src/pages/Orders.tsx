import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Clock, CheckCircle, Truck, Package, Navigation,
  Star, MapPin, Calendar, ChevronRight, CreditCard,
  Home, Briefcase, Phone, Mail, User, Eye,
  Search, Filter, ArrowLeft, TrendingUp, Award,
  Zap, Shield, ThumbsUp, Battery, Wifi, Sun,
  Circle, Map, X, Receipt, DollarSign, Box
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  _id: string;
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
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  useEffect(() => {
    filterOrders();
  }, [activeFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (activeFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === activeFilter));
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      'pending': <Clock className="h-5 w-5 text-yellow-500" />,
      'confirmed': <CheckCircle className="h-5 w-5 text-blue-500" />,
      'preparing': <Package className="h-5 w-5 text-orange-500" />,
      'out-for-delivery': <Truck className="h-5 w-5 text-purple-500 animate-pulse" />,
      'delivered': <CheckCircle className="h-5 w-5 text-green-500" />
    };
    return icons[status] || <Clock className="h-5 w-5 text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-orange-100 text-orange-800',
      'out-for-delivery': 'bg-purple-100 text-purple-800 animate-pulse',
      'delivered': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'pending': 'Order Placed',
      'confirmed': 'Order Confirmed',
      'preparing': 'Preparing',
      'out-for-delivery': 'Out for Delivery',
      'delivered': 'Delivered'
    };
    return texts[status] || status;
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    return steps.indexOf(status);
  };

  const handleTrackOrder = (orderId: string) => {
    navigate(`/track-order/${orderId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateHeader = () => {
    return currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md"
        >
          <ShoppingBag className="h-24 w-24 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-8">Sign in to view your order history</p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg">
            Login Now
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const filterOptions = [
    { id: 'all', label: 'All Orders', icon: ShoppingBag, count: orders.length },
    { id: 'pending', label: 'Pending', icon: Clock, count: orders.filter(o => o.status === 'pending').length },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, count: orders.filter(o => o.status === 'confirmed').length },
    { id: 'preparing', label: 'Preparing', icon: Package, count: orders.filter(o => o.status === 'preparing').length },
    { id: 'out-for-delivery', label: 'Out for Delivery', icon: Truck, count: orders.filter(o => o.status === 'out-for-delivery').length },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle, count: orders.filter(o => o.status === 'delivered').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Status Bar */}
      <div className="bg-emerald-600 text-white px-4 py-2 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Wifi size={12} /> Live</span>
            <span>{formatDateHeader()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Battery size={14} /> {formatTime()}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
              <p className="text-gray-500 mt-1">Track and manage your deliveries</p>
            </div>
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
              <p className="text-xs text-gray-500">Total Spent</p>
              <p className="text-xl font-bold text-emerald-600">
                ₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <ShoppingBag className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xl font-bold">{orders.length}</p>
            <p className="text-xs text-gray-500">Total Orders</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <Truck className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-xl font-bold">{orders.filter(o => o.status === 'out-for-delivery').length}</p>
            <p className="text-xs text-gray-500">In Transit</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <Package className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <p className="text-xl font-bold">{orders.filter(o => o.status === 'preparing').length}</p>
            <p className="text-xs text-gray-500">Preparing</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
            <p className="text-xs text-gray-500">Delivered</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <Clock className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
            <p className="text-xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeFilter === filter.id 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <filter.icon size={16} />
              <span className="text-sm font-medium">{filter.label}</span>
              {filter.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.id ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No orders found</h3>
            <p className="text-gray-400 text-sm mt-1">You haven't placed any orders yet</p>
            <Link to="/" className="inline-flex items-center gap-2 mt-6 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-5 border-b bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-xl">
                        <Receipt className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Order ID</p>
                        <p className="font-mono font-medium text-sm">#{order._id.slice(-10)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-xl">
                        <Calendar className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Order Date</p>
                        <p className="font-medium text-sm">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-xl">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Total Amount</p>
                        <p className="font-bold text-emerald-600">₹{order.totalAmount}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Order Body */}
                <div className="p-5">
                  {/* Progress Steps */}
                  <div className="mb-6">
                    <div className="relative flex justify-between">
                      {['confirmed', 'preparing', 'out-for-delivery', 'delivered'].map((step, idx) => (
                        <div key={step} className="flex-1 text-center">
                          <div className="relative flex justify-center mb-2">
                            {idx > 0 && (
                              <div 
                                className={`absolute top-2 left-0 w-full h-0.5 ${
                                  getStatusStep(step) <= getStatusStep(order.status) ? 'bg-emerald-500' : 'bg-gray-200'
                                }`} 
                                style={{ left: '50%', right: '-50%' }}
                              />
                            )}
                            <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                              getStatusStep(step) <= getStatusStep(order.status) 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-gray-200 text-gray-400'
                            }`}>
                              {getStatusStep(step) < getStatusStep(order.status) ? (
                                <CheckCircle size={14} />
                              ) : getStatusStep(step) === getStatusStep(order.status) ? (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              ) : (
                                <div className="w-2 h-2 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className={`text-[10px] capitalize ${
                            getStatusStep(step) <= getStatusStep(order.status) ? 'text-gray-700 font-medium' : 'text-gray-400'
                          }`}>
                            {step === 'out-for-delivery' ? 'Out for Delivery' : step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Box size={16} />
                      Items Ordered
                    </h3>
                    <div className="space-y-2 bg-gray-50 rounded-xl p-3">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.name} x{item.quantity}</span>
                          <span className="font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-400 pt-1">
                          +{order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-400">Delivery Address</p>
                        <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mt-2">
                      <CreditCard size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400">Payment Method</p>
                        <p className="text-sm text-gray-700">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {(order.status === 'confirmed' || order.status === 'preparing' || order.status === 'out-for-delivery') && (
                      <button
                        onClick={() => handleTrackOrder(order._id)}
                        className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <Navigation size={16} />
                        Track Order Live
                      </button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <>
                        <button
                          onClick={() => navigate('/')}
                          className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <ShoppingBag size={16} />
                          Buy Again
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 border border-emerald-600 text-emerald-600 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </>
                    )}
                    
                    {order.status === 'pending' && (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
              className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-bold">Order Details</h3>
                </div>
                <button onClick={() => setShowOrderDetails(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-mono text-sm font-medium">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Package size={14} />
                    Items ({selectedOrder.items.length})
                  </p>
                  <div className="space-y-2 bg-gray-50 rounded-xl p-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between py-1 text-sm">
                        <span className="text-gray-600">{item.name} x{item.quantity}</span>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-emerald-600">₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin size={14} />
                    Delivery Address
                  </p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">{selectedOrder.deliveryAddress}</p>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(selectedOrder.deliveryAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 text-sm mt-2 flex items-center gap-1"
                  >
                    <Navigation size={14} /> Open in Maps
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Payment Method</p>
                  <p className="text-sm text-gray-600">{selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Order Date</p>
                  <p className="text-sm text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setShowOrderDetails(false);
                      if (selectedOrder.status === 'delivered') navigate('/');
                    }}
                    className="w-full bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 font-medium"
                  >
                    {selectedOrder.status === 'delivered' ? 'Buy Again' : 'Close'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;