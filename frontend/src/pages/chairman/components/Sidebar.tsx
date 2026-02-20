import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PieChart, Users, AlertTriangle, Activity, 
  ShieldAlert, LogOut, Briefcase, Database 
} from 'lucide-react';
import { BrandLogo } from '../../../components/BrandLogo';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-900 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 mb-2">
        <BrandLogo className="w-10 h-10" />
        <div>
          <div className="text-lg font-bold tracking-wide text-white">Sentinel Bank</div>
          <div className="text-[10px] text-indigo-500 font-bold tracking-[0.2em] uppercase">Admin Panel</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <NavItem to="/chairman" icon={<PieChart />} label="Global Overview" active={isActive('/chairman')} />
        <NavItem to="/chairman/employees" icon={<Users />} label="Employee Management" active={isActive('/chairman/employees')} />
        <NavItem to="/chairman/users" icon={<Users />} label="User Management" active={isActive('/chairman/users')} />
        <NavItem to="/chairman/branches" icon={<Briefcase />} label="Branch Management" active={isActive('/chairman/branches')} />
        <NavItem to="/chairman/fraud" icon={<AlertTriangle />} label="Fraud Monitoring" active={isActive('/chairman/fraud')} />
        <NavItem to="/chairman/risk" icon={<Activity />} label="Risk Scoring" active={isActive('/chairman/risk')} />
        <NavItem to="/chairman/audit" icon={<ShieldAlert />} label="Audit Logs" active={isActive('/chairman/audit')} />
        <NavItem to="/chairman/transactions" icon={<Database />} label="Transaction Logs" active={isActive('/chairman/transactions')} />
      </div>

      <div className="p-4 border-t border-slate-900 mt-auto">
         <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-slate-900 to-black border border-slate-800 mb-3">
             <div className="text-xs text-slate-500 mb-1">Authenticated as</div>
             <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">AD</div>
                 <div className="text-sm font-medium text-white">Administrator</div>
             </div>
         </div>
         <button 
           onClick={() => {
             localStorage.removeItem('access_token');
             localStorage.removeItem('refresh_token');
             localStorage.removeItem('user');
             window.location.href = '/login';
           }}
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
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all 200 group ${
      active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900'
    }`}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
      <span className="font-medium text-sm tracking-wide">{label}</span>
    </Link>
  );
}
