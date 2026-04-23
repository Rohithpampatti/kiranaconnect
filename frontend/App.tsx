import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './src/pages/Home';
import Admin from './src/pages/Admin';
import AdminPanel from './src/pages/AdminPanel';
import Delivery from './src/pages/Delivery';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Cart from './src/pages/Cart';
import Checkout from './src/pages/Checkout';
import Orders from './src/pages/Orders';
import Profile from './src/pages/Profile';
import ProductDetails from './src/pages/ProductDetails';
import Wishlist from './src/pages/Wishlist';
import NotFound from './src/pages/NotFound';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import InstallPrompt from './src/components/InstallPrompt';
import { AuthProvider } from './src/context/AuthContext';
import { WishlistProvider } from './src/context/WishlistContext';
import PaymentQR from './src/pages/PaymentQR';
import OrderConfirmation from './src/pages/OrderConfirmation';
import TrackOrder from './src/pages/TrackOrder';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <Theme appearance="light" accentColor="emerald" radius="large">
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
              <Header />
              <main className="flex-grow pt-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin-panel" element={<AdminPanel />} />
                  <Route path="/delivery" element={<Delivery />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/payment-qr" element={<PaymentQR />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/track-order/:orderId" element={<TrackOrder />} />
                </Routes>
              </main>
              <Footer />
              <InstallPrompt />
              <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </Router>
        </Theme>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;