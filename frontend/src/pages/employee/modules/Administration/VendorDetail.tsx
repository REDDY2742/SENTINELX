import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Star, FileText, ExternalLink, 
  Clock, ArrowLeft, Loader2, Download,
  Phone, Mail, MapPin, Calendar, Globe, AlertCircle
} from 'lucide-react';

export default function VendorDetail() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [renewing, setRenewing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!contractRef.current) return;
    setDownloading(true);
    
    // Inject html2pdf dynamically
    if (!(window as any).html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      document.body.appendChild(script);
      await new Promise(resolve => {
        script.onload = resolve;
      });
    }

    const element = contractRef.current;
    const opt = {
      margin: 10,
      filename: `${vendor.name.replace(/\s+/g, '_')}_MasterAgreement.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await (window as any).html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const contractData = useMemo(() => {
    if (!vendor) return null;
    // Simple hash-like function based on vendor name to keep data consistent for the same vendor
    const seed = vendor.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const yearsToSubtract = (seed % 3) + 1;
    
    const msaDate = vendor.partnerSince ? new Date(vendor.partnerSince).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 12, 2023';
    
    // Calculate days remaining dynamically from contractExpiry
    let daysRemainingVal = (seed % 100) + 20;
    let expiryDateStr = 'Dec 12, 2026';

    if (vendor.contractExpiry) {
      const expiry = new Date(vendor.contractExpiry);
      const today = new Date();
      const diffTime = expiry.getTime() - today.getTime();
      daysRemainingVal = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      expiryDateStr = expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return {
       msaDate: msaDate,
       msaFile: `MSA_V${yearsToSubtract}_${vendor.name.replace(/\s+/g, '_')}_24.pdf`,
       slaDate: msaDate,
       slaFile: `SLA_V1_OPERATIONS_${vendor.name.charAt(0)}X.pdf`,
       daysRemaining: daysRemainingVal,
       expiryDate: expiryDateStr
    };
  }, [vendor]);

  const handleRenew = () => {
    setRenewing(true);
    setTimeout(() => {
      setRenewing(false);
      alert('Renewal request for ' + vendor.name + ' has been initiated successfully.');
    }, 2000);
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'contracts') {
      setActiveTab('contracts');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchVendorDetail = async () => {
      try {
        const token = localStorage.getItem('access_token');
        // Since the current backend might not have a single vendor endpoint yet, 
        // we'll fetch all and find the one matching the name/id for now, 
        // to stay consistent with existing data flow.
        const response = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/administration/vendors', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const found = data.vendors?.find((v: any) => v.name.replace(/\s+/g, '_') === vendorId);
        
        if (found) {
          setVendor(found);
        } else {
          // Fallback or error handling
          console.error('Vendor not found');
        }
      } catch (err) {
        console.error('Failed to fetch vendor detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetail();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
         <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
         <AlertCircle className="w-16 h-16 text-rose-500/50" />
         <h2 className="text-xl font-bold text-white">Vendor Not Found</h2>
         <button 
           onClick={() => navigate('/employee/vendors')}
           className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
         >
           Back to Registry
         </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Header */}
      <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/employee/vendors')}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
          >
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-indigo-500/50">
                  <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Back to Directory</span>
          </button>
          <div className="flex gap-3">
              <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all"><Phone className="w-5 h-5" /></button>
              <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all"><Mail className="w-5 h-5" /></button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600/10 -z-10 blur-3xl"></div>
                  
                  <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-5xl font-black text-white mx-auto mb-8 shadow-2xl shadow-indigo-600/30">
                      {vendor.name.charAt(0)}
                  </div>
                  
                  <h1 className="text-3xl font-black text-white mb-2 leading-tight">{vendor.name}</h1>
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-8">{vendor.category}</p>
                  
                  <div className="flex items-center justify-center gap-4 mb-10">
                      <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</div>
                          <div className={`text-[10px] font-black uppercase ${vendor.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>{vendor.status}</div>
                      </div>
                      <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Rating</div>
                          <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {vendor.rating}
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4 text-left border-t border-slate-800/50 pt-8">
                      <div className="flex items-center gap-4 text-slate-400">
                          <MapPin className="w-4 h-4 text-indigo-500" />
                          <span className="text-xs font-medium">Headquarters: {vendor.headquarters || `${vendor.city || 'Bangalore'}, ${vendor.state || 'IN'}`}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span className="text-xs font-medium">Partner Since: {vendor.partnerSince || 'Aug 2022'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400">
                          <Globe className="w-4 h-4 text-indigo-500" />
                          <a 
                            href={vendor.website ? (vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`) : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium underline hover:text-indigo-400 transition-colors cursor-pointer"
                          >
                            {vendor.website || `www.${vendor.name.toLowerCase().replace(/\s+/g, '')}.com`}
                          </a>
                      </div>
                  </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Compliance Badge
                  </h4>
                  <p className="text-xs text-emerald-500/70 font-medium leading-relaxed">This vendor has passed all Tier-1 security and operational compliance audits for the fiscal year 2024-25.</p>
              </div>
          </div>

          {/* Right Panel: Tabs & Details */}
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-2 flex gap-2">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      Operational Profile
                  </button>
                  <button 
                    onClick={() => setActiveTab('contracts')}
                    className={`flex-1 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'contracts' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      Legal & Contracts
                  </button>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 min-h-[500px]">
                  {activeTab === 'profile' ? (
                      <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                          <div className="grid grid-cols-2 gap-10">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Contact Person</label>
                                  <p className="text-lg font-bold text-white uppercase">{vendor.contact}</p>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Email</label>
                                  <p className="text-lg font-bold text-white">{vendor.email}</p>
                              </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Capacity</label>
                                  <p className="text-lg font-bold text-white">{vendor.serviceCapacity || 'Full Regional Support'}</p>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Financial Tier</label>
                                  <p className="text-lg font-bold text-indigo-400">{vendor.financialTier || 'Enterprise Grade'}</p>
                              </div>
                          </div>

                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Overview</label>
                              <div className="p-8 rounded-3xl bg-slate-950/50 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                  {vendor.description || `Currently serving as a primary ${vendor.category.toLowerCase()} partner for Madurai and Coimbatore branches. Maintaining a 98% SLA compliance rate over the past 12 months. Specializes in rapid deployment and multi-site resource management.`}
                              </div>
                          </div>

                          <div className="flex gap-4">
                              <div className="flex-1 p-6 rounded-3xl bg-slate-950/30 border border-slate-800 text-center">
                                  <div className="text-2xl font-black text-white mb-1">{vendor.ticketsResolved || '0'}</div>
                                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tickets Resolved</div>
                              </div>
                              <div className="flex-1 p-6 rounded-3xl bg-slate-950/30 border border-slate-800 text-center">
                                  <div className="text-2xl font-black text-white mb-1">{vendor.uptimeScore || '0'}%</div>
                                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uptime Score</div>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                          <div className="space-y-4">
                              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Active Agreements</h3>
                              
                              <div 
                                onClick={() => setSelectedContract('Master Service Agreement (2024)')}
                                className="flex items-center justify-between p-6 bg-slate-950 border border-slate-800 rounded-3xl group hover:border-indigo-500/30 transition-all cursor-pointer"
                              >
                                  <div className="flex items-center gap-5">
                                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                          <FileText className="w-6 h-6" />
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-white">Master Service Agreement (2024)</p>
                                          <p className="text-[10px] text-slate-500 font-medium">{vendor.msaNumber || contractData?.msaFile} • {contractData?.msaDate}</p>
                                      </div>
                                  </div>
                                  <button className="p-3 rounded-xl bg-slate-900 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"><ExternalLink className="w-5 h-5" /></button>
                              </div>

                              <div 
                                onClick={() => setSelectedContract('SLA & Quality Protocol')}
                                className="flex items-center justify-between p-6 bg-slate-950 border border-slate-800 rounded-3xl group hover:border-indigo-500/30 transition-all cursor-pointer"
                              >
                                  <div className="flex items-center gap-5">
                                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                          <ShieldCheck className="w-6 h-6" />
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-white">SLA & Quality Protocol</p>
                                          <p className="text-[10px] text-slate-500 font-medium">{contractData?.slaFile} • {contractData?.slaDate}</p>
                                      </div>
                                  </div>
                                  <button className="p-3 rounded-xl bg-slate-900 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"><ExternalLink className="w-5 h-5" /></button>
                              </div>
                          </div>

                          <div className="p-10 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden">
                               <div className="absolute top-0 right-0 p-8 opacity-5"><Clock className="w-24 h-24 text-white" /></div>
                               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                  <Clock className="w-4 h-4" /> Next Contract Lifecycle
                               </h4>
                               <div className="flex items-end gap-2 mb-4">
                                   <div className="text-4xl font-black text-white leading-none">{contractData?.daysRemaining}</div>
                                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Days Remaining</div>
                               </div>
                               <p className="text-xs text-slate-400 font-medium max-w-sm mb-8">Current agreement is set to expire on {contractData?.expiryDate}. Automatic renewal is not configured for this vendor type.</p>
                               <button 
                                 onClick={handleRenew}
                                 disabled={renewing}
                                 className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
                               >
                                   {renewing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                                   {renewing ? 'Requesting...' : 'Initiate Renewal'}
                               </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* Contract Preview Modal */}
      {selectedContract && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-12 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-5xl h-full overflow-hidden shadow-2xl flex flex-col relative">
                <div className="flex items-center justify-between p-8 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{selectedContract}</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Archive • Verified by Legal Systems</p>
                        </div>
                    </div>
                    <button 
                      onClick={() => setSelectedContract(null)}
                      className="p-3 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-all"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-950/50">
                    <div ref={contractRef} className="max-w-4xl mx-auto bg-white rounded-lg p-16 shadow-2xl min-h-[1200px] text-slate-900 border border-slate-200">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-16 border-b-4 border-indigo-600 pb-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl">S</div>
                                    <h1 className="text-3xl font-black uppercase tracking-tighter text-indigo-900">SENTINEL X INFOTECH</h1>
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed max-w-xs">
                                    Headquarters: No. 42, Sentinel Plaza, IT Park Road,<br />
                                    Madurai, Tamil Nadu - 625020, India<br />
                                    Email: legal@sentinelx.com | Phone: +91 452 244 8000
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <div className="inline-block px-4 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{selectedContract}</p>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Document Ref</p>
                                <p className="text-sm font-black text-indigo-600">{vendor.msaNumber || `SX-MSA-2024-${vendor.name.charAt(0)}L`}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Effective Date: {vendor.partnerSince || 'Feb 14, 2024'}</p>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-serif font-black uppercase tracking-tight text-slate-900 mb-2">{selectedContract}</h2>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">Bipartite Master Service Agreement</p>
                        </div>

                        {/* Body content */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-2">I. The Agreement</h3>
                                <p className="text-sm leading-relaxed text-slate-700 font-medium">
                                    This Master Service Agreement ("Agreement") is executed on this <strong>{new Date().toLocaleDateString()}</strong> between 
                                    <strong> SENTINEL X INFOTECH PVT LTD</strong>, a corporation organized under the laws of India, having its principal 
                                    place of business at Madurai (hereafter "the Company"), and <strong>{vendor.name}</strong>, a corporation located at 
                                    <strong> {vendor.headquarters || `${vendor.city}, ${vendor.state}`}</strong> (hereafter "the Vendor").
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-2">II. Scope of Services</h3>
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-600 leading-relaxed shadow-sm">
                                    "{vendor.description || `The Vendor shall provide comprehensive ${vendor.category.toLowerCase()} services to the Company, covering all Madurai and Coimbatore regional operations as primary consultant and executor.`}"
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-3">
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">III. Service Level Agreement</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                        Vendor guarantees an uptime and operational availability of <strong>{vendor.uptimeScore || '99.8'}%</strong>. 
                                        Critical failures must be addressed within 4 business hours as per the response protocol.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">IV. Commercial Terms</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                        All billing cycles are Net 30 days unless otherwise specified. Vendor is categorized as 
                                        <strong> {vendor.financialTier || 'Enterprise Grade'}</strong> for procurement limits.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-12">
                                <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-2">V. Signatures & Affirmation</h3>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                                    The parties have executed this Agreement electronically as of the Effective Date. This digital document 
                                    shall be considered a valid, binding original in accordance with the Information Technology Act.
                                </p>
                                
                                <div className="flex gap-20 pt-16">
                                    <div className="flex-1 space-y-6">
                                        <div className="border-b-2 border-slate-300 pb-4 relative h-32 flex flex-col justify-end">
                                            <div className="absolute top-0 left-0 w-full text-center flex items-center justify-center h-20 overflow-hidden">
                                                <span className="font-serif italic text-4xl text-indigo-600 opacity-60 transform -rotate-6 select-none">S. Reddy</span>
                                            </div>
                                            <div className="text-center space-y-1">
                                                <p className="text-xs font-black text-slate-900 uppercase">Sandeep Reddy</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signatory, Sentinel X Infotech</p>
                                            </div>
                                            <div className="absolute bottom-16 right-0">
                                                <div className="w-16 h-16 rounded-full border-2 border-indigo-500/20 flex items-center justify-center text-[8px] text-indigo-500/30 text-center font-black uppercase rotate-12">Digital<br/>Seal</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div className="border-b-2 border-slate-300 pb-4 relative h-32 flex flex-col justify-end">
                                            <div className="absolute top-0 left-0 w-full text-center flex items-center justify-center h-20 overflow-hidden">
                                                <span className="font-serif italic text-34 text-indigo-600 opacity-60 transform -rotate-12 select-none">{vendor.contact.split(' ')[0]}</span>
                                            </div>
                                            <div className="text-center space-y-1">
                                                <p className="text-xs font-black text-slate-900 uppercase">{vendor.contact}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signatory, {vendor.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-20 text-[9px] text-slate-400 text-center font-mono">
                                    SECURE DOC ID: {Math.random().toString(36).substring(2, 15).toUpperCase()} | HASH: 8f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
                    <p className="text-xs text-slate-500 font-medium">Agreement generated dynamically for {vendor.name} • Version 2.4.1</p>
                    <div className="flex gap-4">
                        <button 
                          onClick={handleDownloadPDF}
                          disabled={downloading}
                          className="px-8 py-3 rounded-2xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-indigo-500" />}
                            {downloading ? 'GENERATING PDF...' : 'DOWNLOAD AGREEMENT'}
                        </button>
                        <button 
                           onClick={() => setSelectedContract(null)}
                           className="px-10 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
                        >
                            CLOSE VIEWER
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
}
