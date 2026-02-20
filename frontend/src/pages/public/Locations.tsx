import { useState } from 'react';
import { MapPin, Search, Phone, Clock } from 'lucide-react';

export default function Locations() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock Locations
  const LOCATIONS = [
      { id: 1, name: 'Downtown Branch', address: '123 Main St, New York, NY', type: 'Branch', status: 'Open Now', distance: '0.8 mi' },
      { id: 2, name: 'Times Square ATM', address: 'Broadway & 42nd St, NY', type: 'ATM', status: '24/7', distance: '1.2 mi' },
      { id: 3, name: 'Wall St HQ', address: '100 Wall Street, NY', type: 'HQ', status: 'Open Now', distance: '2.5 mi' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row h-screen">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 bg-white border-r border-slate-200 flex flex-col h-full z-10 shadow-xl">
         <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><MapPin className="text-indigo-600" /> Find Us</h1>
            <div className="relative">
                <Search className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="City, State or Zip" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                <FilterButton label="All" active />
                <FilterButton label="Branches" />
                <FilterButton label="ATMs" />
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {LOCATIONS.map(loc => (
                 <div key={loc.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition cursor-pointer group hover:border-indigo-200">
                     <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold text-lg group-hover:text-indigo-600 transition">{loc.name}</h3>
                         <span className={`text-xs px-2 py-1 rounded font-medium ${loc.status === 'Open Now' || loc.status === '24/7' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                             {loc.status}
                         </span>
                     </div>
                     <p className="text-slate-600 text-sm mb-3 flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {loc.address}</p>
                     <div className="flex justify-between items-center text-sm text-slate-500">
                         <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {loc.type === 'ATM' ? 'Always Open' : '9 AM - 5 PM'}</span>
                         <span>{loc.distance}</span>
                     </div>
                     <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                         <button className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">Directions</button>
                         <button className="px-3 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 border border-slate-200"><Phone className="w-4 h-4" /></button>
                     </div>
                 </div>
             ))}
         </div>
      </div>

      {/* Map Placeholder */}
      <div className="flex-1 bg-indigo-50 relative hidden md:block">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <MapPin className="w-64 h-64 text-indigo-900" />
          </div>
          <div className="absolute bottom-8 right-8 bg-white p-4 rounded-xl shadow-lg border border-slate-100 max-w-xs">
              <h4 className="font-bold mb-2">Needs Google Maps API Key</h4>
              <p className="text-sm text-slate-500">To enable live map functionality, add your Google Maps API key in the configuration.</p>
          </div>
      </div>
    </div>
  );
}

function FilterButton({ label, active }: { label: string, active?: boolean }) {
    return (
        <button className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
            active ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}>
            {label}
        </button>
    )
}
