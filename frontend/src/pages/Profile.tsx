import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Lock, Edit2, Save, X, 
  ShoppingBag, Package, Heart, Settings, LogOut, 
  CheckCircle, AlertCircle, Home, Briefcase, Plus, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Address form state
  const [newAddress, setNewAddress] = useState<Address>({
    id: '',
    type: 'home',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    totalSaved: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
    fetchAddresses();
    fetchOrderStats();
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      setProfileData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        city: response.data.city || '',
        state: response.data.state || '',
        pincode: response.data.pincode || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/auth/addresses');
      setAddresses(response.data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      const orders = response.data || [];
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
      setOrderStats({
        totalOrders,
        totalSpent,
        totalSaved: Math.round(totalSpent * 0.1)
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/update', profileData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill all address fields');
      return;
    }
    
    try {
      await api.post('/auth/addresses', newAddress);
      toast.success('Address added successfully!');
      setShowAddressForm(false);
      setNewAddress({
        id: '',
        type: 'home',
        address: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await api.delete(`/auth/addresses/${addressId}`);
        toast.success('Address deleted');
        fetchAddresses();
      } catch (error) {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{profileData.name}</h2>
                <p className="text-sm text-gray-500">{profileData.email}</p>
              </div>
              
              <div className="space-y-2">
                <Link to="/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors text-gray-700">
                  <Package size={20} />
                  <span>My Orders</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Order Stats */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{orderStats.totalOrders}</p>
                  <p className="text-xs text-gray-500">Total Orders</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <Package className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">₹{orderStats.totalSpent}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">₹{orderStats.totalSaved}</p>
                  <p className="text-xs text-gray-500">Total Saved</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <User size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-medium">{profileData.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-medium">{profileData.phone || 'Not added'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <MapPin size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="font-medium">
                        {profileData.address ? 
                          `${profileData.address}, ${profileData.city}, ${profileData.state} - ${profileData.pincode}` : 
                          'Not added'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Street address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={profileData.pincode}
                      onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  {showPasswordForm ? 'Cancel' : 'Change'}
                </button>
              </div>

              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              )}
            </div>

            {/* Saved Addresses */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Saved Addresses</h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                >
                  <Plus size={16} />
                  Add New
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                      <select
                        value={newAddress.type}
                        onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="home">Home</option>
                        <option value="office">Office</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Street address, landmark"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      id="isDefault"
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No saved addresses yet</p>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex gap-3">
                        {addr.type === 'home' ? <Home size={18} className="text-emerald-600" /> : 
                         addr.type === 'office' ? <Briefcase size={18} className="text-emerald-600" /> :
                         <MapPin size={18} className="text-emerald-600" />}
                        <div>
                          <p className="font-medium capitalize">{addr.type}</p>
                          <p className="text-sm text-gray-600">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                          {addr.isDefault && (
                            <span className="text-xs text-emerald-600 font-medium">Default Address</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;