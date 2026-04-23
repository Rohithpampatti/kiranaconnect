import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Store, LogOut, ClipboardList, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    };
    
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const navLinks = [
    { name: 'Store', path: '/', show: true },
    { name: 'Wishlist', path: '/wishlist', show: isAuthenticated },
    { name: 'My Orders', path: '/orders', show: isAuthenticated },
    { name: 'Profile', path: '/profile', show: isAuthenticated },
    { name: 'Admin', path: '/admin', show: user?.role === 'admin' },
    { name: 'Delivery', path: '/delivery', show: user?.role === 'delivery' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Store className="text-white" size={24} />
          </div>
          <span className="text-2xl font-serif font-bold text-emerald-900">KiranaConnect</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => link.show && (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-emerald-600 ${location.pathname === link.path ? 'text-emerald-600' : 'text-slate-600'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search groceries..." 
              className="pl-10 pr-4 py-2 BG-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500/20 w-64 transition-all"
            />
          </div>
          
          {isAuthenticated ? (
            <>
              <Link to="/wishlist" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <Heart size={22} />
              </Link>
              
              <Link to="/cart" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <Link to="/orders" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <ClipboardList size={22} />
              </Link>
              
              <NotificationBell />
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-700">{user?.name?.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/cart" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link 
                to="/login"
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg shadow-emerald-600/20"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => link.show && (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-900"
                >
                  {link.name}
                </Link>
              ))}
              
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-900 flex items-center justify-between"
              >
                Cart
                {cartCount > 0 && (
                  <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <hr className="border-slate-100" />
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{user?.name}</p>
                      <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full border-2 border-emerald-600 text-emerald-600 py-4 rounded-xl font-bold text-center"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;