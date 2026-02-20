import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Lock, Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Ticker */}
      <div className="bg-indigo-900 text-indigo-100 text-xs font-medium py-2 px-4 text-center tracking-wide">
         <span className="inline-block animate-pulse mr-2">●</span> 
         Special Offer: Get 4.50% APY on High-Yield Savings Accounts opened before Oct 31st! 
         <Link to="/savings" className="underline ml-2 hover:text-white">Learn More</Link>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3">
              <BrandLogo />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
                Sentinel Bank
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-8">
              <div className="relative group">
                 <button className="flex items-center gap-1 font-medium text-slate-600 hover:text-indigo-600 py-4">
                    Personal <ChevronDown className="w-4 h-4" />
                 </button>
                 <div className="absolute top-full left-0 w-48 bg-white border border-slate-100 shadow-xl rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                    <Link to="/savings" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-600 hover:text-indigo-600">Savings Account</Link>
                    <Link to="/loans" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-600 hover:text-indigo-600">Loans</Link>
                    <Link to="/cards" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm text-slate-600 hover:text-indigo-600">Credit Cards</Link>
                 </div>
              </div>
              <Link to="/current" className="font-medium text-slate-600 hover:text-indigo-600 transition">Business</Link>
              <Link to="/investments" className="font-medium text-slate-600 hover:text-indigo-600 transition">Investments</Link>
              <Link to="/locations" className="font-medium text-slate-600 hover:text-indigo-600 transition">Locations</Link>
              <Link to="/blog" className="font-medium text-slate-600 hover:text-indigo-600 transition">Resources</Link>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login" className="text-slate-600 font-medium hover:text-indigo-600 transition flex items-center gap-2">
                 <Lock className="w-4 h-4" /> Login
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 font-medium hover:-translate-y-0.5 transform">
                Open Account
              </Link>
            </div>
            
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
