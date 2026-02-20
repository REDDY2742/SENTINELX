import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/public/Home';
import Banking from './pages/public/Banking';
import Savings from './pages/public/Savings';
import Current from './pages/public/Current';
import CreditCards from './pages/public/CreditCards';
import Loans from './pages/public/Loans';
import Investments from './pages/public/Investments';
import Calculators from './pages/public/Calculators';
import Locations from './pages/public/Locations';
import Blog from './pages/public/Blog';
import AboutUs from './pages/public/AboutUs';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// User Dashboard Modules
import UserLayout from './pages/user/UserLayout';
import UserOverview from './pages/user/UserOverview';
import Transactions from './pages/user/Transactions';
import Transfers from './pages/user/Transfers';
import BillPay from './pages/user/BillPay';
import UserInvestments from './pages/user/Investments';
import UserLoans from './pages/user/Loans';
import ApplyLoan from './pages/user/ApplyLoan';
import Profile from './pages/user/Profile';

import BranchCustomers from './pages/manager/BranchCustomers';
import BranchLoanApprovals from './pages/manager/BranchLoanApprovals';
import BranchFraudAlerts from './pages/manager/BranchFraudAlerts';
import BranchTransactions from './pages/manager/BranchTransactions';

// Chairman / Admin Modules
import ChairmanLayout from './pages/chairman/ChairmanLayout';
import Overview from './pages/chairman/Overview';
import EmployeeManagement from './pages/chairman/EmployeeManagement';
import Branches from './pages/chairman/Branches';
import BranchDetails from './pages/chairman/BranchDetails';
import UserManagement from './pages/chairman/UserManagement';
import FraudMonitoring from './pages/chairman/FraudMonitoring';
import AuditLogs from './pages/chairman/AuditLogs';
import TransactionLogs from './pages/chairman/TransactionLogs';
import RiskDashboard from './pages/chairman/RiskDashboard';

// Employee / Staff Portal
import EmployeeLayout from './pages/employee/EmployeeLayout';
import EmployeeDashboard from './pages/employee/Dashboard';
import Placeholder from './pages/employee/components/Placeholder';

// Cashier Module Imports
import CashWithdrawal from './pages/employee/modules/CashTransactions/Withdrawal';
import CashDeposit from './pages/employee/modules/CashTransactions/Deposit';
import FundTransfer from './pages/employee/modules/CashTransactions/Transfer';
import ChequeProcessing from './pages/employee/modules/CashTransactions/Cheque';
import EmployeeTransactionLogs from './pages/employee/modules/CashTransactions/Logs';
import CashBalance from './pages/employee/modules/CashTransactions/Balance';
import DayEndClosing from './pages/employee/modules/CashTransactions/Closing';

// Branch Management Module Imports
import EmployeeBranchPerformance from './pages/employee/modules/BranchManagement/Performance';
import ApprovalQueue from './pages/employee/modules/BranchManagement/Approvals';
import StaffDirectory from './pages/employee/modules/BranchManagement/Staff';
import TargetTracking from './pages/employee/modules/BranchManagement/Targets';
import BranchReports from './pages/employee/modules/BranchManagement/Reports';
import EscalationsDesk from './pages/employee/modules/BranchManagement/Escalations';
import BranchCompliance from './pages/employee/modules/BranchManagement/Compliance';
import BranchSettings from './pages/employee/modules/BranchManagement/Settings';

// Credit & Loans Module Imports
import NewLoanApplication from './pages/employee/modules/CreditLoans/NewApplication';
import LoanVerification from './pages/employee/modules/CreditLoans/Verification';
import LoanAppraisalQueue from './pages/employee/modules/CreditLoans/Queue';

// Retail Banking Module Imports
import NewAccountOpening from './pages/employee/modules/RetailBanking/NewAccount';

// Customer Relations Module Imports
import KYCUpdate from './pages/employee/modules/CustomerRelations/KYCUpdate';
import ServiceRequests from './pages/employee/modules/CustomerRelations/ServiceRequests';

// Operations Module Imports
import AccountProcessing from './pages/employee/modules/Operations/Processing';

// Compliance & Risk Module Imports
import ComplianceMonitoring from './pages/employee/modules/ComplianceRisk/Compliance';

// IT Support Module Imports
import ITSupportTickets from './pages/employee/modules/ITSupport/Tickets';
import AccessControl from './pages/employee/modules/ITSupport/AccessControl';

