import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShieldAlert, BadgeCheck, PieChart, AlertTriangle, 
  FileSearch, ClipboardList, LogOut, ShieldCheck
} from 'lucide-react';

export default function ComplianceRiskSidebar({ user }: { user: any }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { to: '/employee', icon: <LayoutDashboard />, label: 'Compliance Dashboard' },
    { to: '/employee/aml', icon: <ShieldAlert />, label: 'AML Alerts' },
    { to: '/employee/kyc-compliance', icon: <BadgeCheck />, label: 'KYC Compliance' },
    { to: '/employee/risk-reports', icon: <PieChart />, label: 'Risk Reports' },
    { to: '/employee/suspicious', icon: <AlertTriangle />, label: 'Suspicious Transactions' },
    { to: '/employee/regulatory', icon: <FileSearch />, label: 'Regulatory Reports' },
    { to: '/employee/policies', icon: <ClipboardList />, label: 'Policy Updates' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50 animate-in slide-in-from-left duration-500">
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div className="overflow-hidden">
           <div className="text-xl font-bold text-white tracking-tight">Sentinel X</div>
           <div className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase truncate">Compliance & Risk</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-4 pb-20 custom-scrollbar">
        <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Safety & Protocols</div>
        <div className="space-y-1">
          {menuItems.map((item, idx) => (
            <Link key={idx} to={item.to} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
              isActive(item.to) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}>
              {React.cloneElement(item.icon as React.ReactElement, { className: `w-4 h-4 ${isActive(item.to) ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}` })}
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-900 mt-auto bg-slate-950">
         <div className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 mb-3 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                {user?.firstName?.charAt(0) || 'E'}
             </div>
             <div className="overflow-hidden text-left">
                 <div className="text-sm font-medium text-white truncate">{user?.firstName}</div>
                 <div className="text-[10px] text-slate-500 truncate font-mono">{user?.branch || 'Branch ID: Pending'}</div>
             </div>
         </div>
         <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Logout</span>
         </button>
      </div>
    </nav>
  );
}
