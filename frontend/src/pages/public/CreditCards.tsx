import React from 'react';
import { CreditCard, Rocket, Plane, Check } from 'lucide-react';

export default function CreditCards() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-20 px-8">
        <div className="max-w-[95%] mx-auto text-center">
            <h1 className="text-5xl font-extrabold mb-6">Swipe. Earn. Repeat.</h1>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">Choose the card that fits your lifestyle. Up to 5% cashback on travel and dining.</p>
        </div>
      </section>

      <div className="max-w-[95%] mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 -mt-24">
         <CardOption 
             title="Sentinel Platinum" 
             type="Premium Travel" 
             perks={["5x Points on Travel","Global Lounge Access","$300 Annual Travel Credit"]} 
             color="bg-gradient-to-br from-slate-700 to-slate-900 text-white" 
             icon={<Plane className="w-8 h-8 text-indigo-400" />}
         />
         <CardOption 
             title="Sentinel Cash+" 
             type="Everyday Value" 
             perks={["3% on Dining & Groceries","1.5% on Everything Else","No Annual Fee"]} 
             color="bg-white border border-slate-200 text-slate-900" 
             icon={<CreditCard className="w-8 h-8 text-emerald-500" />}
             highlight
         />
         <CardOption 
             title="Sentinel Business" 
             type="Corporate Expense" 
             perks={["Employee Cards Free","Expense Integration","High Credit Limits"]} 
             color="bg-slate-100 border border-slate-200 text-slate-800" 
             icon={<Rocket className="w-8 h-8 text-blue-600" />}
         />
      </div>

      {/* Compare Feature */}
      <section className="bg-white py-20 px-8">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Not sure which card is right for you?</h2>
            <p className="text-slate-600 mb-8">Use our comparison tool to find your perfect match based on spending habits.</p>
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition">Compare All Cards</button>
         </div>
      </section>
    </div>
  );
}

function CardOption({ title, type, perks, color, icon, highlight }: { title: string, type: string, perks: string[], color: string, icon: React.ReactNode, highlight?: boolean }) {
    return (
        <div className={`p-8 rounded-2xl shadow-xl flex flex-col h-full transform transition hover:-translate-y-2 ${color} ${highlight ? 'ring-4 ring-indigo-500 ring-offset-2' : ''}`}>
            <div className="mb-6 flex justify-between items-start">
               {icon}
               <span className="text-xs font-bold uppercase tracking-widest opacity-70 border border-current px-2 py-1 rounded">{type}</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <div className="flex-1 mt-6 space-y-4">
               {perks.map((perk, i) => (
                   <div key={i} className="flex items-center gap-3 text-sm font-medium opacity-90">
                       <Check className="w-4 h-4 shrink-0" /> {perk}
                   </div>
               ))}
            </div>
            <button className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">Apply Now</button>
        </div>
    )
}
