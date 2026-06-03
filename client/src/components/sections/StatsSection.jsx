import { useRef, useEffect, useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';

const stats = [
  { value: 50000, suffix: '+',  label: 'Happy Customers',  prefix: '',  desc: 'Families served' },
  { value: 2.5,   suffix: 'B+', label: 'Loans Disbursed',  prefix: '$', desc: 'Total portfolio' },
  { value: 98,    suffix: '%',  label: 'Approval Rate',     prefix: '',  desc: 'Industry leading' },
  { value: 7.5,   suffix: '%',  label: 'Lowest Rate',       prefix: '',  desc: 'Per annum' },
];

function Counter({ target, prefix, suffix, start }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const steps = 80, duration = 2200;
    let c = 0;
    const timer = setInterval(() => {
      c = Math.min(c + target / steps, target);
      setCount(Number.isInteger(target) ? Math.floor(c) : Math.round(c * 10) / 10);
      if (c >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [start, target]);
  return <>{prefix}{count}{suffix}</>;
}

export default function StatsSection() {
  const sectionRef = useScrollAnimation('fadeUp');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#04030f 0%,#0a0820 50%,#04030f 100%)' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_65%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-primary/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6" ref={sectionRef}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold-primary/10 rounded-sm overflow-hidden border border-gold-primary/15">
          {stats.map((s) => (
            <div key={s.label} className="relative bg-[#070515] px-6 py-12 text-center group hover:bg-[#0e1035] transition-colors duration-500">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold-gradient scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="text-display text-4xl md:text-5xl font-bold mb-1"
                style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} start={visible} />
              </div>
              <p className="text-platinum text-sm font-semibold tracking-wider mb-1">{s.label}</p>
              <p className="text-muted text-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
