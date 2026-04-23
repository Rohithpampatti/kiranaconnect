import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Truck, Clock, Navigation, CheckCircle, Package } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

interface Location {
  lat: number;
  lng: number;
  updatedAt: string;
  deliveryPartner: string;
}

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  deliveryTimeSlot: string;
  deliveryDate: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [estimatedTime, setEstimatedTime] = useState(25);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrderDetails();
    
    // Poll for location updates every 5 seconds
    const interval = setInterval(() => {
      fetchDeliveryLocation();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/my-orders`);
      const foundOrder = response.data.find((o: any) => o._id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast.error('Order not found');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryLocation = async () => {
    try {
      const response = await api.get(`/orders/${orderId}/track`);
      if (response.data.lat) {
        setDeliveryLocation(response.data);
        // Calculate estimated time based on distance (simplified)
        if (response.data.distance) {
          setEstimatedTime(Math.ceil(response.data.distance * 3));
        }
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    return steps.indexOf(status);
  };

  const getStatusIcon = (stepStatus: string, currentStatus: string) => {
    const stepIndex = getStatusStep(stepStatus);
    const currentIndex = getStatusStep(currentStatus);
    
    if (stepIndex < currentIndex) {
      return <CheckCircle size={20} className="text-green-500" />;
    } else if (stepIndex === currentIndex) {
      return <div className="w-5 h-5 bg-emerald-600 rounded-full animate-pulse"></div>;
    } else {
      return <div className="w-5 h-5 bg-gray-300 rounded-full"></div>;
    }
  };

  const getStatusLine = (stepStatus: string, currentStatus: string) => {
    const stepIndex = getStatusStep(stepStatus);
    const currentIndex = getStatusStep(currentStatus);
    
    if (stepIndex < currentIndex) {
      return 'bg-green-500';
    } else if (stepIndex === currentIndex) {
      return 'bg-emerald-600';
    } else {
      return 'bg-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Order not found</p>
          <button onClick={() => navigate('/orders')} className="mt-4 text-emerald-600">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Order Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Track Order</h1>
              <p className="text-gray-500 text-sm">Order #{order._id.slice(-8)}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-600">₹{order.totalAmount}</p>
              <p className="text-xs text-gray-500">
                {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Today'} • {order.deliveryTimeSlot || 'ASAP'}
              </p>
            </div>
          </div>

          {/* Delivery Progress Steps */}
          <div className="mt-6">
            <div className="relative flex justify-between">
              {['confirmed', 'preparing', 'out-for-delivery', 'delivered'].map((step, idx) => (
                <div key={step} className="flex-1 text-center">
                  <div className="relative flex justify-center mb-2">
                    {idx > 0 && (
                      <div className={`absolute top-2 left-0 w-full h-0.5 ${getStatusLine(step, order.status)}`} style={{ left: '50%', right: '-50%' }} />
                    )}
                    <div className="relative z-10 bg-white p-1">
                      {getStatusIcon(step, order.status)}
                    </div>
                  </div>
                  <p className={`text-xs capitalize ${getStatusStep(step) <= getStatusStep(order.status) ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                    {step === 'out-for-delivery' ? 'Out for Delivery' : step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Location Map Section */}
        {order.status === 'out-for-delivery' && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Truck className="text-emerald-600" size={20} />
                Delivery Partner Location
              </h2>
              <span className="text-sm text-emerald-600 animate-pulse">● Live</span>
            </div>
            
            {deliveryLocation ? (
              <div>
                <div className="bg-gray-100 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Navigation size={18} className="text-emerald-600 animate-bounce" />
                    <span>Delivery partner is on the way!</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {new Date(deliveryLocation.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
                
                <a
                  href={`https://maps.google.com/?q=${deliveryLocation.lat},${deliveryLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation size={18} />
                  View Live Location on Map
                </a>
                
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                  <p className="text-sm font-medium text-emerald-800">📍 Delivery Details</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Delivery Address: {order.deliveryAddress}
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Estimated arrival: ~{estimatedTime} minutes
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-gray-300 mx-auto mb-3 animate-pulse" />
                <p className="text-gray-500">Waiting for delivery partner to share location...</p>
                <p className="text-xs text-gray-400 mt-2">They will start sharing once they accept the order</p>
              </div>
            )}
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b last:border-0">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                </div>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-emerald-600">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-emerald-600" />
            Delivery Address
          </h2>
          <p className="text-gray-600">{order.deliveryAddress}</p>
          
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress)}`, '_blank')}
              className="flex-1 border border-emerald-600 text-emerald-600 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Get Directions
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Need help? Contact support at support@kiranaconnect.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;