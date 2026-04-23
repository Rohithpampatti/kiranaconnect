import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

interface WishlistItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  addedAt: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  loading: boolean;
  addToWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Load from localStorage if not logged in
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
        return;
      }
      
      const response = await api.get('/wishlist');
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: any) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Guest wishlist - save to localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        let currentWishlist: WishlistItem[] = savedWishlist ? JSON.parse(savedWishlist) : [];
        
        const existingItem = currentWishlist.find(item => item.productId === product._id);
        if (existingItem) {
          toast.info('Item already in wishlist');
          return;
        }
        
        const newItem: WishlistItem = {
          _id: Date.now().toString(),
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          unit: product.unit,
          addedAt: new Date().toISOString()
        };
        
        currentWishlist.push(newItem);
        localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
        setWishlist(currentWishlist);
        toast.success(`${product.name} added to wishlist`);
        return;
      }
      
      // Logged in user - save to backend
      const response = await api.post('/wishlist', { productId: product._id });
      setWishlist(response.data);
      toast.success(`${product.name} added to wishlist`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Guest wishlist - remove from localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          let currentWishlist = JSON.parse(savedWishlist);
          const removedItem = currentWishlist.find((item: WishlistItem) => item.productId === productId);
          currentWishlist = currentWishlist.filter((item: WishlistItem) => item.productId !== productId);
          localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
          setWishlist(currentWishlist);
          if (removedItem) {
            toast.success(`${removedItem.name} removed from wishlist`);
          }
        }
        return;
      }
      
      await api.delete(`/wishlist/${productId}`);
      setWishlist(wishlist.filter(item => item.productId !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.productId === productId);
  };

  const clearWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        localStorage.removeItem('wishlist');
        setWishlist([]);
        toast.info('Wishlist cleared');
        return;
      }
      
      await api.delete('/wishlist/clear');
      setWishlist([]);
      toast.info('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  const wishlistCount = wishlist.length;

  const value = {
    wishlist,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;