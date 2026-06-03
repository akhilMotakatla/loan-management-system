import { useState } from 'react';
import { Phone, X, MessageSquare, Mail, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-card rounded-sm p-5 w-64 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">

            <p className="text-gold-pale text-xs font-bold tracking-[0.2em] uppercase mb-4">Contact Us</p>

            <div className="space-y-3">
              <a href="tel:+15551234567" className="flex items-center gap-3 py-2.5 px-3 rounded-sm hover:bg-navy-light transition-colors group">
                <div className="w-8 h-8 rounded-sm bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-primary/20 transition-colors">
                  <Phone size={14} className="text-gold-primary" />
                </div>
                <div>
                  <p className="text-platinum text-xs font-medium">Call Us</p>
                  <p className="text-muted text-[10px]">+1 (555) 123-4567</p>
                </div>
              </a>

              <Link to="/contact" onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-2.5 px-3 rounded-sm hover:bg-navy-light transition-colors group">
                <div className="w-8 h-8 rounded-sm bg-sapphire/10 border border-sapphire/30 flex items-center justify-center flex-shrink-0 group-hover:bg-sapphire/20 transition-colors">
                  <MessageSquare size={14} className="text-sapphire" />
                </div>
                <div>
                  <p className="text-platinum text-xs font-medium">Send Message</p>
                  <p className="text-muted text-[10px]">We reply within 2 hours</p>
                </div>
              </Link>

              <a href="mailto:loans@premierbank.com"
                className="flex items-center gap-3 py-2.5 px-3 rounded-sm hover:bg-navy-light transition-colors group">
                <div className="w-8 h-8 rounded-sm bg-emerald/10 border border-emerald/30 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald/20 transition-colors">
                  <Mail size={14} className="text-emerald" />
                </div>
                <div>
                  <p className="text-platinum text-xs font-medium">Email Us</p>
                  <p className="text-muted text-[10px]">loans@premierbank.com</p>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-navy-light">
              <Clock size={11} className="text-emerald" />
              <p className="text-muted text-[10px]">Mon–Fri 9am–6pm EST</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all"
        style={{
          background: open
            ? 'linear-gradient(135deg,#8B6914,#D4AF37)'
            : 'linear-gradient(135deg,#8B6914,#D4AF37,#FFD700,#B8860B)',
          boxShadow: open ? '0 0 20px rgba(212,175,55,0.4)' : '0 0 30px rgba(212,175,55,0.5)',
        }}>
        {open ? <X size={20} className="text-navy-deep" /> : <Phone size={20} className="text-navy-deep" />}
      </motion.button>
    </div>
  );
}
