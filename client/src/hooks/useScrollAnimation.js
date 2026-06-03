import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const useScrollAnimation = (animation = 'fadeUp', deps = []) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const animations = {
      fadeUp: { from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' } },
      fadeIn: { from: { opacity: 0 },        to: { opacity: 1, duration: 1, ease: 'power2.out' } },
      slideLeft:  { from: { opacity: 0, x: -80 }, to: { opacity: 1, x: 0, duration: 0.8 } },
      slideRight: { from: { opacity: 0, x: 80 },  to: { opacity: 1, x: 0, duration: 0.8 } },
      scaleIn: { from: { opacity: 0, scale: 0.8 }, to: { opacity: 1, scale: 1, duration: 0.7 } },
    };

    const { from, to } = animations[animation] || animations.fadeUp;
    gsap.fromTo(el, from, {
      ...to,
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, deps);

  return ref;
};
