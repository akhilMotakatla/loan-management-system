import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Bell, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore.js';
import { APP_NAME } from '../../config/constants.js';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const links = [
    { to: '/',           label: 'Home' },
    { to: '/about',      label: 'About' },
    { to: '/loans',      label: 'Loan Products' },
    { to: '/calculator', label: 'Calculator' },
    { to: '/contact',    label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'glass-card shadow-glass py-3' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold-gradient rounded-sm flex items-center justify-center">
            <span className="text-navy-deep font-bold text-sm">P</span>
          </div>
          <span className="text-display text-xl font-bold gold-text">{APP_NAME}</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`nav-link ${location.pathname === l.to ? 'text-gold-primary' : ''}`}>{l.label}</Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="text-silver hover:text-gold-primary transition-colors"><Bell size={20} /></Link>
              <Link to="/dashboard" className="text-silver hover:text-gold-primary transition-colors text-sm">{user?.firstName}</Link>
              {user?.role !== 'customer' && <Link to="/admin" className="nav-link">Admin</Link>}
              <button onClick={handleLogout} className="text-muted hover:text-ruby transition-colors"><LogOut size={18} /></button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-gold">Apply Now</Link>
            </>
          )}
        </div>

        <button className="lg:hidden text-platinum" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="lg:hidden glass-card mt-2 mx-4 rounded-sm p-6"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex flex-col gap-4">
              {links.map((l) => <Link key={l.to} to={l.to} className="nav-link py-1" onClick={() => setMenuOpen(false)}>{l.label}</Link>)}
              <hr className="border-navy-light" />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="nav-link text-left text-ruby">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-gold text-center" onClick={() => setMenuOpen(false)}>Apply Now</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
