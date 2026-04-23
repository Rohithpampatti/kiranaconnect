import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist, loading } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (item: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((i: any) => i.id === item.productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        unit: item.unit
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${item.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-20">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <Heart className="h-24 w-24 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save your favorite items here</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Start Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
          <button
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/product/${item.productId}`}>
                <img
                  src={item.image || `https://placehold.co/400x400/emerald/white?text=${item.name}`}
                  alt={item.name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${item.productId}`}>
                  <h3 className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                <p className="text-emerald-600 font-bold text-xl mt-2">₹{item.price}</p>
                <p className="text-xs text-gray-400">per {item.unit}</p>
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;