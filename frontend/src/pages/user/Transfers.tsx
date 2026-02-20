import React, { useState } from 'react';
import { Send, UserPlus, History, ShieldCheck, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';

interface UserData {
  firstName: string;
  lastName: string;
  accountNumber: string;
  balance: string | number;
  dailyLimit?: number;
  remainingLimit?: number;
  recentPayees?: Array<{id: string, name: string, accountNumber: string, initial: string, color: string}>;
}

export default function Transfers() {
  const { user } = useOutletContext<{ user: UserData }>();
  const [activeTab, setActiveTab] = useState('internal');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txId, setTxId] = useState('');

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !recipient) return;
    setOtpModalOpen(true);
  };

  const confirmOtp = async () => {
    try {
      setTxLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://13.201.79.48:8000/api/v1/auth/customer/transfer', {
         method: 'POST',
         headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            amount,
            recipient,
            note
         })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Transfer failed');

      setTxId(data.tx_id);
      setOtpModalOpen(false);
      setSuccessModalOpen(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Fund Transfer</h1>
        <p className="text-slate-400">Securely transfer money to anyone, anywhere.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800">
        <TabButton 
          label="Internal Transfer" 
          active={activeTab === 'internal'} 
          onClick={() => setActiveTab('internal')} 
          icon={<Send className="w-4 h-4" />}
        />
        <TabButton 
          label="Interbank (NEFT/IMPS)" 
          active={activeTab === 'interbank'} 
          onClick={() => setActiveTab('interbank')} 
          icon={<History className="w-4 h-4" />}
        />
        <TabButton 
          label="Add Beneficiary" 
          active={activeTab === 'beneficiary'} 
          onClick={() => setActiveTab('beneficiary')} 
          icon={<UserPlus className="w-4 h-4" />}
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          {activeTab === 'internal' && (
            <TransferForm 
              type="Internal" 
              amount={amount} 
              setAmount={setAmount} 
              recipient={recipient} 
              setRecipient={setRecipient} 
              note={note} 
              setNote={setNote} 
              onSubmit={handleTransfer}
              user={user}
            />
          )}
          {activeTab === 'interbank' && (
            <TransferForm 
              type="Interbank" 
              amount={amount} 
              setAmount={setAmount} 
              recipient={recipient} 
              setRecipient={setRecipient} 
              note={note} 
              setNote={setNote} 
              onSubmit={handleTransfer}
              interbank 
              user={user}
            />
          )}
          {activeTab === 'beneficiary' && <AddBeneficiaryForm />}
        </div>

        {/* Info / Quick Select Sidebar */}
        <div className="space-y-6">
           <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4 text-indigo-400">
                 <ShieldCheck className="w-6 h-6" />
                 <h3 className="font-bold">Secure Transfer</h3>
              </div>
              <p className="text-sm text-indigo-200/80 leading-relaxed mb-4">
                 All transfers are protected by 256-bit encryption and multi-factor authentication.
              </p>
              <div className="text-xs text-indigo-300 font-mono bg-indigo-950/50 p-3 rounded border border-indigo-500/20">
                 <div className="flex justify-between mb-1">
                    <span>Daily Limit:</span> <span>₹{(user?.dailyLimit || 50000).toLocaleString('en-IN')}</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Remaining:</span> <span>₹{(user?.remainingLimit || user?.dailyLimit || 50000).toLocaleString('en-IN')}</span>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">Recent Payees</h3>
              <div className="space-y-3">
                 {user?.recentPayees && user.recentPayees.length > 0 ? (
                    user.recentPayees.map((payee) => (
                       <Payee key={payee.id} name={payee.name} account={payee.accountNumber} />
                    ))
                 ) : (
                    <p className="text-slate-500 text-sm text-center py-4">No recent payees found.</p>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* OTP Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
           <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-sm w-full shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Verify Transaction</h3>
              <p className="text-slate-400 text-sm text-center mb-6">Enter the 6-digit code sent to your mobile number ending in **89.</p>
              <div className="flex gap-2 justify-center mb-6">
                 {[1,2,3,4,5,6].map((_, i) => (
                    <div key={i} className="w-10 h-12 bg-slate-800 border border-slate-600 rounded-lg animate-pulse" />
                 ))}
              </div>
              <button 
                onClick={confirmOtp} 
                disabled={txLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {txLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm Transfer
              </button>
              <button onClick={() => setOtpModalOpen(false)} className="w-full mt-3 text-slate-500 text-sm hover:text-slate-300">Cancel</button>
           </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in zoom-in duration-300">
           <div className="bg-slate-900 border border-emerald-500/30 p-8 rounded-2xl max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h3>
              <p className="text-slate-400 mb-6">Your transaction has been processed successfully.</p>
              
              <div className="bg-slate-950 rounded-lg p-4 text-left border border-slate-800 mb-6 space-y-2">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Amount Sent</span>
                    <span className="text-white font-mono font-bold">₹{parseFloat(amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Recipient</span>
                    <span className="text-white">{recipient}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Reference ID</span>
                    <span className="text-white font-mono text-xs">{txId}</span>
                 </div>
              </div>

              <button onClick={() => { setSuccessModalOpen(false); setAmount(''); setRecipient(''); setNote(''); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition">Done</button>
           </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode }) {
   return (
      <button 
         onClick={onClick}
         className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${active ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
      >
         {icon}
         {label}
         {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
      </button>
   )
}

function TransferForm({ amount, setAmount, recipient, setRecipient, note, setNote, onSubmit, interbank, user }: any) {
   return (
      <form onSubmit={onSubmit} className="space-y-6">
         <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">From Account</label>
            <div className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none">
               <span className="font-medium">Primary Account (**** {user?.accountNumber?.slice(-4)}) - </span>
               <span className="text-indigo-400 font-bold font-mono">
                  ₹{Number(user?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
               </span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Recipient Reference / Account</label>
               <input 
                  type="text" 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter Name or Account Number" 
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
                  required
               />
            </div>
            {interbank && (
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">IFSC / Routing Code</label>
                  <input 
                     type="text" 
                     placeholder="BANK0000123" 
                     className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
                  />
               </div>
            )}
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
               <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                  <input 
                     type="number" 
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     placeholder="0.00" 
                     className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-3 text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-600 font-mono"
                     required
                  />
               </div>
            </div>
         </div>

         <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Note (Optional)</label>
            <textarea 
               value={note}
               onChange={(e) => setNote(e.target.value)}
               placeholder="Payment for..." 
               rows={3} 
               className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
            />
         </div>

         <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2">
            continue to Verify <Send className="w-4 h-4" />
         </button>
      </form>
   )
}

function AddBeneficiaryForm() {
   return (
      <form className="space-y-6">
         <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
             <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
             <div className="text-sm text-amber-200/80">
                <p className="font-bold text-amber-500 mb-1">Cooling Period Alert</p>
                New beneficiaries will be activated after 30 minutes. Transfers up to ₹5,000 only for the first 24 hours.
             </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Nickname</label>
               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Account Number</label>
               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition font-mono" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Re-enter Account Number</label>
               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition font-mono" />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">IFSC / SWIFT Code</label>
               <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition font-mono uppercase" />
            </div>
         </div>
         <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition">
            Add Beneficiary
         </button>
      </form>
   )
}

function Payee({ name, account }: { name: string, account: string }) {
   return (
      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition cursor-pointer group border border-transparent hover:border-slate-700 bg-slate-950">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
               {name.charAt(0)}
            </div>
            <div>
               <div className="font-medium text-sm text-slate-200">{name}</div>
               <div className="text-xs text-slate-500 font-mono">{account}</div>
            </div>
         </div>
         <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-indigo-400">
             <Send className="w-4 h-4" />
         </div>
      </div>
   )
}
