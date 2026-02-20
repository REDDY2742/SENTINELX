import { ShieldCheck, DollarSign, CreditCard } from 'lucide-react';

export default function Banking() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Banking Services</h1>
      <p className="text-slate-600 mb-8">Secure, simple, and smart banking solutions for everyone.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <DollarSign className="w-10 h-10 text-emerald-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Savings Accounts</h2>
          <p className="text-slate-500">High-yield savings with up to 4.5% APY.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <ShieldCheck className="w-10 h-10 text-indigo-500 mb-4" />
           <h2 className="text-xl font-bold mb-2">Checking Accounts</h2>
           <p className="text-slate-500">Zero fees and global ATM access.</p>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <CreditCard className="w-10 h-10 text-purple-500 mb-4" />
           <h2 className="text-xl font-bold mb-2">Credit Cards</h2>
           <p className="text-slate-500">Cashback rewards on every purchase.</p>
        </div>
      </div>
    </div>
  );
}
