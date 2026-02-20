import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { 
  BarChart2, Users, FileText, Briefcase, Activity, 
  LogOut, ShieldAlert, BadgeCheck
} from 'lucide-react';

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <Briefcase className="w-6 h-6 text-white" />
        </div>
        <div>
           <div className="text-xl font-bold text-white tracking-tight">Sentinel X</div>
           <div className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Branch Manager</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Main Menu</div>
        <NavItem to="/manager" icon={<BarChart2 />} label="Dashboard" active={isActive('/manager')} />
        <NavItem to="/manager/customers" icon={<Users />} label="Customers" active={isActive('/manager/customers')} />
        <NavItem to="/manager/loans" icon={<FileText />} label="Loan Approvals" active={isActive('/manager/loans')} />
        
        <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6">Risk & Compliance</div>
        <NavItem to="/manager/fraud" icon={<ShieldAlert />} label="Fraud Alerts" active={isActive('/manager/fraud')} />
        <NavItem to="/manager/transactions" icon={<Activity />} label="Transactions" active={isActive('/manager/transactions')} />
        <NavItem to="/manager/performance" icon={<BadgeCheck />} label="Branch Performance" active={isActive('/manager/performance')} />
      </div>

      <div className="p-4 border-t border-slate-900 mt-auto">
         <div className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 mb-3 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                {user?.firstName?.charAt(0) || 'M'}
             </div>
             <div className="overflow-hidden">
                 <div className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</div>
                 <div className="text-xs text-slate-500 truncate">Branch ID: {user?.branchId || 'BR-8821'}</div>
             </div>
         </div>
         <button 
           onClick={handleLogout}
           className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
         >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Logout</span>
         </button>
      </div>
    </nav>
  );
}

function NavItem({ icon, label, to, active }: { icon: React.ReactNode, label: string, to: string, active: boolean }) {
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
    }`}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
