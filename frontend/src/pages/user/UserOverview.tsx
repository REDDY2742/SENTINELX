import React, { useState } from 'react';
import { DollarSign, ArrowRight, CreditCard, Loader2, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCurrency } from '../../context/CurrencyContext';
import { API_BASE_URL } from '@/lib/api';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  balance: string | number;
  accountNumber: string;
  recentPayees?: Array<{id: string, name: string, accountNumber: string, initial: string, color: string}>;
  transactions?: Array<{id: any, title?: string, description: string, merchant: string, date: string, amount: number, type: string}>;
  totalSpending?: number;
}

export default function UserOverview() {
  const { user } = useOutletContext<{ user: UserData }>();
  useCurrency(); // Keep context hook just in case, but remove the unused variable
  const [balanceHidden] = useState(false);
  const [timeframe, setTimeframe] = useState('week');
  const [requestingCard, setRequestingCard] = useState(false);
  const [quickAmount, setQuickAmount] = useState('');
  const [quickRecipient, setQuickRecipient] = useState('');
  const [transferring, setTransferring] = useState(false);

  const balance = Number(user?.balance || 0);

  const applyCard = async (type: string) => {
    try {
      setRequestingCard(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/customer/apply`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: `${type} Request`,
          amount: 0,
          priority: 'medium',
          status: 'pending'
        })
      });
      
      if (response.ok) {
        toast.success(`${type} application submitted`);
      }
    } catch (err) {
      toast.error('Failed to submit card request');
    } finally {
      setRequestingCard(false);
    }
  };

  const handleQuickTransfer = async () => {
    if (!quickAmount || parseFloat(quickAmount) <= 0 || !quickRecipient) {
        toast.error('Please enter a valid amount and recipient');
        return;
    }
    
    try {
        setTransferring(true);
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/customer/transfer`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: parseFloat(quickAmount),
                recipient: quickRecipient,
                note: 'Quick Transfer'
            })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Transfer failed');
        
        toast.success(`Sent ₹${parseFloat(quickAmount).toLocaleString()} successfully`);
        setQuickAmount('');
        setQuickRecipient('');
    } catch (err: any) {
        toast.error(err.message);
    } finally {
        setTransferring(false);
    }
  };

  // Generate dynamic chart data based on transactions and timeframe
  const generateChartData = () => {
    const data = timeframe === 'week' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(name => ({ name, income: 0, expense: 0 }))
      : Array.from({ length: 30 }, (_, i) => ({ name: `Day ${i + 1}`, income: 0, expense: 0 }));

    if (user?.transactions && user.transactions.length > 0) {
      user.transactions.forEach(tx => {
        const txDate = new Date(tx.date);
        if (timeframe === 'week') {
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const dayName = dayNames[txDate.getDay()];
          const dataIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(dayName);
          if (dataIndex !== -1) {
            if (tx.amount > 0 || tx.type === 'credit') data[dataIndex].income += Math.abs(tx.amount);
            else data[dataIndex].expense += Math.abs(tx.amount);
          }
        } else {
          const dayOfMonth = txDate.getDate();
          if (dayOfMonth <= 30) {
            if (tx.amount > 0 || tx.type === 'credit') data[dayOfMonth - 1].income += Math.abs(tx.amount);
            else data[dayOfMonth - 1].expense += Math.abs(tx.amount);
          }
        }
      });
    } else {
      // Fallback for new accounts: show balance on the current day
      const now = new Date();
      if (timeframe === 'week') {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentDayName = dayNames[now.getDay()];
        const dataIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(currentDayName);
        if (dataIndex !== -1) data[dataIndex].income = balance;
      } else {
        const dayOfMonth = now.getDate();
        if (dayOfMonth <= 30) data[dayOfMonth - 1].income = balance;
      }
    }
    return data;
  };

  const chartData = generateChartData();

  const transactions = user?.transactions && user.transactions.length > 0 
    ? user.transactions.slice(0, 5).map(tx => ({
        id: tx.id,
        title: tx.merchant || tx.description,
        date: tx.date,
        amount: Math.abs(tx.amount),
        income: tx.amount > 0 || tx.type === 'credit',
        icon: <DollarSign className="w-4 h-4 text-emerald-500" />
      }))
    : [{ 
        id: 1, 
        title: 'Initial Deposit', 
        date: 'Account Opening', 
        amount: Number(balance), 
        income: true, 
        icon: <DollarSign className="w-4 h-4 text-emerald-500" /> 
      }];

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <BalanceCard title="Total Balance" amount={balance} change="+0.0%" hidden={balanceHidden} />
         <BalanceCard title="Spending This Month" amount={user?.totalSpending || 0} change="0%" hidden={balanceHidden} negative />
         <BalanceCard title="Savings Goals" amount={0} change="0%" hidden={balanceHidden} />
         <QuickActionCard />
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-semibold text-white">Financial Overview</h3>
               <select 
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="bg-slate-800 text-slate-400 text-sm border-none rounded-lg p-2 focus:ring-0 cursor-pointer"
               >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
               </select>
            </div>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                   <defs>
                     <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                   <XAxis dataKey="name" stroke="#64748b" />
                   <YAxis stroke="#64748b" />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                   />
                   <Area type="monotone" dataKey="income" stroke="#6366f1" fillOpacity={1} fill="url(#colorIncome)" />
                   <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
               {transactions.map(tx => (
                 <TransactionItem 
                    key={tx.id}
                    title={tx.title} 
                    date={tx.date} 
                    amount={tx.amount} 
                    income={tx.income}
                    icon={tx.icon} 
                 />
               ))}
            </div>
            <button className="mt-4 w-full py-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All Transactions</button>
         </div>
      </div>
      
      {/* My Cards & Quick Transfer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">My Cards</h3>
                  <button 
                    onClick={() => applyCard('Debit Card Replacement')}
                    disabled={requestingCard}
                    className="text-[10px] font-black uppercase tracking-tighter text-indigo-400 hover:text-indigo-300 flex items-center gap-1 disabled:opacity-50"
                  >
                    {requestingCard ? <Loader2 className="w-3 h-3 animate-spin"/> : <Plus className="w-3 h-3" />} Request New
                  </button>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="flex justify-between items-start mb-8">
                      <CreditCard className="w-8 h-8 opacity-80" />
                      <span className="font-mono text-lg tracking-widest">
                        {user?.accountNumber ? `**** ${user.accountNumber.slice(-4)}` : '**** 0000'}
                      </span>
                  </div>
                  <div className="flex justify-between items-end">
                      <div>
                          <p className="text-xs text-indigo-200 uppercase mb-1">Card Holder</p>
                          <p className="font-medium text-lg">{user?.firstName} {user?.lastName}</p>
                      </div>
                      <div className="text-right">
                          <p className="text-xs text-indigo-200 uppercase mb-1">Expires</p>
                          <p className="font-medium">12/28</p>
                      </div>
                  </div>
              </div>
          </div>
          
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Transfer</h3>
               <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
                   <div className="flex flex-col items-center gap-2 cursor-pointer group">
                       <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold group-hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20">
                           <DollarSign className="w-5 h-5" />
                       </div>
                       <span className="text-xs text-slate-400">New</span>
                   </div>
                    {user?.recentPayees && user.recentPayees.length > 0 ? (
                        user.recentPayees.map((payee) => (
                        <QuickTransferUser 
                            key={payee.id} 
                            name={payee.name.split(' ')[0]} 
                            initial={payee.initial || payee.name[0]} 
                            color={payee.color || 'bg-slate-700'}
                            onClick={() => setQuickRecipient(payee.accountNumber || payee.name)}
                            active={quickRecipient === (payee.accountNumber || payee.name)}
                        />
                        ))
                    ) : (
                        <p className="text-xs text-slate-500 py-2 pl-2">No recent payees</p>
                    )}
               </div>
               
               <div className="bg-slate-800 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4">
                   <div className="w-full md:w-1/3">
                       <label className="block text-xs text-slate-500 uppercase font-bold mb-1">To</label>
                       <input 
                           type="text" 
                           placeholder="Account or Name"
                           value={quickRecipient}
                           onChange={(e) => setQuickRecipient(e.target.value)}
                           className="bg-transparent border-b border-slate-700 outline-none w-full text-white font-medium py-1 placeholder:text-slate-600" 
                       />
                   </div>
                   <div className="flex-1 w-full">
                       <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Amount</label>
                       <div className="flex items-center gap-2 text-white text-2xl font-mono">
                           <span>₹</span>
                           <input 
                               type="number" 
                               placeholder="0.00" 
                               value={quickAmount}
                               onChange={(e) => setQuickAmount(e.target.value)}
                               className="bg-transparent outline-none w-full placeholder:text-slate-600" 
                           />
                       </div>
                   </div>
                   <button 
                       onClick={handleQuickTransfer}
                       disabled={transferring}
                       className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg shadow-indigo-500/20 flex items-center gap-2 w-full md:w-auto justify-center"
                   >
                       {transferring ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                       Send
                   </button>
               </div>
          </div>
      </div>
    </div>
  );
}

function BalanceCard({ title, amount, change, hidden, negative }: { title: string, amount: number, change: string | number, hidden: boolean, negative?: boolean }) {
    const { formatAmount } = useCurrency();
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition group">
            <h4 className="text-slate-400 text-sm font-medium mb-2">{title}</h4>
            <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold text-white font-mono">
                    {hidden ? '••••••' : formatAmount(amount)}
                </h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${negative ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {change}
                </span>
            </div>
        </div>
    )
}

function QuickActionCard() {
    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
            <h4 className="font-medium text-indigo-100 mb-1">Quick Pay</h4>
            <p className="text-2xl font-bold mb-4">Pay Bills Instantly</p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm self-start inline-flex px-3 py-1.5 rounded-lg">
                Pay Now <ArrowRight className="w-3 h-3" />
            </div>
        </div>
    )
}

function TransactionItem({ title, date, amount, income, icon }: { title: string, date: string, amount: number, income?: boolean, icon: React.ReactNode }) {
    const { formatAmount } = useCurrency();
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10">
                    {itemIcon(icon)}
                </div>
                <div>
                    <h5 className="font-medium text-slate-200 text-sm">{title}</h5>
                    <p className="text-xs text-slate-500">{date}</p>
                </div>
            </div>
            <span className={`font-mono font-medium text-sm ${income ? 'text-emerald-400' : 'text-slate-300'}`}>
                {income ? '+' : ''}{formatAmount(amount)}
            </span>
        </div>
    )
}

function itemIcon(icon: React.ReactNode) {
    return icon;
}

function QuickTransferUser({ name, image, initial, color, onClick, active }: { name: string, image?: string, initial?: string, color?: string, onClick?: () => void, active?: boolean }) {
    return (
        <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group">
            {image ? (
                <img src={image} alt={name} className={`w-12 h-12 rounded-full border-2 ${active ? 'border-indigo-500' : 'border-slate-700'} group-hover:border-indigo-500 transition object-cover`} />
            ) : (
                <div className={`w-12 h-12 rounded-full ${color || 'bg-slate-700'} flex items-center justify-center text-white font-bold border-2 ${active ? 'border-indigo-500 shadow-lg shadow-indigo-500/30 scale-110' : 'border-slate-700'} group-hover:border-indigo-500 transition`}>
                    {initial}
                </div>
            )}
            <span className={`text-xs ${active ? 'text-white font-bold' : 'text-slate-400'} group-hover:text-white transition`}>{name}</span>
        </div>
    )
}
