import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield, Award, Globe } from 'lucide-react';
import { APP_NAME } from '../../config/constants.js';

const columns = [
  {
    title: 'Loan Products',
    links: [
      { to: '/loans', label: 'Personal Loan' },
      { to: '/loans', label: 'Home Loan' },
      { to: '/loans', label: 'Auto Loan' },
      { to: '/loans', label: 'Business Loan' },
      { to: '/calculator', label: 'EMI Calculator' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about',    label: 'About Premier Bank' },
      { to: '/loans',    label: 'Loan Products' },
      { to: '/contact',  label: 'Contact Us' },
      { to: '/register', label: 'Open an Account' },
      { to: '/login',    label: 'Customer Portal' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/', label: 'Privacy Policy' },
      { to: '/', label: 'Terms of Service' },
      { to: '/', label: 'Loan Agreement' },
      { to: '/', label: 'Fair Practice Code' },
      { to: '/', label: 'Grievance Redressal' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: '#03020A' }}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />

      {/* CTA strip */}
      <div className="border-b border-navy-mid/50" style={{ background: 'rgba(14,16,53,0.25)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-platinum font-semibold text-lg">Secure. Transparent. Human.</p>
            <p className="text-muted text-sm">Join 50,000+ customers who trust Premier Bank.</p>
          </div>
          <Link to="/register" className="btn-gold flex-shrink-0 shadow-gold">
            Open Account — Free
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-sm flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37,#FFD700,#B8860B)' }}>
                <span className="text-navy-deep font-bold text-lg font-display">P</span>
              </div>
              <div>
                <span className="text-display text-xl font-bold gold-text">{APP_NAME}</span>
                <p className="text-muted text-[9px] tracking-[0.25em] uppercase">Est. 1985</p>
              </div>
            </Link>
            <p className="text-silver text-sm leading-relaxed mb-6 max-w-sm">
              Serving individuals and families with trusted financial solutions for over 40 years.
              Your goals are our purpose.
            </p>
            <div className="space-y-3">
              {[
                { icon: Phone, text: '+1 (555) 123-4567' },
                { icon: Mail,  text: 'loans@premierbank.com' },
                { icon: MapPin,text: '100 Financial District, New York' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={13} className="text-gold-primary flex-shrink-0" />
                  <span className="text-muted text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-gold-pale text-[11px] font-bold tracking-[0.22em] uppercase mb-5">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}
                      className="text-muted text-sm hover:text-gold-primary transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-0 h-px bg-gold-primary group-hover:w-3 transition-all duration-300 flex-shrink-0" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-navy-mid/30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved. Licensed & Regulated.
          </p>
          <div className="flex items-center gap-5">
            {[{ icon: Shield, label: 'RBI Licensed' }, { icon: Award, label: 'ISO 27001' }, { icon: Globe, label: 'FDIC Insured' }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-muted">
                <Icon size={12} className="text-gold-dark" />
                <span className="text-[11px] tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
