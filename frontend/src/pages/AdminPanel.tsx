import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Plus, Edit2, Trash2, Search, X, 
  Users, ShoppingBag, DollarSign, TrendingUp,
  Eye, CheckCircle, Clock, Truck, Check,
  Upload, Image as ImageIcon, Save, RefreshCw,
  UserPlus, UserCheck, Shield, AlertCircle,
  MoreVertical, Filter, Download, Calendar,
  Star, Phone, Mail, MapPin, Award, BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  unit: string;
  description: string;
  brand?: string;
}

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryAddress: string;
  paymentMethod: string;
  deliveryPartner?: { name: string; phone: string };
}

interface DeliveryPartner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  totalDeliveries: number;
  totalEarnings: number;
  rating: number;
  status: 'active' | 'inactive';
  joinDate: string;
  vehicleNumber: string;
  area: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
}

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    unit: '',
    description: '',
    brand: '',
    image: ''
  });
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  
  // Delivery Partners state
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([]);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<DeliveryPartner | null>(null);
  const [deliveryForm, setDeliveryForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'delivery123',
    vehicleNumber: '',
    area: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalDeliveryPartners: 0,
    pendingOrders: 0,
    outForDelivery: 0,
    completedToday: 0
  });

  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Grocery', 'Snacks', 'Beverages', 'Bakery', 'Household'];
  const units = ['kg', 'dozen', 'liter', 'pack', 'bottle', 'piece', 'box', 'bunch', 'gram', 'pcs'];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      toast.error('Access denied. Admin only.');
      return;
    }
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        products.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const productsRes = await api.get('/products');
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
      
      const ordersRes = await api.get('/orders');
      setOrders(ordersRes.data);
      
      const totalRevenue = ordersRes.data.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
      const pendingOrders = ordersRes.data.filter((o: Order) => o.status === 'pending').length;
      const outForDelivery = ordersRes.data.filter((o: Order) => o.status === 'out-for-delivery').length;
      const completedToday = ordersRes.data.filter((o: Order) => 
        o.status === 'delivered' && new Date(o.createdAt).toDateString() === new Date().toDateString()
      ).length;
      
      const usersRes = await api.get('/admin/users');
      const allUsers = usersRes.data;
      const deliveryUsers = allUsers.filter((u: any) => u.role === 'delivery');
      
      const partnersWithStats = await Promise.all(deliveryUsers.map(async (partner: any) => {
        const partnerOrders = await api.get('/orders');
        const assignedOrders = partnerOrders.data.filter((o: Order) => o.deliveryPartner === partner._id);
        const deliveredOrders = assignedOrders.filter((o: Order) => o.status === 'delivered');
        
        return {
          ...partner,
          totalDeliveries: deliveredOrders.length,
          totalEarnings: deliveredOrders.length * 50,
          rating: 4.5 + Math.random() * 0.5,
          status: 'active',
          joinDate: new Date(partner.createdAt).toLocaleDateString(),
          vehicleNumber: partner.vehicleNumber || 'AP 1234',
          area: partner.area || 'Hyderabad'
        };
      }));
      
      setDeliveryPartners(partnersWithStats);
      
      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalRevenue,
        totalUsers: allUsers.filter((u: any) => u.role === 'user').length,
        totalDeliveryPartners: deliveryUsers.length,
        pendingOrders,
        outForDelivery,
        completedToday
      });
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const newProduct = {
        name: productForm.name,
        price: Number(productForm.price),
        category: productForm.category,
        stock: Number(productForm.stock) || 0,
        unit: productForm.unit || 'kg',
        description: productForm.description || '',
        brand: productForm.brand || '',
        image: productForm.image || `https://placehold.co/400x400/22c55e/white?text=${encodeURIComponent(productForm.name)}`
      };
      
      await api.post('/products', newProduct);
      toast.success('Product added successfully');
      setShowProductModal(false);
      setProductForm({ name: '', price: '', category: '', stock: '', unit: '', description: '', brand: '', image: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      const updatedProduct = {
        name: productForm.name,
        price: Number(productForm.price),
        category: productForm.category,
        stock: Number(productForm.stock),
        unit: productForm.unit,
        description: productForm.description,
        brand: productForm.brand,
        image: productForm.image
      };
      
      await api.put(`/products/${editingProduct._id}`, updatedProduct);
      toast.success('Product updated successfully');
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', price: '', category: '', stock: '', unit: '', description: '', brand: '', image: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        toast.success('Product deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const assignDeliveryPartner = async (orderId: string, partnerId: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { 
        status: 'out-for-delivery',
        deliveryPartner: partnerId
      });
      toast.success('Delivery partner assigned');
      fetchData();
    } catch (error) {
      toast.error('Failed to assign delivery partner');
    }
  };

  const handleAddDeliveryPartner = async () => {
    if (!deliveryForm.name || !deliveryForm.email) {
      toast.error('Please fill name and email');
      return;
    }
    
    try {
      const usersRes = await api.get('/admin/users');
      const existingUser = usersRes.data.find((u: any) => u.email === deliveryForm.email);
      
      if (existingUser) {
        await api.put(`/admin/users/${existingUser._id}/role`, { role: 'delivery' });
        toast.success(`${deliveryForm.name} promoted to Delivery Partner`);
      } else {
        await api.post('/auth/register', {
          name: deliveryForm.name,
          email: deliveryForm.email,
          password: deliveryForm.password,
          phone: deliveryForm.phone,
          role: 'delivery'
        });
        toast.success(`Delivery partner ${deliveryForm.name} created`);
      }
      
      setShowDeliveryModal(false);
      setDeliveryForm({ name: '', email: '', phone: '', password: 'delivery123', vehicleNumber: '', area: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add delivery partner');
    }
  };

  const handleUpdateDeliveryPartner = async (partnerId: string, updates: any) => {
    try {
      await api.put(`/admin/users/${partnerId}`, updates);
      toast.success('Delivery partner updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update delivery partner');
    }
  };

  const handleDeleteDeliveryPartner = async (partnerId: string) => {
    if (window.confirm('Remove this delivery partner?')) {
      try {
        await api.put(`/admin/users/${partnerId}/role`, { role: 'user' });
        toast.success('Delivery partner removed');
        fetchData();
      } catch (error) {
        toast.error('Failed to remove delivery partner');
      }
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      toast.success(`User role updated to ${role}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({ name: '', price: '', category: '', stock: '', unit: '', description: '', brand: '', image: '' });
    setShowProductModal(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      unit: product.unit || 'kg',
      description: product.description || '',
      brand: product.brand || '',
      image: product.image || ''
    });
    setShowProductModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'confirmed': return <CheckCircle size={14} />;
      case 'preparing': return <Package size={14} />;
      case 'out-for-delivery': return <Truck size={14} />;
      case 'delivered': return <CheckCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your store, products, orders, and delivery partners</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-500">Welcome back,</span>
              <span className="font-semibold text-gray-800 ml-1">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Package className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
            <p className="text-xs text-gray-500">Products</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <ShoppingBag className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
            <p className="text-xs text-gray-500">Orders</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <DollarSign className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Users className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-xs text-gray-500">Customers</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Truck className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold">{stats.totalDeliveryPartners}</p>
            <p className="text-xs text-gray-500">Delivery Partners</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Clock className="h-6 w-6 text-orange-500 mb-2" />
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            <p className="text-xs text-gray-500">Pending Orders</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
            <p className="text-2xl font-bold">{stats.completedToday}</p>
            <p className="text-xs text-gray-500">Completed Today</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6 border-b bg-white rounded-t-xl p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'products' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            🛒 Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            📦 Orders
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'delivery' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            🚚 Delivery Partners
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'users' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            👥 Customers
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-emerald-600 text-sm">View All →</button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">#{order._id.slice(-8)}</span>
                      <span className="font-medium">₹{order.totalAmount}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Top Products</h3>
                  <button onClick={() => setActiveTab('products')} className="text-emerald-600 text-sm">Manage →</button>
                </div>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{product.name}</span>
                      <span className="font-medium">₹{product.price}</span>
                      <span className="text-xs text-gray-400">Stock: {product.stock}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Top Delivery Partners</h3>
                  <button onClick={() => setActiveTab('delivery')} className="text-emerald-600 text-sm">Manage →</button>
                </div>
                <div className="space-y-3">
                  {deliveryPartners.slice(0, 5).map((partner) => (
                    <div key={partner._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{partner.name}</span>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span>{partner.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">{partner.totalDeliveries} deliveries</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={openAddProductModal}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                <Plus size={18} />
                Add Product
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4 font-semibold text-emerald-600">₹{product.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 20 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {product.stock} left
                        </span>
                      </td>
                      <td className="px-6 py-4">{product.unit}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEditProductModal(product)} className="text-blue-600 hover:text-blue-800">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {['all', 'pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'].map((status) => (
                <button
                  key={status}
                  className="px-4 py-1.5 rounded-full text-sm bg-white border hover:bg-gray-50"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Order #{order._id.slice(-8)}</p>
                    <p className="font-medium">{order.user?.name || 'Guest'}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600">₹{order.totalAmount}</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} border-none cursor-pointer`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Items:</p>
                      <div className="space-y-1 text-sm">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm">
                      <p><span className="font-medium">Delivery Address:</span> {order.deliveryAddress}</p>
                      <p className="mt-1"><span className="font-medium">Payment:</span> {order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delivery Partners Tab */}
        {activeTab === 'delivery' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Delivery Partners</h2>
              <button
                onClick={() => setShowDeliveryModal(true)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                <UserPlus size={18} />
                Add Delivery Partner
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {deliveryPartners.map((partner) => (
                <div key={partner._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 p-4 text-white">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                          {partner.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{partner.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-emerald-200">
                            <Star size={12} className="fill-yellow-400" />
                            <span>{partner.rating} ★</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${partner.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}>
                        {partner.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-400" />
                      <span>{partner.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-gray-400" />
                      <span>{partner.phone || 'Not updated'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Truck size={14} className="text-gray-400" />
                      <span>{partner.vehicleNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{partner.area}</span>
                    </div>
                    
                    <div className="border-t pt-3 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Deliveries</span>
                        <span className="font-semibold">{partner.totalDeliveries}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Total Earnings</span>
                        <span className="font-semibold text-emerald-600">₹{partner.totalEarnings}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Joined</span>
                        <span className="text-gray-600">{partner.joinDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => handleDeleteDeliveryPartner(partner._id)}
                        className="flex-1 text-red-600 border border-red-200 py-1.5 rounded-lg text-sm hover:bg-red-50"
                      >
                        Remove
                      </button>
                      <button className="flex-1 text-emerald-600 border border-emerald-200 py-1.5 rounded-lg text-sm hover:bg-emerald-50">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {deliveryPartners.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <Truck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No delivery partners yet</p>
                <button onClick={() => setShowDeliveryModal(true)} className="mt-2 text-emerald-600">
                  Add your first delivery partner
                </button>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-bold">{userItem.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium">{userItem.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{userItem.email}</td>
                    <td className="px-6 py-4 text-sm">{userItem.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={userItem.role}
                        onChange={(e) => handleUpdateUserRole(userItem._id, e.target.value)}
                        className="px-2 py-1 rounded-lg text-sm border"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">{userItem.totalOrders || 0}</td>
                    <td className="px-6 py-4 text-sm font-semibold">₹{userItem.totalSpent || 0}</td>
                    <td className="px-6 py-4">
                      <button className="text-emerald-600 hover:text-emerald-800">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Delivery Partner Modal */}
        {showDeliveryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add Delivery Partner</h3>
                <button onClick={() => setShowDeliveryModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={deliveryForm.name}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Ramesh Kumar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={deliveryForm.email}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="delivery@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={deliveryForm.phone}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    value={deliveryForm.vehicleNumber}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="AP 12 AB 1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Service Area</label>
                  <input
                    type="text"
                    value={deliveryForm.area}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, area: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Hyderabad"
                  />
                </div>
                <button
                  onClick={handleAddDeliveryPartner}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                >
                  Add Delivery Partner
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Modal with Image URL and Preview */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., Fresh Organic Apples"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., FreshFarm, Amul, Tata"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock *</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="e.g., 50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <select
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                  </select>
                </div>
                
                {/* IMAGE URL FIELD - NEW */}
                <div>
                  <label className="block text-sm font-medium mb-1">Product Image URL</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="https://example.com/product-image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste image URL from Google Images, Pexels, Unsplash, or any website
                  </p>
                </div>
                
                {/* Image Preview - NEW */}
                {productForm.image && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                    <img 
                      src={productForm.image} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/400x400/22c55e/white?text=Invalid+URL';
                      }}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Product description, features, benefits..."
                  />
                </div>
                
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;