import React from 'react';
import { ShieldCheck, Briefcase, Users, RefreshCw } from 'lucide-react';

export default function Current() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-slate-900 text-white py-20 px-8">
        <div className="max-w-[95%] mx-auto text-center">
            <h1 className="text-5xl font-extrabold mb-6">Business Checking Redefined</h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Seamless payments, multi-user access, and free wires for your growing business.</p>
            <div className="flex justify-center gap-4">
               <button className="bg-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition">Open Business Account</button>
               <button className="border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition">Compare Plans</button>
            </div>
        </div>
      </section>

      <div className="max-w-[95%] mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <Benefit icon={<Briefcase />} title="Business Tools" desc="Invoicing & Payroll built-in." />
         <Benefit icon={<Users />} title="Multi-User" desc="Assign roles to your team." />
         <Benefit icon={<RefreshCw />} title="Auto-Sync" desc="Integration with Xero & QuickBooks." />
         <Benefit icon={<ShieldCheck />} title="Fraud Guard" desc="Real-time transaction monitoring." />
      </div>
      
      {/* Comparison Table */}
      <section className="bg-white py-20 px-8 border-y border-slate-100">
         <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-200">
                     <th className="py-4 px-6 text-slate-500 font-medium">Features</th>
                     <th className="py-4 px-6 text-xl font-bold text-center">Starter</th>
                     <th className="py-4 px-6 text-xl font-bold text-center text-indigo-600">Growth (Popular)</th>
                     <th className="py-4 px-6 text-xl font-bold text-center">Enterprise</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  <tr><td className="py-4 px-6 font-medium">Monthly Fee</td><td className="text-center">$0</td><td className="text-center">$15</td><td className="text-center">$50</td></tr>
                  <tr><td className="py-4 px-6 font-medium">Team Members</td><td className="text-center">1</td><td className="text-center">5</td><td className="text-center">Unlimited</td></tr>
                  <tr><td className="py-4 px-6 font-medium">Free Wires</td><td className="text-center">2/mo</td><td className="text-center">10/mo</td><td className="text-center">Unlimited</td></tr>
                  <tr><td className="py-4 px-6 font-medium">24/7 Support</td><td className="text-center text-slate-400">No</td><td className="text-center text-green-500">Yes</td><td className="text-center text-green-500">Priority</td></tr>
                  <tr><td className="py-4 px-6"></td><td className="text-center"><button className="text-indigo-600 font-bold hover:underline">Select</button></td><td className="text-center"><button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700">Select</button></td><td className="text-center"><button className="text-indigo-600 font-bold hover:underline">Contact Sales</button></td></tr>
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
}

function Benefit({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-slate-600 text-sm">{desc}</p>
        </div>
    )
}
