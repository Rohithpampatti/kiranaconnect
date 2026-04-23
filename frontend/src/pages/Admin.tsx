import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  MoreVertical,
  AlertCircle,
  LogOut,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

interface Order {
  _id: string;
  user: { name: string; email: string };
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

const Admin = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      toast.error('Access denied. Admin only.');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const ordersRes = await api.get('/orders');
      const orders = ordersRes.data;
      
      // Calculate stats
      const totalSales = orders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
      const activeOrders = orders.filter((order: Order) => 
        order.status !== 'delivered' && order.status !== 'cancelled'
      ).length;
      
      // Fetch products
      const productsRes = await api.get('/products');
      const products = productsRes.data;
      const totalProducts = products.length;
      const lowStock = products.filter((p: Product) => p.stock < 50).slice(0, 5);
      
      // Fetch users
      const usersRes = await api.get('/admin/users');
      const totalCustomers = usersRes.data.filter((u: any) => u.role === 'user').length;
      
      // Get recent orders (last 5)
      const recent = orders.slice(0, 5);
      
      setStats({
        totalSales,
        activeOrders,
        totalProducts,
        totalCustomers
      });
      setRecentOrders(recent);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-orange-100 text-orange-700';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'out-for-delivery': return 'Out for Delivery';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Sales', value: `₹${stats.totalSales.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Orders', value: stats.activeOrders.toString(), icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Products', value: stats.totalProducts.toString(), icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Customers', value: stats.totalCustomers.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300`}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Package className="text-white" size={20} />
            </div>
            {sidebarOpen && (
              <span className="font-serif font-bold text-xl text-slate-900">AdminPanel</span>
            )}
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', active: true },
            { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
            { icon: Package, label: 'Inventory', path: '/admin-panel' },
            { icon: Users, label: 'Customers', path: '/admin/users' },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => item.path !== '/admin' && navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <item.icon size={20} />
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <p className="text-xs text-slate-400 mb-1">Logged in as</p>
            <p className="text-sm font-bold">{user?.name || 'Admin'}</p>
            <button 
              onClick={handleLogout}
              className="mt-3 flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500">Welcome back, {user?.name || 'Admin'}!</p>
          </div>
          <button 
            onClick={() => navigate('/admin-panel')}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Plus size={20} /> Add Product
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
            >
              <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">Recent Orders</h2>
              <button 
                onClick={() => navigate('/admin-panel')}
                className="text-emerald-600 text-sm font-bold"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Order ID</th>
                    <th className="px-6 py-4 font-bold">Customer</th>
                    <th className="px-6 py-4 font-bold">Total</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {order.user?.name || 'Guest'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                          {getStatusDisplay(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="text-slate-400 hover:text-slate-900"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {recentOrders.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No orders yet
              </div>
            )}
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="text-red-500" size={20} />
              <h2 className="font-bold text-slate-900">Low Stock Alerts</h2>
            </div>
            <div className="space-y-4">
              {lowStockProducts.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No low stock items</p>
              ) : (
                lowStockProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-4 p-3 rounded-2xl bg-red-50 border border-red-100">
                    <img 
                      src={product.image || 'https://placehold.co/400x400/22c55e/white?text=' + product.name} 
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover" 
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="text-xs text-red-600 font-medium">Only {product.stock} units left</p>
                    </div>
                    <button 
                      onClick={() => navigate('/admin-panel')}
                      className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      Restock
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;