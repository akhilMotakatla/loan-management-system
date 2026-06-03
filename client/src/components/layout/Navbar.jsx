import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore.js';
import { APP_NAME } from '../../config/constants.js';

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [userMenu,   setUserMenu]   = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    setUserMenu(false);
    await logout();
    navigate('/');
  };

  const links = [
    { to: '/',           label: 'Home' },
    { to: '/about',      label: 'About' },
    { to: '/loans',      label: 'Loan Products' },
    { to: '/calculator', label: 'Calculator' },
    { to: '/contact',    label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-navy-deep/95 backdrop-blur-xl border-b border-gold-primary/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-sm bg-gold-gradient flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-all duration-300">
            <span className="text-navy-deep font-bold text-base font-display">P</span>
          </div>
          <div>
            <span className="text-display text-lg font-bold gold-text">{APP_NAME}</span>
            <p className="text-muted text-[9px] tracking-[0.2em] uppercase -mt-0.5">Est. 1985</p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              className={`nav-link relative py-1 ${location.pathname === l.to ? 'text-gold-primary' : ''}`}>
              {l.label}
              {location.pathname === l.to && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold-gradient" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop auth area */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/notifications"
                className="w-9 h-9 flex items-center justify-center text-silver hover:text-gold-primary border border-navy-light hover:border-gold-primary/40 rounded-sm transition-all">
                <Bell size={17} />
              </Link>

              {/* User dropdown */}
              <div className="relative">
                <button onClick={() => setUserMenu(v => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gold-primary/30 rounded-sm hover:border-gold-primary hover:bg-gold-primary/5 transition-all">
                  <div className="w-6 h-6 bg-gold-gradient rounded-full flex items-center justify-center text-navy-deep text-xs font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="text-platinum text-sm">{user?.firstName}</span>
                  <ChevronDown size={14} className={`text-muted transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-navy-mid border border-gold-primary/20 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-navy-light">
                        <p className="text-platinum text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-muted text-xs capitalize">{user?.role}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-silver hover:text-gold-primary hover:bg-gold-primary/5 transition-colors text-sm">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      {user?.role !== 'customer' && (
                        <Link to="/admin" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-silver hover:text-gold-primary hover:bg-gold-primary/5 transition-colors text-sm">
                          <LayoutDashboard size={15} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-ruby hover:bg-ruby/10 transition-colors text-sm border-t border-navy-light">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link px-4 py-2 border border-navy-light hover:border-gold-primary/40 rounded-sm transition-all">
                Sign In
              </Link>
              <Link to="/register" className="btn-gold flex items-center gap-2 shadow-gold hover:shadow-gold-lg">
                Open Account
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden text-platinum p-1" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="lg:hidden bg-navy-mid/95 backdrop-blur-xl border-t border-gold-primary/10 px-6 py-4"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                  className={`py-3 px-4 rounded-sm text-sm transition-colors ${location.pathname === l.to ? 'text-gold-primary bg-gold-primary/10' : 'text-silver hover:text-platinum hover:bg-navy-light'}`}>
                  {l.label}
                </Link>
              ))}
              <div className="border-t border-navy-light my-2" />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 py-3 px-4 text-silver hover:text-gold-primary text-sm">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-2 py-3 px-4 text-ruby text-sm font-medium">
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login"    onClick={() => setMenuOpen(false)} className="py-3 px-4 text-silver hover:text-platinum text-sm">Sign In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-gold text-center mt-1">Open Account</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
