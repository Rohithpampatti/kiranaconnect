import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-serif font-bold text-emerald-600/20">404</h1>
          <div className="relative -mt-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h2>
            <p className="text-slate-600">Oops! The aisle you're looking for doesn't exist in our store.</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <Link 
            to="/" 
            className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20"
          >
            <Home size={20} /> Back to Store
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="text-slate-600 font-bold flex items-center justify-center gap-2 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft size={20} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}