import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';
import ScrollToTop from './ScrollToTop';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
      <ScrollToTop />
    </div>
  );
}
