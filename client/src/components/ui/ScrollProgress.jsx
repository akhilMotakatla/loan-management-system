import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el    = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px] bg-transparent pointer-events-none">
      <div
        className="h-full will-change-transform"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg,#8B6914,#D4AF37,#FFD700)',
          boxShadow: '0 0 8px rgba(212,175,55,0.6)',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
}
