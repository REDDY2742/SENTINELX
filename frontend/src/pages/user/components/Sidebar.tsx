import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { Home, PieChart, CreditCard, Settings, LogOut, DollarSign, FileText, Send } from 'lucide-react';
import { useCurrency } from '../../../context/CurrencyContext';
import { BrandLogo } from '../../../components/BrandLogo';

export default function Sidebar({ balance = 0 }: { balance?: number | string }) {
  const { formatAmount } = useCurrency();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <BrandLogo className="w-9 h-9" />
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Sentinel Bank
        </span>
      </div>

      <div className="px-4 mb-6">
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Balance</p>
              <p className="text-lg font-mono font-bold text-white">
                {formatAmount(Number(balance))}
              </p>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        <NavItem to="/user" icon={<Home className="w-5 h-5" />} label="Overview" active={isActive('/user')} />
        <NavItem to="/user/transactions" icon={<FileText className="w-5 h-5" />} label="Transactions" active={isActive('/user/transactions')} />
        <NavItem to="/user/transfer" icon={<Send className="w-5 h-5" />} label="Fund Transfer" active={isActive('/user/transfer')} />
        <NavItem to="/user/bill-pay" icon={<DollarSign className="w-5 h-5" />} label="Bill Payments" active={isActive('/user/bill-pay')} />
        <NavItem to="/user/investments" icon={<PieChart className="w-5 h-5" />} label="Investments" active={isActive('/user/investments')} />
        <NavItem to="/user/loans" icon={<CreditCard className="w-5 h-5" />} label="Loans" active={isActive('/user/loans')} />
        <NavItem to="/user/profile" icon={<Settings className="w-5 h-5" />} label="Settings" active={isActive('/user/profile')} />
      </div>

      <div className="p-4 border-t border-slate-800">
         <button 
           onClick={handleLogout}
           className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-slate-900 hover:text-red-300 transition-colors"
         >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
         </button>
      </div>
    </nav>
  );
}

function NavItem({ icon, label, to, active }: { icon: React.ReactNode, label: string, to: string, active: boolean }) {
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
    }`}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
    </Link>
  );
}
