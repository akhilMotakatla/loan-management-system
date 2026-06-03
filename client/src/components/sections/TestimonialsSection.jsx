import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';

const testimonials = [
  { name: 'Sarah Johnson', role: 'Homeowner', text: 'Premier Bank made my dream home a reality. The process was seamless and the rate was the best I found. Highly recommend!', rating: 5 },
  { name: 'Michael Chen',  role: 'Entrepreneur', text: 'Got a business loan approved in 48 hours. The digital experience was world-class. Their team guided me every step.', rating: 5 },
  { name: 'Emma Williams', role: 'Teacher', text: 'The personal loan helped me pay for my Masters degree. The EMI calculator made planning so easy. Thank you Premier Bank!', rating: 5 },
  { name: 'David Rodriguez', role: 'Engineer', text: 'Financed my first car through Premier Bank. Lowest auto loan rate I found after comparing 6 banks. Outstanding service.', rating: 5 },
];

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const titleRef = useScrollAnimation('fadeUp');

  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx((i) => (i + 1) % testimonials.length);
  const t = testimonials[idx];

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #050B1A 0%, #0D1B3E 100%)" }}>
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/images/testimonial-bg.jpg')" }} />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div ref={titleRef}>
          <p className="text-gold-primary text-sm tracking-[0.3em] uppercase mb-3">Testimonials</p>
          <h2 className="section-title text-platinum mb-4">Client <span className="gold-text">Stories</span></h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            className="glass-card rounded-sm p-10 mt-12">
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={18} className="text-gold-primary fill-gold-primary" />)}
            </div>
            <blockquote className="text-heading text-2xl text-platinum italic leading-relaxed mb-8">"{t.text}"</blockquote>
            <div>
              <p className="text-gold-primary font-semibold">{t.name}</p>
              <p className="text-muted text-sm">{t.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-4 mt-8">
          <button onClick={prev} className="w-10 h-10 border border-navy-light rounded-full flex items-center justify-center text-muted hover:border-gold-primary hover:text-gold-primary transition-all">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2 items-center">
            {testimonials.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-gold-primary w-6' : 'bg-navy-light'}`} />)}
          </div>
          <button onClick={next} className="w-10 h-10 border border-navy-light rounded-full flex items-center justify-center text-muted hover:border-gold-primary hover:text-gold-primary transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
