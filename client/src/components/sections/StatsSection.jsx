import { useRef, useEffect, useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';

const stats = [
  { value: 50000, suffix: '+', label: 'Happy Customers',     prefix: '' },
  { value: 2.5,   suffix: 'B+', label: 'Loans Disbursed',   prefix: '$' },
  { value: 98,    suffix: '%',  label: 'Approval Rate',      prefix: '' },
  { value: 7.5,   suffix: '%',  label: 'Lowest Rate',        prefix: '' },
];

function Counter({ target, prefix, suffix, start }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const duration = 2000, steps = 60, increment = target / steps;
    let c = 0;
    const timer = setInterval(() => {
      c = Math.min(c + increment, target);
      setCount(Number.isInteger(target) ? Math.floor(c) : Math.round(c * 10) / 10);
      if (c >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [start, target]);

  return <span>{prefix}{count}{suffix}</span>;
}

export default function StatsSection() {
  const sectionRef = useScrollAnimation('fadeUp');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 bg-obsidian border-y border-navy-mid">
      <div className="max-w-7xl mx-auto px-6" ref={sectionRef}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-display text-4xl md:text-5xl font-bold gold-text mb-2">
                <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} start={visible} />
              </div>
              <p className="text-muted text-sm tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
