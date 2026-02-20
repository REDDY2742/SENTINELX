import React from 'react';
import { Home, Car, GraduationCap } from 'lucide-react';

export default function Loans() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Loans & Lending</h1>
      <p className="text-slate-600 mb-12 text-lg">Financing your dreams with rates as low as 2.9%</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <LoanCard title="Home Loans" rate="from 5.5% APR" icon={<Home className="w-8 h-8 text-blue-500" />} />
        <LoanCard title="Auto Loans" rate="from 3.2% APR" icon={<Car className="w-8 h-8 text-red-500" />} />
        <LoanCard title="Student Loans" rate="from 2.9% APR" icon={<GraduationCap className="w-8 h-8 text-yellow-500" />} />
      </div>
    </div>
  );
}

function LoanCard({ title, rate, icon }: { title: string, rate: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100 text-center">
       <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
         {icon}
       </div>
       <h3 className="text-2xl font-bold mb-2">{title}</h3>
       <div className="text-indigo-600 font-semibold mb-4">{rate}</div>
       <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition">Apply Now</button>
    </div>
  )
}
