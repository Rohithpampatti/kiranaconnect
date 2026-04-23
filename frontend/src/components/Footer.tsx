import React from 'react';
import { Store, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Store className="text-white" size={24} />
            </div>
            <span className="text-2xl font-serif font-bold text-white">KiranaConnect</span>
          </div>
          <p className="text-sm leading-relaxed">
            Bringing the local Kirana experience to your doorstep with modern convenience and fresh quality.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-emerald-500 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Store Locator</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Delivery Areas</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Partner with Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Customer Service</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-emerald-500 transition-colors">My Account</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Track Order</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Help Center</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-emerald-500 shrink-0" />
              <span>123 Market Street, Sector 45, Gurgaon, Haryana 122003</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-emerald-500 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-emerald-500 shrink-0" />
              <span>support@kiranaconnect.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:row justify-between items-center gap-4 text-xs">
        <p>© 2026 KiranaConnect. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;