import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-navy-mid">
      <div className="absolute inset-0 shimmer-line opacity-20" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-display text-4xl md:text-6xl font-bold text-platinum mb-6">
          Ready to <span className="gold-text">Begin?</span>
        </h2>
        <p className="text-heading text-xl text-silver mb-10 max-w-xl mx-auto">
          Apply today and get a decision within 48 hours. No hidden fees, no surprises.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn-gold flex items-center gap-2 text-base px-10 py-4">
            Start Application <ArrowRight size={18} />
          </Link>
          <Link to="/contact" className="btn-outline-gold text-base px-10 py-4">
            Talk to an Advisor
          </Link>
        </div>
      </div>
    </section>
  );
}
