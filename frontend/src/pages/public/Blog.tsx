import { useState } from 'react';
import { ChevronRight, Share2, MessageSquare, Search, Filter, BookOpen } from 'lucide-react';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");

  const CATEGORIES = ["All", "Investing", "Loans", "Security", "Retirement"];
  const ARTICLES = [
    { title: "5 Ways to Protect Against Online Fraud", excerpt: "Learn the essential habits to keep your accounts secure in the digital age.", category: "Security", readTime: "5 min" },
    { title: "Understanding Compound Interest", excerpt: "Why starting early can make a million-dollar difference in your retirement.", category: "Investing", readTime: "8 min" },
    { title: "Home Loan vs Personal Loan: Which is Better?", excerpt: "A detailed comparison to help you choose the right financing option.", category: "Loans", readTime: "6 min" },
    { title: "Tax Saving Strategies for 2026", excerpt: "Maximize your returns with these legal tax-saving instruments.", category: "Retirement", readTime: "10 min" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <section className="bg-slate-900 text-white py-20 px-8 text-center">
         <h1 className="text-5xl font-extrabold mb-6">Financial Wisdom</h1>
         <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">Expert insights, market analysis, and practical advice to help you master your money.</p>
         <div className="max-w-xl mx-auto relative">
             <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
             <input type="text" placeholder="Search articles..." className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
         </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[95%] mx-auto px-8 py-12 flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Filter className="w-4 h-4 text-indigo-600" /> Categories</h3>
                  <div className="space-y-2">
                      {CATEGORIES.map(cat => (
                          <button 
                            key={cat} 
                            onClick={() => setActiveCategory(cat)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${activeCategory === cat ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                              {cat}
                          </button>
                      ))}
                  </div>
              </div>
              <div className="bg-indigo-600 p-6 rounded-2xl text-white">
                  <h3 className="font-bold text-lg mb-2">Subscribe needed?</h3>
                  <p className="text-sm opacity-90 mb-4">Get the latest financial news delivered to your inbox.</p>
                  <input type="email" placeholder="Your email" className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-white/50 text-white mb-2 focus:outline-none" />
                  <button className="w-full bg-white text-indigo-700 font-bold py-2 rounded-lg hover:bg-indigo-50 transition">Subscribe</button>
              </div>
          </aside>

          {/* Feed */}
          <div className="flex-1 space-y-8">
              {ARTICLES.map((article, i) => (
                  <article key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group cursor-pointer">
                      <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{article.category}</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1"><BookOpen className="w-3 h-3" /> {article.readTime} read</span>
                      </div>
                      <h2 className="text-2xl font-bold mb-3 group-hover:text-indigo-600 transition">{article.title}</h2>
                      <p className="text-slate-600 mb-6 leading-relaxed">{article.excerpt}</p>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                          <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read Full Article <ChevronRight className="w-4 h-4" /></button>
                          <div className="flex gap-4 text-slate-400">
                              <Share2 className="w-4 h-4 hover:text-slate-600 transition" />
                              <MessageSquare className="w-4 h-4 hover:text-slate-600 transition" />
                          </div>
                      </div>
                  </article>
              ))}
          </div>
      </div>
    </div>
  );
}
