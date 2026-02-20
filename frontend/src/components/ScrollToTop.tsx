
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to 400px
  const toggleVisibility = () => {
    if (window.pageYOffset > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`fixed bottom-24 right-8 z-[60] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-75'}`}>
      <button
        onClick={scrollToTop}
        className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 border border-indigo-400/20 group transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
        aria-label="Scroll to top"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
        
        {/* Particle effect background */}
        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-indigo-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
      </button>
    </div>
  );
}
