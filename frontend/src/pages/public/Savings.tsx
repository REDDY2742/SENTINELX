import React from 'react';
import { DollarSign, ShieldCheck, CreditCard, FileText, CheckCircle } from 'lucide-react';

export default function Savings() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="bg-indigo-600 text-white py-20 px-8">
        <div className="max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                 <h1 className="text-5xl font-extrabold mb-6">Grow Your Future with High-Yield Savings</h1>
                 <p className="text-xl opacity-90 mb-8">Up to 4.5% APY* with no monthly fees and complete flexibility.</p>
                 <button className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition">Open Account Now</button>
            </div>
            <div className="hidden md:block">
                 {/* Illustration placeholder */}
                 <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
                     <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">$</div>
                         <div>
                             <div className="text-sm opacity-75">Your Balance</div>
                             <div className="text-3xl font-bold">$24,500.00</div>
                         </div>
                     </div>
                     <div className="h-2 bg-white/20 rounded-full w-full mb-2">
                         <div className="h-full bg-green-400 rounded-full w-3/4"></div>
                     </div>
                     <div className="text-xs opacity-75 text-right">+ $125.40 Interest Earned</div>
                 </div>
            </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8 max-w-[95%] mx-auto">
         <h2 className="text-3xl font-bold text-center mb-16">Why Choose Sentinel Savings?</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<DollarSign className="w-8 h-8 text-emerald-500" />} 
                title="Industry-Leading Rates" 
                desc="Earn 10x the national average with our competitive APY rates." 
            />
            <FeatureCard 
                icon={<ShieldCheck className="w-8 h-8 text-blue-500" />} 
                title="FDIC Insured" 
                desc="Your deposits are insured up to $250,000 per depositor." 
            />
            <FeatureCard 
                icon={<CreditCard className="w-8 h-8 text-purple-500" />} 
                title="Instant Access" 
                desc="Transfer funds instantly to external accounts with no delay." 
            />
         </div>
      </section>
      
      {/* Requirements */}
      <section className="bg-white py-20 px-8 border-y border-slate-200">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Eligibility & Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="text-indigo-600" /> Eligibility</h3>
                  <ul className="space-y-3 text-slate-600">
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-600" /> 18 years or older</li>
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-600" /> US Resident / Citizen</li>
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-600" /> Valid SSN or TIN</li>
                  </ul>
               </div>
               <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="text-indigo-600" /> Required Documents</h3>
                  <ul className="space-y-3 text-slate-600">
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-600" /> Government ID (Passport/License)</li>
                     <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-600" /> Proof of Address (Utility Bill)</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="mb-6">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-slate-600">{desc}</p>
        </div>
    )
}
