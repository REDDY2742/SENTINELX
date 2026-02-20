import { ShieldCheck, DollarSign, Calendar, ArrowRight, Globe, Phone, MapPin, Calculator, Briefcase, CreditCard, UserCheck, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 -z-10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent"></div>
        
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               Bank with Confidence
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              The Future of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Secure Banking</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
              Join over 2 million customers who trust Sentinel Bank for AI-driven insights, enterprise-grade security, and 24/7 global access.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
               <Link to="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition shadow-xl shadow-indigo-500/20 flex items-center gap-2 hover:-translate-y-1">
                 Get Started <ArrowRight className="w-5 h-5" />
               </Link>
               <Link to="/calculators" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-medium hover:bg-slate-50 transition flex items-center gap-2 hover:-translate-y-1">
                 Calculators
               </Link>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" /> FDIC Insured
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" /> 256-bit Encryption
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" /> 24/7 Support
                </div>
            </div>
          </div>
          
          <div className="relative">
             <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl opacity-20 blur-3xl animate-pulse"></div>
             <img src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Banking Dashboard" className="relative rounded-3xl shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition duration-700 ease-out" />
             
             {/* Floating Badge */}
             <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                     <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                     <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Interest Earned</div>
                     <div className="text-2xl font-extrabold text-slate-900">+$1,240.50</div>
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="-mt-16 relative z-10 max-w-[95%] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-3xl shadow-xl border border-slate-100 p-4">
              <QuickAction 
                  icon={<Calculator className="w-6 h-6 text-indigo-600" />} 
                  title="EMI Calculator" 
                  desc="Plan your loan repayments instantly." 
                  link="/calculators"
              />
              <QuickAction 
                  icon={<UserCheck className="w-6 h-6 text-emerald-500" />} 
                  title="Check Eligibility" 
                  desc="Find out how much you can borrow." 
                  link="/calculators"
              />
              <QuickAction 
                  icon={<MapPin className="w-6 h-6 text-red-500" />} 
                  title="Locate Branch" 
                  desc="Find an ATM or branch near you." 
                  link="/locations"
              />
          </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-24 bg-white">
         <div className="max-w-[95%] mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">Our Products</h2>
                <h3 className="text-4xl font-extrabold text-slate-900 mb-6">Financial Solutions for Every Stage of Life</h3>
                <p className="text-lg text-slate-600">Whether you're saving for a rainy day, buying your dream home, or planning for retirement, we have the right tools for you.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ProductCard 
                    title="Premium Checking" 
                    desc="Zero fees, global ATM access, and exclusive rewards on every swipe." 
                    icon={<DollarSign className="w-8 h-8 text-emerald-500" />} 
                    link="/current"
                />
                <ProductCard 
                    title="High-Yield Savings" 
                    desc="Grow your wealth faster with industry-leading APY rates up to 4.5%." 
                    icon={<Globe className="w-8 h-8 text-blue-500" />} 
                    link="/savings"
                />
                <ProductCard 
                    title="Smart Loans" 
                    desc="Instant approval up to $50k with flexible repayment options." 
                    icon={<Calendar className="w-8 h-8 text-indigo-500" />} 
                    link="/loans"
                />
                <ProductCard 
                    title="Credit Cards" 
                    desc="Cashback, travel points, and premium lifestyle benefits." 
                    icon={<CreditCard className="w-8 h-8 text-purple-500" />} 
                    link="/cards"
                />
                <ProductCard 
                    title="Business Banking" 
                    desc="Scalable solutions for startups and enterprises." 
                    icon={<Briefcase className="w-8 h-8 text-slate-700" />} 
                    link="/current"
                />
                <ProductCard 
                    title="Investments" 
                    desc="Automated portfolios and real-time trading access." 
                    icon={<TrendingUp className="w-8 h-8 text-cyan-500" />} 
                    link="/investments"
                />
            </div>
         </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-900/20 rounded-l-full blur-3xl"></div>
          
          <div className="max-w-[95%] mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                  <h2 className="text-3xl font-bold mb-6">Why 2 Million+ People Trust Sentinel</h2>
                  <div className="space-y-8">
                      <FeatureRow 
                          title="Bank-Grade Security" 
                          desc="We use 256-bit encryption and multi-factor authentication to keep your money safe." 
                          icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
                      />
                      <FeatureRow 
                          title="Digital-First Experience" 
                          desc="manage everything from our award-winning mobile app. No paperwork required." 
                          icon={<Phone className="w-6 h-6 text-blue-400" />}
                      />
                      <FeatureRow 
                          title="24/7 Global Support" 
                          desc="Our dedicated team is available round-the-clock to assist you anywhere in the world." 
                          icon={<Globe className="w-6 h-6 text-purple-400" />}
                      />
                  </div>
              </div>
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                  <div className="flex items-center gap-4 mb-8">
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Customer" className="w-16 h-16 rounded-full border-2 border-indigo-500" />
                      <div>
                          <div className="font-bold text-lg">Sarah Jenkins</div>
                          <div className="text-yellow-400 flex text-sm">★★★★★</div>
                      </div>
                  </div>
                  <p className="text-xl text-slate-300 italic leading-relaxed">
                      "Switching to Sentinel Bank was the best financial decision I've made. The mobile app is intuitive, and their loan approval process was incredibly fast. Highly recommended!"
                  </p>
              </div>
          </div>
      </section>
    </div>
  );
}

function QuickAction({ icon, title, desc, link }: { icon: React.ReactNode, title: string, desc: string, link: string }) {
    return (
        <Link to={link} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition group">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition border border-slate-100">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">{title}</h3>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-indigo-500 transform group-hover:translate-x-1 transition" />
        </Link>
    )
}

function ProductCard({ title, desc, icon, link }: { title: string, desc: string, icon: React.ReactNode, link: string }) {
    return (
        <Link to={link} className="p-8 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:border-indigo-100 transition duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 group-hover:bg-indigo-100"></div>
            <div className="relative z-10">
                <div className="mb-6 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-sm">
                    {icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition">{title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
            </div>
        </Link>
    )
}

function FeatureRow({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
    return (
        <div className="flex gap-4">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-700">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
