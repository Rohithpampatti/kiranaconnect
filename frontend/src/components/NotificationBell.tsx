import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  _id: string;
  message: string;
  orderId: string;
  read: boolean;
  createdAt: string;
  status: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    for (const id of unreadIds) {
      await api.put(`/notifications/${id}/read`);
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
          >
            <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-emerald-600 hover:text-emerald-700"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-emerald-50' : ''}`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(notification.status)}`}>
                            {notification.status}
                          </span>
                          <p className="text-[10px] text-gray-400">
                            {new Date(notification.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;