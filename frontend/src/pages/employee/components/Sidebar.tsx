import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { 
  LayoutDashboard, Users, FileText, ArrowLeftRight, 
  Lock, Cpu, BarChart3, Settings, 
  LogOut, MapPin, Receipt, Wallet, Banknote,
  TrendingUp, CheckSquare, ClipboardList, Target,
  MessageSquare, UserCheck, CreditCard, PieChart,
  History, Settings2, FileSearch, ShieldAlert,
  Server, Ticket, Database, BadgeCheck, Camera,
  AlertTriangle, Calendar, Package, Truck, UserPlus,
  Briefcase, Activity, ShieldCheck
} from 'lucide-react';
import { BrandLogo } from '../../../components/BrandLogo';

interface SidebarProps {
  user: any;
}

const Clock = ({ className }: { className?: string }) => <History className={className} />;

// Sidebar Configuration for all 12 modules
const ROLE_SIDEBAR_CONFIG: Record<string, any> = {
  'branch_management': {
    title: 'Branch Management',
    icon: <MapPin />,
    roles: ['branch_manager', 'assistant_manager'],
    items: [
      { to: '/employee', icon: <LayoutDashboard />, label: 'Dashboard Overview' },
      { to: '/employee/performance', icon: <Target />, label: 'Branch Performance' },
      { to: '/employee/approvals', icon: <CheckSquare />, label: 'Approvals' },
      { to: '/employee/staff', icon: <Users />, label: 'Staff Management' },
      { to: '/employee/targets', icon: <TrendingUp />, label: 'Target Tracking' },
      { to: '/employee/reports', icon: <ClipboardList />, label: 'Reports' },
      { to: '/employee/escalations', icon: <MessageSquare />, label: 'Customer Escalations' },
      { to: '/employee/compliance', icon: <ShieldCheck />, label: 'Compliance Summary' },
      { to: '/employee/settings', icon: <Settings />, label: 'Settings' }
    ]
  },
  'cash_transactions': {
    title: 'Cash & Transactions',
    icon: <Wallet />,
    roles: ['teller', 'cashier'],
    items: [
      { to: '/employee', icon: <LayoutDashboard />, label: 'Dashboard' },
      { to: '/employee/deposit', icon: <Banknote />, label: 'Cash Deposit' },
      { to: '/employee/withdrawal', icon: <CreditCard />, label: 'Cash Withdrawal' },
      { to: '/employee/transfer', icon: <ArrowLeftRight />, label: 'Fund Transfer' },
      { to: '/employee/cheque', icon: <Receipt />, label: 'Cheque Processing' },
      { to: '/employee/logs', icon: <History />, label: 'Daily Transaction Log' },
      { to: '/employee/balance', icon: <PieChart />, label: 'Cash Balance' },
      { to: '/employee/closing', icon: <Clock />, label: 'End-of-Day Closing' },
      { to: '/employee/pending', icon: <Clock />, label: 'Pending Transactions' }
    ]
  },
  'credit_loans': {
    title: 'Credit & Loans',
    icon: <FileText />,
    roles: ['loan_officer'],
    items: [
      { to: '/employee', icon: <PieChart />, label: 'Loan Dashboard' },
      { to: '/employee/loan-new', icon: <UserPlus />, label: 'New Loan Application' },
      { to: '/employee/loan-verify', icon: <UserCheck />, label: 'Loan Verification' },
      { to: '/employee/loan-queue', icon: <ClipboardList />, label: 'Loan Approval Queue' },
      { to: '/employee/emi', icon: <Calendar />, label: 'EMI Schedule' },
      { to: '/employee/overdue', icon: <AlertTriangle />, label: 'Overdue Loans' },
      { to: '/employee/npa', icon: <ShieldAlert />, label: 'NPA Accounts' },
      { to: '/employee/loan-reports', icon: <BarChart3 />, label: 'Loan Reports' }
    ]
  },
  'retail_banking': {
    title: 'Retail Banking',
    icon: <Briefcase />,
    roles: ['relationship_manager'],
    items: [
      { to: '/employee', icon: <LayoutDashboard />, label: 'Dashboard' },
      { to: '/employee/portfolio', icon: <Users />, label: 'Customer Portfolio' },
      { to: '/employee/account-new', icon: <UserPlus />, label: 'New Account Opening' },
      { to: '/employee/fd-rd', icon: <Banknote />, label: 'FD / RD Management' },
      { to: '/employee/cross-sell', icon: <Target />, label: 'Cross-Sell Products' },
      { to: '/employee/followups', icon: <MessageSquare />, label: 'Customer Follow-ups' },
      { to: '/employee/revenue', icon: <TrendingUp />, label: 'Revenue Tracking' },
      { to: '/employee/insights', icon: <BarChart3 />, label: 'Customer Insights' }
    ]
  },
  'customer_relations': {
    title: 'Customer Relations',
    icon: <MessageSquare />,
    roles: ['customer_service'],
    items: [
      { to: '/employee', icon: <LayoutDashboard />, label: 'Customer Dashboard' },
      { to: '/employee/kyc-update', icon: <UserCheck />, label: 'KYC Updates' },
      { to: '/employee/service-requests', icon: <Ticket />, label: 'Service Requests' },
      { to: '/employee/complaints', icon: <AlertTriangle />, label: 'Complaints Management' },
      { to: '/employee/modifications', icon: <Settings2 />, label: 'Account Modifications' },
      { to: '/employee/history', icon: <History />, label: 'Customer History' }
    ]
  },
  'operations': {
    title: 'Operations',
    icon: <Settings />,
    roles: ['operations_staff'],
    items: [
      { to: '/employee', icon: <LayoutDashboard />, label: 'Dashboard' },
      { to: '/employee/daily-ops', icon: <Clock />, label: 'Daily Operations' },
      { to: '/employee/processing', icon: <Cpu />, label: 'Account Processing' },
      { to: '/employee/verify', icon: <ShieldCheck />, label: 'Document Verification' },
      { to: '/employee/monitoring', icon: <Activity />, label: 'Transaction Monitoring' },
      { to: '/employee/logistics', icon: <Truck />, label: 'Branch Logistics' },
      { to: '/employee/ops-reports', icon: <ClipboardList />, label: 'Operations Reports' }
    ]
  },
  'compliance_risk': {
    title: 'Compliance & Risk',
    icon: <ShieldCheck />,
    roles: ['compliance_officer'],
    items: [
      { to: '/employee', icon: <LayoutDashboard />, label: 'Compliance Dashboard' },
      { to: '/employee/aml', icon: <ShieldAlert />, label: 'AML Alerts' },
      { to: '/employee/kyc-compliance', icon: <BadgeCheck />, label: 'KYC Compliance' },
      { to: '/employee/risk-reports', icon: <PieChart />, label: 'Risk Reports' },
      { to: '/employee/suspicious', icon: <AlertTriangle />, label: 'Suspicious Transactions' },
      { to: '/employee/regulatory', icon: <FileSearch />, label: 'Regulatory Reports' },
      { to: '/employee/policies', icon: <ClipboardList />, label: 'Policy Updates' }
    ]
  },
  'it_support': {
    title: 'IT Support',
    icon: <Cpu />,
    roles: ['it_support'],
    items: [
      { to: '/employee', icon: <Server />, label: 'System Dashboard' },
      { to: '/employee/users', icon: <Users />, label: 'User Management' },
      { to: '/employee/access', icon: <Lock />, label: 'Access Control' },
      { to: '/employee/server', icon: <Cpu />, label: 'Server Status' },
      { to: '/employee/tickets', icon: <Ticket />, label: 'Ticketing System' },
      { to: '/employee/backups', icon: <Database />, label: 'Backup Logs' },
      { to: '/employee/security-logs', icon: <ShieldAlert />, label: 'Security Logs' }
    ]
  },
  'finance': {
    title: 'Finance & Accounts',
    icon: <BarChart3 />,
    roles: ['accountant'],
    items: [
      { to: '/employee', icon: <LayoutDashboard />, label: 'Financial Dashboard' },
      { to: '/employee/expenses', icon: <Receipt />, label: 'Expense Tracking' },
      { to: '/employee/income', icon: <TrendingUp />, label: 'Income Reports' },
      { to: '/employee/gl', icon: <Database />, label: 'GL Management' },
      { to: '/employee/tax', icon: <FileSearch />, label: 'Tax Reports' },
      { to: '/employee/budget', icon: <PieChart />, label: 'Budget Planning' },
      { to: '/employee/payroll', icon: <Users />, label: 'Payroll' }
    ]
  },
  'audit': {
    title: 'Internal Audit',
    icon: <FileSearch />,
    roles: ['audit_officer'],
    items: [
      { to: '/employee', icon: <LayoutDashboard />, label: 'Audit Dashboard' },
      { to: '/employee/audit-reports', icon: <ClipboardList />, label: 'Audit Reports' },
      { to: '/employee/audit-tx', icon: <History />, label: 'Transaction Audit' },
      { to: '/employee/audit-loan', icon: <Briefcase />, label: 'Loan Audit' },
      { to: '/employee/audit-comp', icon: <BadgeCheck />, label: 'Compliance Audit' },
      { to: '/employee/risk-findings', icon: <ShieldAlert />, label: 'Risk Findings' },
      { to: '/employee/audit-history', icon: <History />, label: 'Audit History' }
    ]
  },
  'security': {
    title: 'Security',
    icon: <Camera />,
    roles: ['security_officer'],
    items: [
      { to: '/employee', icon: <LayoutDashboard />, label: 'Security Dashboard' },
      { to: '/employee/cctv', icon: <Camera />, label: 'CCTV Monitoring' },
      { to: '/employee/visitors', icon: <Users />, label: 'Visitor Logs' },
      { to: '/employee/incidents', icon: <AlertTriangle />, label: 'Incident Reports' },
      { to: '/employee/access-logs', icon: <History />, label: 'Access Logs' },
      { to: '/employee/emergency', icon: <ShieldAlert />, label: 'Emergency Alerts' }
    ]
  },
  'administration': {
    title: 'Administration',
    icon: <Briefcase />,
    roles: ['administration'],
    items: [
      { to: '/employee', icon: <LayoutDashboard />, label: 'Admin Dashboard' },
      { to: '/employee/staff-records', icon: <Users />, label: 'Staff Records' },
      { to: '/employee/leave', icon: <Calendar />, label: 'Leave Management' },
      { to: '/employee/assets', icon: <Package />, label: 'Asset Management' },
      { to: '/employee/vendors', icon: <Truck />, label: 'Vendor Management' },
      { to: '/employee/notices', icon: <MessageSquare />, label: 'Internal Notices' }
    ]
  }
};


