import { Link } from 'react-router-dom';
import { APP_NAME } from '../../config/constants.js';

export default function Footer() {
  return (
    <footer className="bg-obsidian border-t border-navy-mid">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold-gradient rounded-sm flex items-center justify-center">
                <span className="text-navy-deep font-bold text-sm">P</span>
              </div>
              <span className="text-display text-xl font-bold gold-text">{APP_NAME}</span>
            </div>
            <p className="text-muted text-sm leading-relaxed">Your trusted partner for financial excellence. We provide tailored loan solutions for every life stage.</p>
          </div>

          {[
            { title: 'Loan Products', links: [{ to: '/loans', label: 'Personal Loan' }, { to: '/loans', label: 'Home Loan' }, { to: '/loans', label: 'Auto Loan' }, { to: '/loans', label: 'Other Loans' }] },
            { title: 'Quick Links',   links: [{ to: '/calculator', label: 'EMI Calculator' }, { to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact' }, { to: '/register', label: 'Apply Now' }] },
            { title: 'Legal',         links: [{ to: '/', label: 'Privacy Policy' }, { to: '/', label: 'Terms of Service' }, { to: '/', label: 'Disclaimer' }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-gold-pale text-sm font-semibold tracking-widest uppercase mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => <li key={l.label}><Link to={l.to} className="text-muted hover:text-silver transition-colors text-sm">{l.label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-navy-mid mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-xs">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="text-muted text-xs">Licensed & Regulated Financial Institution</p>
        </div>
      </div>
    </footer>
  );
}
