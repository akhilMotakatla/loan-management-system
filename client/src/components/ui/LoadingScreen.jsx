import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_NAME } from '../../config/constants.js';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Already loaded before? skip
    if (sessionStorage.getItem('loaded')) { setVisible(false); return; }
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 18;
      });
    }, 120);
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('loaded', '1');
    }, 2600);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#03020A 0%,#07051A 50%,#03020A 100%)' }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}>

          {/* Background radial */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(212,175,55,0.07)_0%,transparent_70%)] pointer-events-none" />

          {/* Corner ornaments */}
          {[['top-6 left-6', 'border-t border-l'], ['top-6 right-6', 'border-t border-r'],
            ['bottom-6 left-6', 'border-b border-l'], ['bottom-6 right-6', 'border-b border-r']].map(([pos, border], i) => (
            <motion.div key={i} className={`absolute ${pos} w-10 h-10 ${border} border-gold-primary/40`}
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }} />
          ))}

          {/* Logo */}
          <motion.div className="flex flex-col items-center gap-5 mb-14"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>

            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center border border-gold-primary/40"
              style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37,#FFD700,#B8860B)' }}
              animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <span className="text-navy-deep text-3xl font-display font-bold">P</span>
            </motion.div>

            <div className="text-center">
              <h1 className="text-display text-3xl font-bold gold-text tracking-wider">{APP_NAME}</h1>
              <p className="text-muted text-[11px] tracking-[0.4em] uppercase mt-1">Excellence · Trust · Legacy</p>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div className="w-56" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="h-px bg-navy-light/50 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#8B6914,#D4AF37,#FFD700)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
              />
            </div>
            <p className="text-center text-muted text-[10px] tracking-[0.35em] uppercase mt-3">
              Loading Experience
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
