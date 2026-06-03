import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import CTASection from '../../components/sections/CTASection.jsx';

const values = [
  { title: 'Integrity',    desc: 'We uphold the highest standards of honesty and transparency in every interaction.' },
  { title: 'Excellence',   desc: 'Our team strives for exceptional service, ensuring your financial goals are met.' },
  { title: 'Innovation',   desc: 'Leveraging technology to make banking faster, simpler and more accessible.' },
  { title: 'Community',    desc: 'Reinvesting in the communities we serve to create shared financial prosperity.' },
];

export default function AboutPage() {
  const titleRef = useScrollAnimation('fadeUp');
  return (
    <>
      <section className="min-h-[60vh] relative flex items-center pt-28 pb-20">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/images/about-bg.jpg')" }} />
        <div className="absolute inset-0 bg-navy-deep/80" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold-primary text-sm tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h1 className="text-display text-5xl md:text-6xl font-bold text-platinum mb-6">About <span className="gold-text">Premier Bank</span></h1>
          <p className="text-heading text-xl text-silver max-w-2xl mx-auto">Founded in 1985, Premier Bank has been serving individuals and families with trusted financial solutions for over 40 years.</p>
        </div>
      </section>

      <section className="py-24 bg-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div ref={titleRef}>
              <p className="text-gold-primary text-sm tracking-[0.3em] uppercase mb-3">Mission</p>
              <h2 className="section-title text-platinum mb-6">Empowering <span className="gold-text">Financial Dreams</span></h2>
              <p className="text-silver leading-relaxed mb-6">Premier Bank exists to make quality financial products accessible to everyone. We believe that the right loan at the right rate can transform lives — and we're committed to that transformation.</p>
              <p className="text-silver leading-relaxed">With over $2.5 billion in loans disbursed and 50,000+ satisfied customers, we are one of the most trusted names in personal finance.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ n: '40+', l: 'Years of Service' }, { n: '$2.5B+', l: 'Loans Disbursed' }, { n: '50K+', l: 'Customers Served' }, { n: '99%', l: 'Customer Satisfaction' }].map((s) => (
                <div key={s.n} className="glass-card rounded-sm p-6 text-center">
                  <p className="text-display text-3xl font-bold gold-text mb-2">{s.n}</p>
                  <p className="text-muted text-sm">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="section-title text-platinum mb-4">Our <span className="gold-text">Values</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const r = useScrollAnimation('scaleIn');
              return (
                <div key={v.title} ref={r} className="glass-card rounded-sm p-6 text-center hover:shadow-gold transition-all duration-500">
                  <div className="w-12 h-12 bg-gold-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gold-primary font-bold text-lg">{String(i+1).padStart(2,'0')}</span>
                  </div>
                  <h3 className="text-platinum font-semibold mb-2">{v.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