export default function Sidebar({ user }: SidebarProps) {
  const location = useLocation();
  const role = user?.role || '';
  
  // Find the module configuration for this user's role
  const moduleKey = Object.keys(ROLE_SIDEBAR_CONFIG).find(key => 
    ROLE_SIDEBAR_CONFIG[key].roles.includes(role)
  );

  const config = moduleKey ? ROLE_SIDEBAR_CONFIG[moduleKey] : null;
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 mb-2">
        <BrandLogo className="w-10 h-10" />
        <div className="overflow-hidden">
           <div className="text-xl font-bold text-white tracking-tight">Sentinel Bank</div>
           <div className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase truncate">
              {config?.title || role.replace('_', ' ')}
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-4 pb-20 custom-scrollbar">
        {config ? (
          <div>
            <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              My Workspace
            </div>
            <div className="space-y-1">
              {config.items.map((item: any, idx: number) => (
                <NavItem 
                  key={idx} 
                  to={item.to} 
                  icon={item.icon} 
                  label={item.label} 
                  active={isActive(item.to)} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 py-8 text-center bg-slate-900/50 rounded-xl m-2">
            <p className="text-xs text-slate-500 italic">No role configuration found for {role}</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-900 mt-auto bg-slate-950">
         <div className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 mb-3 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                {user?.firstName?.charAt(0) || 'E'}
             </div>
             <div className="overflow-hidden">
                 <div className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</div>
                 <div className="text-[10px] text-slate-500 truncate font-mono">{user?.branch || 'Branch ID: Pending'}</div>
             </div>
         </div>
         <button 
           onClick={handleLogout}
           className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
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
    <Link to={to} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
    }`}>
      {React.cloneElement(icon as React.ReactElement, { className: `w-4 h-4 ${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}` })}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
