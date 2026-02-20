import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

// Import all 14 specialized sidebars
import BranchManagerSidebar from './roles/branch_manager/Sidebar';
import AssistantManagerSidebar from './roles/assistant_manager/Sidebar';
import TellerSidebar from './roles/teller/Sidebar';
import CashierSidebar from './roles/cashier/Sidebar';
import LoanOfficerSidebar from './roles/loan_officer/Sidebar';
import RelationshipManagerSidebar from './roles/relationship_manager/Sidebar';
import CustomerServiceSidebar from './roles/customer_service/Sidebar';
import OperationsStaffSidebar from './roles/operations_staff/Sidebar';
import ComplianceOfficerSidebar from './roles/compliance_officer/Sidebar';
import ITSupportSidebar from './roles/it_support/Sidebar';
import AccountantSidebar from './roles/accountant/Sidebar';
import AuditOfficerSidebar from './roles/audit_officer/Sidebar';
import SecurityOfficerSidebar from './roles/security_officer/Sidebar';
import AdministrationSidebar from './roles/administration/Sidebar';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
  branchId?: string;
  branch?: string;
  employeeId?: string;
}

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Sidebar Selection Logic
  const ActiveSidebar = useMemo(() => {
    if (!user) return null;
    const role = user.role;

    if (['branch_manager'].includes(role)) return BranchManagerSidebar;
    if (['assistant_manager'].includes(role)) return AssistantManagerSidebar;
    if (['teller'].includes(role)) return TellerSidebar;
    if (['cashier'].includes(role)) return CashierSidebar;
    if (role === 'loan_officer') return LoanOfficerSidebar;
    if (role === 'relationship_manager') return RelationshipManagerSidebar;
    if (role === 'customer_service') return CustomerServiceSidebar;
    if (role === 'operations_staff') return OperationsStaffSidebar;
    if (role === 'compliance_officer') return ComplianceOfficerSidebar;
    if (role === 'it_support') return ITSupportSidebar;
    if (role === 'accountant') return AccountantSidebar;
    if (role === 'audit_officer') return AuditOfficerSidebar;
    if (role === 'security_officer') return SecurityOfficerSidebar;
    if (role === 'administration') return AdministrationSidebar;

    return null;
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://13.201.79.48:8000/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUser(data);
      } catch (err) {
        localStorage.removeItem('access_token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      {ActiveSidebar && <ActiveSidebar user={user} />}
      {!ActiveSidebar && (
         <div className="fixed left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800 flex items-center justify-center p-8 text-center">
            <p className="text-xs text-slate-500 italic">No specialized sidebar configuration found for {user?.role}</p>
         </div>
      )}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 h-20 px-8 flex justify-between items-center">
            <div>
               <h1 className="text-xl font-bold tracking-tight text-white capitalize">
                  {user?.role?.replace('_', ' ')} Portal
               </h1>
               <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  {user?.branch || 'Main Branch'}
               </div>
            </div>
            
            <div className="flex items-center gap-6">
                 <div className="relative group flex items-center bg-slate-900/50 border border-slate-800 rounded-full px-4 py-1.5 focus-within:border-indigo-500 transition-all">
                    <Search className="w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="bg-transparent border-none focus:ring-0 text-sm w-40 placeholder:text-slate-600"
                    />
                 </div>
                 
                 <div className="flex items-center gap-4">
                     <button className="relative p-2 text-slate-400 hover:text-indigo-400 transition hover:bg-slate-900 rounded-lg">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
                     </button>
                     <button className="p-2 text-slate-400 hover:text-indigo-400 transition hover:bg-slate-900 rounded-lg">
                        <Settings className="w-5 h-5" />
                     </button>
                 </div>

                 <div className="h-8 w-px bg-slate-800 mx-2"></div>
                 
                 <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-semibold text-slate-200 leading-none">{user?.firstName} {user?.lastName}</span>
                        <span className="text-[10px] text-slate-500 font-mono mt-1">{user?.employeeId}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20 text-white">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                 </div>
            </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
           <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}
