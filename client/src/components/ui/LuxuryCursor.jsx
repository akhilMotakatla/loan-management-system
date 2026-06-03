import { useEffect, useRef, useState } from 'react';

export default function LuxuryCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf  = useRef(null);

  useEffect(() => {
    // Only show on non-touch devices
    if ('ontouchstart' in window) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      }
    };

    const onEnter = (e) => {
      const el = e.target;
      if (el.matches('a,button,[role="button"],input,select,textarea,[data-cursor]'))
        setHovered(true);
    };
    const onLeave = (e) => {
      const el = e.target;
      if (el.matches('a,button,[role="button"],input,select,textarea,[data-cursor]'))
        setHovered(false);
    };
    const onDown = () => { setClicked(true);  setTimeout(() => setClicked(false), 200); };

    const animate = () => {
      const lerp = 0.11;
      ring.current.x += (pos.current.x - ring.current.x) * lerp;
      ring.current.y += (pos.current.y - ring.current.y) * lerp;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onEnter);
    window.addEventListener('mouseout',  onLeave);
    window.addEventListener('mousedown', onDown);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onEnter);
      window.removeEventListener('mouseout',  onLeave);
      window.removeEventListener('mousedown', onDown);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" style={{ mixBlendMode: 'normal' }}>
      {/* Dot — snaps instantly */}
      <div ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          width:  hovered ? 6 : 5,
          height: hovered ? 6 : 5,
          background: hovered ? '#FFD700' : '#D4AF37',
          transition: 'width .2s,height .2s,background .2s',
          boxShadow: hovered ? '0 0 8px rgba(255,215,0,0.8)' : 'none',
        }} />

      {/* Ring — lerped follow */}
      <div ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border will-change-transform"
        style={{
          width:  clicked ? 28 : hovered ? 40 : 32,
          height: clicked ? 28 : hovered ? 40 : 32,
          borderColor: hovered ? 'rgba(255,215,0,0.7)' : 'rgba(212,175,55,0.4)',
          borderWidth: hovered ? 1.5 : 1,
          transition: 'width .25s cubic-bezier(.25,.46,.45,.94),height .25s cubic-bezier(.25,.46,.45,.94),border-color .2s,border-width .2s',
          boxShadow: hovered ? '0 0 16px rgba(212,175,55,0.25)' : 'none',
        }} />
    </div>
  );
}
