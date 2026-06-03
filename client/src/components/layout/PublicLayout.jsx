import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import FloatingContact from '../ui/FloatingContact.jsx';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-obsidian">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
