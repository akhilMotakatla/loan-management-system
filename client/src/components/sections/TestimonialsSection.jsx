import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  { name: 'Sarah Johnson',    role: 'Homeowner',    initials: 'SJ', color: '#D4AF37', rating: 5, text: 'Premier Bank made my dream home a reality. The entire process was transparent, the rate was the best I found after comparing seven banks, and the team guided me every single step of the way.' },
  { name: 'Michael Chen',     role: 'Entrepreneur', initials: 'MC', color: '#C09830', rating: 5, text: 'Got my business expansion loan approved in 48 hours. The digital experience was world-class — I completed the entire application from my phone. Outstanding service, outstanding rates.' },
  { name: 'Emma Williams',    role: 'Educator',     initials: 'EW', color: '#A88320', rating: 5, text: 'The personal loan helped me fund my Masters degree without the stress. The EMI calculator let me plan perfectly in advance. I\'ve since referred three colleagues to Premier Bank.' },
  { name: 'David Rodriguez',  role: 'Engineer',     initials: 'DR', color: '#D4AF37', rating: 5, text: 'Financed my first luxury car through Premier Bank. Lowest auto loan rate after comparing six lenders, and the process took less than 24 hours. Genuinely exceptional.' },
];

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx(i => (i + 1) % testimonials.length);
  const t = testimonials[idx];

  return (
    <section className="py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#03020A 0%,#07051A 50%,#03020A 100%)' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-primary/40 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="flex items-center justify-center gap-3 text-gold-primary text-xs font-semibold tracking-[0.35em] uppercase mb-4">
            <span className="w-8 h-px bg-gold-primary" /> Client Stories <span className="w-8 h-px bg-gold-primary" />
          </p>
          <h2 className="section-title text-platinum mb-3">Trusted by <span className="gold-text">50,000+</span></h2>
          <div className="gold-divider mt-4 mb-16" />
        </motion.div>

        {/* Testimonial card */}
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card rounded-sm p-10 lg:p-14 relative">

              {/* Large quote mark */}
              <Quote size={56} className="absolute top-8 left-8 opacity-10" style={{ color: t.color }} />

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} style={{ color: t.color, fill: t.color }} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-heading text-xl lg:text-2xl text-platinum leading-relaxed mb-10 relative z-10">
                "{t.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-navy-deep font-bold text-sm flex-shrink-0"
                  style={{ background: `linear-gradient(135deg,${t.color},#FFD700)` }}>
                  {t.initials}
                </div>
                <div className="text-left">
                  <p className="text-platinum font-semibold">{t.name}</p>
                  <p className="text-muted text-sm">{t.role}</p>
                </div>
              </div>

              {/* Border accent */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-px" style={{ background: `linear-gradient(90deg,transparent,${t.color}60,transparent)` }} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button onClick={prev}
            className="w-11 h-11 rounded-full border border-navy-light hover:border-gold-primary hover:text-gold-primary text-muted transition-all flex items-center justify-center">
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width:    i === idx ? 28 : 8,
                  height:   8,
                  background: i === idx ? 'linear-gradient(90deg,#8B6914,#D4AF37)' : '#1a2060',
                }} />
            ))}
          </div>

          <button onClick={next}
            className="w-11 h-11 rounded-full border border-navy-light hover:border-gold-primary hover:text-gold-primary text-muted transition-all flex items-center justify-center">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
