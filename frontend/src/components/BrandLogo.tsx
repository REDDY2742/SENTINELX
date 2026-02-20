
export const BrandLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`${className} relative flex items-center justify-center group pointer-events-auto cursor-pointer`}>
    {/* Outer Glow/Halo */}
    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-500"></div>
    
    {/* Main Container */}
    <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl overflow-hidden shadow-xl shadow-indigo-600/20 border border-indigo-400/30 flex items-center justify-center">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#fff_1px,transparent_1px)] bg-[length:4px_4px]"></div>
      
      {/* SVG Logo */}
      <svg 
        viewBox="0 0 40 40" 
        className="w-7 h-7 text-white" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Shield Outer */}
        <path 
          d="M20 5L32 10V22C32 28.5 25.5 33.5 20 35C14.5 33.5 8 28.5 8 22V10L20 5Z" 
          stroke="url(#logo-grad)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />
        
        {/* Inner Security Core */}
        <circle 
          cx="20" 
          cy="20" 
          r="4" 
          fill="white" 
          className="animate-pulse"
        />
        
        {/* Orbiting Elements */}
        <path 
          d="M15 15C15 15 17 12 20 12C23 12 25 15 25 15" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          className="opacity-60"
        />
        <path 
          d="M15 25C15 25 17 28 20 28C23 28 25 25 25 25" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          className="opacity-60"
        />
      </svg>
      
      {/* Reflection Shine */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </div>
  </div>
);
