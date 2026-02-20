import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<{from: 'bot' | 'user', text: string}[]>([
        { from: 'bot', text: 'Hi! I am Sentinel AI. How can I help you today?' },
        { from: 'bot', text: 'You can ask me about Loans, Savings, or Branch locations.' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { from: 'user', text: input }]);
        // Mock Response
        setTimeout(() => {
            let response = "I'm not sure about that. Try asking about 'rates' or 'locations'.";
            if (input.toLowerCase().includes('loan')) response = "We offer Personal, Home, and Car loans with rates starting at 5.5%. Check our Loans page!";
            if (input.toLowerCase().includes('save') || input.toLowerCase().includes('savings')) response = "Our High-Yield Savings account offers 4.5% APY. Open one today!";
            if (input.toLowerCase().includes('location') || input.toLowerCase().includes('branch')) response = "You can find our branches using the Locations page in the menu.";
            setMessages(prev => [...prev, { from: 'bot', text: response }]);
        }, 1000);
        setInput('');
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
            {open && (
                <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-slate-200 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                           <span className="font-bold">Sentinel AI Support</span>
                        </div>
                        <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.from === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..." 
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                        />
                        <button onClick={handleSend} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"><ArrowRight className="w-4 h-4" /></button>
                    </div>
                </div>
            )}
            <button 
                onClick={() => setOpen(!open)}
                className="w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center text-white hover:bg-indigo-700 transition hover:scale-110 active:scale-95 overflow-hidden"
            >
                {open ? <X className="w-6 h-6" /> : <BrandLogo className="w-8 h-8" />}
            </button>
        </div>
    )
}