// Finance Module Imports
import BranchExpenses from './pages/employee/modules/Finance/Expenses';
import StaffPayroll from './pages/employee/modules/Finance/Payroll';

// Internal Audit Module Imports
import InternalAudit from './pages/employee/modules/InternalAudit/AuditReports';

// Security Module Imports
import SecurityCCTV from './pages/employee/modules/Security/CCTV';

// Administration Module Imports
import InternalNotices from './pages/employee/modules/Administration/Notices';
import StaffRecords from './pages/employee/modules/Administration/StaffRecords';
import LeaveManagement from './pages/employee/modules/Administration/LeaveManagement';
import AssetManagement from './pages/employee/modules/Administration/AssetManagement';
import VendorManagement from './pages/employee/modules/Administration/VendorManagement';
import AdminOverview from './pages/employee/modules/Administration/Overview';
import VendorDetail from './pages/employee/modules/Administration/VendorDetail';
import VendorOnboarding from './pages/employee/modules/Administration/VendorOnboarding';

import { WebSocketProvider } from './context/WebSocketContext';

export default function App() {
  return (
    <WebSocketProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/banking" element={<Banking />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/current" element={<Current />} />
          <Route path="/cards" element={<CreditCards />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* User Dashboard Routes */}
        <Route path="/user" element={<UserLayout />}>
           <Route index element={<UserOverview />} />
           <Route path="transactions" element={<Transactions />} />
           <Route path="transfer" element={<Transfers />} />
           <Route path="bill-pay" element={<BillPay />} />
           <Route path="investments" element={<UserInvestments />} />
           <Route path="loans" element={<UserLoans />} />
           <Route path="loans/apply" element={<ApplyLoan />} />
           <Route path="profile" element={<Profile />} />
        </Route>

         <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboard />} />
            
            {/* Branch Management */}
            <Route path="performance" element={<EmployeeBranchPerformance />} />
            <Route path="approvals" element={<ApprovalQueue />} />
            <Route path="staff" element={<StaffDirectory />} />
            <Route path="targets" element={<TargetTracking />} />
            <Route path="reports" element={<BranchReports />} />
            <Route path="escalations" element={<EscalationsDesk />} />
            <Route path="compliance" element={<BranchCompliance />} />
            <Route path="settings" element={<BranchSettings />} />

            {/* Cash & Transactions */}
            <Route path="deposit" element={<CashDeposit />} />
            <Route path="withdrawal" element={<CashWithdrawal />} />
            <Route path="transfer" element={<FundTransfer />} />
            <Route path="cheque" element={<ChequeProcessing />} />
            <Route path="logs" element={<EmployeeTransactionLogs />} />
            <Route path="balance" element={<CashBalance />} />
            <Route path="closing" element={<DayEndClosing />} />
            <Route path="pending" element={<EmployeeTransactionLogs />} />

            {/* Credit & Loans */}
            <Route path="loan-new" element={<NewLoanApplication />} />
            <Route path="loan-verify" element={<LoanVerification />} />
            <Route path="loan-queue" element={<LoanAppraisalQueue />} />
            <Route path="emi" element={<Placeholder title="EMI Schedule" />} />
            <Route path="overdue" element={<Placeholder title="Overdue Loans" />} />
            <Route path="npa" element={<Placeholder title="NPA Accounts" />} />
            <Route path="loan-reports" element={<Placeholder title="Loan Reports" />} />

            {/* Retail Banking */}
            <Route path="portfolio" element={<Placeholder title="Customer Portfolio" />} />
            <Route path="account-new" element={<NewAccountOpening />} />
            <Route path="fd-rd" element={<Placeholder title="FD / RD Management" />} />
            <Route path="cross-sell" element={<Placeholder title="Cross-Sell Products" />} />
            <Route path="followups" element={<Placeholder title="Customer Follow-ups" />} />
            <Route path="revenue" element={<Placeholder title="Revenue Tracking" />} />
            <Route path="insights" element={<Placeholder title="Customer Insights" />} />

            {/* Customer Relations */}
            <Route path="kyc-update" element={<KYCUpdate />} />
            <Route path="service-requests" element={<ServiceRequests />} />
            <Route path="complaints" element={<Placeholder title="Complaints Management" />} />
            <Route path="modifications" element={<Placeholder title="Account Modifications" />} />
            <Route path="history" element={<Placeholder title="Customer History" />} />

            {/* Operations */}
            <Route path="daily-ops" element={<Placeholder title="Daily Operations" />} />
            <Route path="processing" element={<AccountProcessing />} />
            <Route path="verify" element={<Placeholder title="Document Verification" />} />
            <Route path="monitoring" element={<Placeholder title="Transaction Monitoring" />} />
            <Route path="logistics" element={<Placeholder title="Branch Logistics" />} />
            <Route path="ops-reports" element={<Placeholder title="Operations Reports" />} />

            {/* Compliance & Risk */}
            <Route path="aml" element={<Placeholder title="AML Alerts" />} />
            <Route path="kyc-compliance" element={<Placeholder title="KYC Compliance" />} />
            <Route path="risk-reports" element={<Placeholder title="Risk Reports" />} />
            <Route path="suspicious" element={<Placeholder title="Suspicious Transactions" />} />
            <Route path="regulatory" element={<Placeholder title="Regulatory Reports" />} />
            <Route path="policies" element={<Placeholder title="Policy Updates" />} />
            <Route path="compliance" element={<ComplianceMonitoring />} />

            {/* IT Support */}
            <Route path="users-it" element={<Placeholder title="IT User Management" />} />
            <Route path="access" element={<AccessControl />} />
            <Route path="server" element={<Placeholder title="Server Status" />} />
            <Route path="tickets" element={<ITSupportTickets />} />
            <Route path="backups" element={<Placeholder title="Backup Logs" />} />
            <Route path="security-logs" element={<Placeholder title="Security Logs" />} />

            {/* Finance */}
            <Route path="expenses" element={<BranchExpenses />} />
            <Route path="income" element={<Placeholder title="Income Reports" />} />
            <Route path="gl" element={<Placeholder title="GL Management" />} />
            <Route path="tax" element={<Placeholder title="Tax Reports" />} />
            <Route path="budget" element={<Placeholder title="Budget Planning" />} />
            <Route path="payroll" element={<StaffPayroll />} />

            {/* Internal Audit */}
            <Route path="audit-reports" element={<InternalAudit />} />
            <Route path="audit-tx" element={<Placeholder title="Transaction Audit" />} />
            <Route path="audit-loan" element={<Placeholder title="Loan Audit" />} />
            <Route path="audit-comp" element={<Placeholder title="Compliance Audit" />} />
            <Route path="risk-findings" element={<Placeholder title="Risk Findings" />} />
            <Route path="audit-history" element={<Placeholder title="Audit History" />} />

            {/* Security */}
            <Route path="cctv" element={<SecurityCCTV />} />
            <Route path="visitors" element={<Placeholder title="Visitor Logs" />} />
            <Route path="incidents" element={<Placeholder title="Incident Reports" />} />
            <Route path="access-logs" element={<Placeholder title="Access Logs" />} />
            <Route path="emergency" element={<Placeholder title="Emergency Alerts" />} />

            {/* Administration */}
            <Route path="administration" element={<AdminOverview />} />
            <Route path="staff-records" element={<StaffRecords />} />
            <Route path="leave" element={<LeaveManagement />} />
            <Route path="assets" element={<AssetManagement />} />
            <Route path="vendors" element={<VendorManagement />} />
            <Route path="vendors/onboard" element={<VendorOnboarding />} />
            <Route path="vendors/:vendorId" element={<VendorDetail />} />
            <Route path="notices" element={<InternalNotices />} />

            {/* Global/Common */}
            <Route path="customers" element={<BranchCustomers />} />
            <Route path="loans" element={<BranchLoanApprovals />} />
            <Route path="fraud" element={<BranchFraudAlerts />} />
            <Route path="transactions" element={<BranchTransactions />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="transactions-all" element={<TransactionLogs />} />
         </Route>
         
         {/* Branch Manager Routes */}
        
        {/* Chairman / Admin Routes */}
        <Route path="/chairman" element={<ChairmanLayout />}>
           <Route index element={<Overview />} />
           <Route path="employees" element={<EmployeeManagement />} />
           <Route path="users" element={<UserManagement />} />
           <Route path="branches" element={<Branches />} />
           <Route path="branches/:branchId" element={<BranchDetails />} />
           <Route path="fraud" element={<FraudMonitoring />} />
           <Route path="audit" element={<AuditLogs />} />
           <Route path="transactions" element={<TransactionLogs />} />
           <Route path="risk" element={<RiskDashboard />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}
