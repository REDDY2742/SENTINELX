import React, { useState } from 'react';
import { Smartphone, Zap, Droplet, Tv, Wifi, CreditCard, Shield, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

interface UserData {
  recentBills?: Array<{id: string, name: string, date: string, amount: string, iconType: string}>;
  autoPayEnabled?: boolean;
  nextBillDate?: string;
}

export default function BillPay() {
  const { user } = useOutletContext<{ user: UserData }>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState(0); // 0: Select, 1: Enter Details, 2: Confirm, 3: Success

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
    setPaymentStep(1);
  };

  const handlePay = () => {
    setPaymentStep(2);
    setTimeout(() => setPaymentStep(3), 2000); // Simulate processing
  };

  return (
    <div className="space-y-6">
      <div>
         <h1 className="text-3xl font-bold text-white mb-2">Bill Payments</h1>
         <p className="text-slate-400">Manage and pay all your utility bills in one place.</p>
      </div>

      {paymentStep === 3 ? (
         <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-12 text-center animate-in zoom-in duration-300">
             <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle className="w-10 h-10 text-emerald-500" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-4">Payment Successful!</h2>
             <p className="text-slate-400 mb-8">Your {selectedCategory} bill has been paid successfully.</p>
             <button onClick={() => { setPaymentStep(0); setSelectedCategory(null); }} className="px-8 py-3 bg-slate-800 text-white hover:bg-slate-700 rounded-lg font-medium transition">Make Another Payment</button>
         </div>
      ) : (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               {/* Categories */}
               {paymentStep === 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <CategoryCard icon={<Zap className="w-8 h-8 text-yellow-400" />} label="Electricity" onClick={() => handleSelect('Electricity')} />
                     <CategoryCard icon={<Smartphone className="w-8 h-8 text-blue-400" />} label="Mobile Postpaid" onClick={() => handleSelect('Mobile')} />
                     <CategoryCard icon={<Wifi className="w-8 h-8 text-cyan-400" />} label="Broadband" onClick={() => handleSelect('Broadband')} />
                     <CategoryCard icon={<Droplet className="w-8 h-8 text-cyan-600" />} label="Water" onClick={() => handleSelect('Water')} />
                     <CategoryCard icon={<Tv className="w-8 h-8 text-purple-400" />} label="DTH / Cable" onClick={() => handleSelect('DTH')} />
                     <CategoryCard icon={<CreditCard className="w-8 h-8 text-emerald-400" />} label="Credit Card" onClick={() => handleSelect('Credit Card')} />
                     <CategoryCard icon={<Shield className="w-8 h-8 text-red-400" />} label="Insurance" onClick={() => handleSelect('Insurance')} />
                  </div>
               )}

               {/* Payment Form */}
               {paymentStep === 1 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-in fade-in slide-in-from-right-8 duration-300">
                     <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => setPaymentStep(0)} className="text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-slate-800 transition">Back</button>
                        <h2 className="text-xl font-bold text-white">Pay {selectedCategory} Bill</h2>
                     </div>
                     
                     <div className="space-y-6">
                        <div>
                           <label className="block text-sm font-medium text-slate-300 mb-2">Select Provider</label>
                           <select className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition">
                              <option>Provider A</option>
                              <option>Provider B</option>
                              <option>Provider C</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-300 mb-2">Account / Consumer Number</label>
                           <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition" placeholder="1234567890" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                           <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                              <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-3 text-white outline-none focus:border-indigo-500 transition font-mono" placeholder="0.00" />
                           </div>
                        </div>
                        <button onClick={handlePay} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2">
                           Procced to Pay <ArrowRight className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               )}
               
               {/* Processing State */}
               {paymentStep === 2 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                      <h3 className="text-xl font-bold text-white mb-2">Processing Payment...</h3>
                      <p className="text-slate-400">Please do not close this window or press back.</p>
                  </div>
               )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-white">Recent Payments</h3>
                     <button className="text-xs text-indigo-400 hover:text-indigo-300">View All</button>
                  </div>
                  <div className="space-y-4">
                     {user?.recentBills && user.recentBills.length > 0 ? (
                        user.recentBills.map((bill) => (
                           <RecentBill 
                              key={bill.id}
                              icon={bill.iconType === 'zap' ? <Zap className="w-4 h-4 text-yellow-500" /> : <Wifi className="w-4 h-4 text-cyan-500" />} 
                              name={bill.name} 
                              date={bill.date} 
                              amount={bill.amount} 
                           />
                        ))
                     ) : (
                        <p className="text-slate-500 text-sm text-center py-4">No recent payments found.</p>
                     )}
                  </div>
               </div>

               <div className={`${user?.autoPayEnabled ? 'bg-indigo-600' : 'bg-slate-900 border border-slate-800'} rounded-xl p-6 text-white shadow-lg relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                   <h3 className="font-bold text-lg mb-2 relative z-10">Auto-Pay {user?.autoPayEnabled ? 'Enabled' : 'Disabled'}</h3>
                   <p className={`${user?.autoPayEnabled ? 'text-indigo-100' : 'text-slate-400'} text-sm mb-4 relative z-10`}>
                      {user?.autoPayEnabled ? 'Maintain sufficient balance for scheduled payments.' : 'Enable auto-pay to never miss a payment.'}
                   </p>
                   {user?.nextBillDate && (
                      <div className={`flex items-center gap-2 text-xs ${user?.autoPayEnabled ? 'bg-indigo-700/50' : 'bg-slate-800'} p-2 rounded-lg backdrop-blur-sm`}>
                         <Clock className="w-4 h-4" /> Next due: {user.nextBillDate}
                      </div>
                   )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

function CategoryCard({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
   return (
      <div 
         onClick={onClick}
         className="bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 transition p-6 rounded-xl flex flex-col items-center gap-4 cursor-pointer group shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 duration-300"
      >
         <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-inner shadow-slate-900/50 border border-slate-800/50">
            {icon}
         </div>
         <span className="font-medium text-slate-300 group-hover:text-white">{label}</span>
      </div>
   )
}

function RecentBill({ icon, name, date, amount }: { icon: React.ReactNode, name: string, date: string, amount: string }) {
   return (
      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition cursor-pointer group">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
               {icon}
            </div>
            <div>
               <div className="text-sm font-medium text-white">{name}</div>
               <div className="text-xs text-slate-500">{date}</div>
            </div>
         </div>
         <span className="text-sm font-mono text-white">{amount}</span>
      </div>
   )
}
