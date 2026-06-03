import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';

const steps = [
  { num: '01', title: 'Choose Loan Type',  desc: 'Select from personal, home, auto or other loan options tailored to your needs.' },
  { num: '02', title: 'Fill Application',  desc: 'Complete our simple digital form with your personal and financial details.' },
  { num: '03', title: 'Upload Documents',  desc: 'Securely upload identity, income, and any required supporting documents.' },
  { num: '04', title: 'Get Approved',      desc: 'Our team reviews your application within 48 hours and notifies you instantly.' },
  { num: '05', title: 'Receive Funds',     desc: 'Approved funds are disbursed directly to your bank account same day.' },
];

export default function HowItWorksSection() {
  const titleRef = useScrollAnimation('fadeUp');
  return (
    <section className="py-28 bg-obsidian">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-16">
          <p className="text-gold-primary text-sm tracking-[0.3em] uppercase mb-3">Process</p>
          <h2 className="section-title text-platinum mb-4">How It <span className="gold-text">Works</span></h2>
          <p className="section-subtitle max-w-xl mx-auto">A seamless, fully digital loan journey in five simple steps</p>
        </div>

        <div className="relative">
          <div className="absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold-primary/40 to-transparent hidden lg:block" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((s, i) => {
              const ref = useScrollAnimation('fadeUp');
              return (
                <div key={s.num} ref={ref} className="relative text-center group">
                  <div className="w-16 h-16 bg-navy-mid border-2 border-gold-primary/30 group-hover:border-gold-primary rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:shadow-gold relative z-10">
                    <span className="text-display text-gold-primary font-bold">{s.num}</span>
                  </div>
                  <h4 className="text-platinum font-semibold mb-2 group-hover:text-gold-primary transition-colors">{s.title}</h4>
                  <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
