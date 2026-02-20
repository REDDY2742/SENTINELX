import { Phone, Mail, MapPin, Globe } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Our Mission</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
           To empower individuals and businesses with secure, transparent, and intelligent financial solutions. At Sentinel Bank, we combine traditional values with cutting-edge technology.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
         <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <div className="flex items-center gap-4 text-slate-600">
               <Phone className="w-5 h-5 text-indigo-500" /> +1 (800) SENTINEL
            </div>
            <div className="flex items-center gap-4 text-slate-600">
               <Mail className="w-5 h-5 text-indigo-500" /> support@sentinelbank.com
            </div>
            <div className="flex items-center gap-4 text-slate-600">
               <MapPin className="w-5 h-5 text-indigo-500" /> 100 Wall Street, New York, NY
            </div>
            <div className="flex items-center gap-4 text-slate-600">
               <Globe className="w-5 h-5 text-indigo-500" /> www.sentinelbank.com
            </div>
         </div>
         
         <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold mb-6">Leadership</h2>
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full" />
                  <div>
                     <div className="font-bold">Sarah Connor</div>
                     <div className="text-sm text-slate-500">Chief Executive Officer</div>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full" />
                  <div>
                     <div className="font-bold">John Wick</div>
                     <div className="text-sm text-slate-500">Head of Security</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
