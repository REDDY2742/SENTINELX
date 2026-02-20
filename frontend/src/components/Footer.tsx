import { Link } from 'react-router-dom';
import { Phone, MapPin, Globe } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export default function Footer() {
  return (
      <footer className="bg-slate-950 text-slate-400 pt-20 pb-12 border-t border-slate-900">
        <div className="max-w-[95%] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
           <div className="col-span-1 md:col-span-1">
             <Link to="/" className="flex items-center gap-2 mb-6">
                <BrandLogo className="w-8 h-8" />
                <span className="text-xl font-bold text-white">Sentinel Bank</span>
             </Link>
             <p className="text-sm leading-relaxed mb-6">
                Empowering your financial journey with secure, smart, and simple banking solutions. Member FDIC.
             </p>
             <div className="flex gap-4">
                 <SocialIcon /> <SocialIcon /> <SocialIcon />
             </div>
           </div>
           
           <div>
             <h4 className="text-white font-bold mb-6">Products</h4>
             <ul className="space-y-3 text-sm">
               <li><Link to="/savings" className="hover:text-indigo-400 transition">Savings</Link></li>
               <li><Link to="/current" className="hover:text-indigo-400 transition">Checking</Link></li>
               <li><Link to="/cards" className="hover:text-indigo-400 transition">Credit Cards</Link></li>
               <li><Link to="/loans" className="hover:text-indigo-400 transition">Loans</Link></li>
             </ul>
           </div>
           
           <div>
             <h4 className="text-white font-bold mb-6">Company</h4>
             <ul className="space-y-3 text-sm">
               <li><Link to="/about" className="hover:text-indigo-400 transition">About Us</Link></li>
               <li><Link to="/careers" className="hover:text-indigo-400 transition">Careers</Link></li>
               <li><Link to="/blog" className="hover:text-indigo-400 transition">Blog</Link></li>
               <li><Link to="/press" className="hover:text-indigo-400 transition">Press</Link></li>
             </ul>
           </div>
           
           <div>
             <h4 className="text-white font-bold mb-6">Contact</h4>
             <ul className="space-y-3 text-sm">
               <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-indigo-500" /> 1-800-SENTINEL</li>
               <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-indigo-500" /> 100 Wall Street, NY</li>
               <li className="flex items-center gap-3"><Globe className="w-4 h-4 text-indigo-500" /> help@sentinel.com</li>
             </ul>
           </div>
        </div>
        
        <div className="max-w-[95%] mx-auto px-4 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
           <p>© 2026 Sentinel Bank Inc. All rights reserved.</p>
           <div className="flex gap-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-slate-400">Privacy Policy</a>
               <a href="#" className="hover:text-slate-400">Terms of Service</a>
               <a href="#" className="hover:text-slate-400">Security</a>
           </div>
        </div>
      </footer>
  );
}

function SocialIcon() {
    return (
        <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">
            <Globe className="w-4 h-4 text-white" />
        </div>
    )
}
