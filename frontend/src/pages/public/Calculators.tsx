import React, { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<'emi' | 'eligibility'>('emi');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Financial Calculators</h1>
        
        <div className="flex justify-center mb-12 bg-white rounded-full p-1 shadow-sm border border-slate-200 inline-flex mx-auto">
           <button 
             onClick={() => setActiveTab('emi')}
             className={`px-8 py-3 rounded-full font-medium transition ${activeTab === 'emi' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             EMI Calculator
           </button>
           <button 
             onClick={() => setActiveTab('eligibility')}
             className={`px-8 py-3 rounded-full font-medium transition ${activeTab === 'eligibility' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             Loan Eligibility
           </button>
        </div>

        {activeTab === 'emi' ? <EMICalculator /> : <EligibilityChecker />}
      </div>
    </div>
  );
}

function EMICalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(24);

  const r = rate / 12 / 100;
  const emi = Math.round((amount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1));
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - amount;

  return (
     <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
         <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calculator className="text-indigo-600" /> Calculate Your Monthly Payment</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
               <div>
                  <label className="block font-medium text-slate-700 mb-2">Loan Amount ($)</label>
                  <input type="range" min="1000" max="1000000" step="1000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  <div className="mt-2 text-right font-mono font-bold text-indigo-600 text-lg">${amount.toLocaleString()}</div>
               </div>
               <div>
                  <label className="block font-medium text-slate-700 mb-2">Interest Rate (%)</label>
                  <input type="range" min="1" max="25" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  <div className="mt-2 text-right font-mono font-bold text-indigo-600 text-lg">{rate}%</div>
               </div>
               <div>
                   <label className="block font-medium text-slate-700 mb-2">Tenure (Months)</label>
                   <input type="range" min="6" max="360" step="6" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                   <div className="mt-2 text-right font-mono font-bold text-indigo-600 text-lg">{tenure} Months</div>
               </div>
            </div>

            <div className="bg-indigo-50 p-8 rounded-2xl text-center border border-indigo-100 flex flex-col justify-center">
                <div className="text-sm font-medium text-indigo-600 uppercase tracking-widest mb-2">Your Monthly EMI</div>
                <div className="text-5xl font-extrabold text-slate-900 mb-6">${emi.toLocaleString()}</div>
                
                <div className="border-t border-indigo-200 pt-6 space-y-3 text-sm">
                   <div className="flex justify-between">
                      <span className="text-slate-600">Total Interest</span>
                      <span className="font-bold text-slate-800">${totalInterest.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-slate-600">Total Payment</span>
                      <span className="font-bold text-slate-800">${totalPayment.toLocaleString()}</span>
                   </div>
                </div>
                <button className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">Apply for Loan</button>
            </div>
         </div>
     </div>
  )
}

function EligibilityChecker() {
    const [income, setIncome] = useState(5000);
    const [emis, setEmis] = useState(500);
    const [score, setScore] = useState(750);
    
    // Simple Logic: Disposable Income * 60 (5 years) * Risk Factor based on Score
    const disposable = income - emis;
    const riskFactor = score >= 750 ? 1 : score >= 650 ? 0.8 : 0.5;
    const eligibleAmount = Math.max(0, Math.round(disposable * 0.5 * 60 * riskFactor));
    const riskCategory = score >= 750 ? 'Excellent' : score >= 650 ? 'Good' : 'High Risk';
    const riskColor = score >= 750 ? 'text-emerald-500' : score >= 650 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><CheckCircle className="text-emerald-600" /> Check Eligibility</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">Monthly Income ($)</label>
                        <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">Current Monthly EMIs ($)</label>
                        <input type="number" value={emis} onChange={(e) => setEmis(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">Credit Score (300-900)</label>
                        <input type="range" min="300" max="900" value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                        <div className={`mt-2 text-right font-bold text-lg ${riskColor}`}>{score} ({riskCategory})</div>
                    </div>
                 </div>

                 <div className="bg-emerald-50 p-8 rounded-2xl text-center border border-emerald-100 flex flex-col justify-center">
                     <div className="text-sm font-medium text-emerald-700 uppercase tracking-widest mb-2">You are eligible for up to</div>
                     <div className="text-5xl font-extrabold text-slate-900 mb-4">${eligibleAmount.toLocaleString()}</div>
                     
                     {score < 650 && (
                         <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                             <AlertTriangle className="w-4 h-4" /> Improves your score to borrow more.
                         </div>
                     )}
                     
                     <p className="text-slate-600 text-sm mb-6">Based on a 5-year tenure and current market rates.</p>
                     <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition">View Loan Offers</button>
                 </div>
             </div>
        </div>
    )
}
