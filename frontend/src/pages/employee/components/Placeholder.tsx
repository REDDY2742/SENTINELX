import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

export default function Placeholder({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-slate-900/20 backdrop-blur-md rounded-[3rem] border border-slate-800 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 border border-indigo-500/20">
        <Construction className="w-10 h-10 text-indigo-500 animate-bounce" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md mb-8">
        This specialized workspace module is currently under active development. 
        Soon, you will be able to manage all {title.toLowerCase()} operations directly from this view.
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    </div>
  );
}
