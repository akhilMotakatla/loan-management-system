import { motion } from 'framer-motion';
import { FileText, Upload, CheckSquare, Banknote, UserCheck } from 'lucide-react';

const steps = [
  { num: '01', icon: UserCheck,   title: 'Choose Loan Type', desc: 'Select from Personal, Home, Auto or Other — each with dedicated rates and terms designed for your unique situation.', color: '#D4AF37' },
  { num: '02', icon: FileText,    title: 'Fill Application', desc: 'Complete our smart digital form in minutes. We only ask what we need — no jargon, no unnecessary fields.', color: '#C09830' },
  { num: '03', icon: Upload,      title: 'Upload Documents', desc: 'Securely submit your identity, income proof, and supporting documents through our encrypted portal.', color: '#A88320' },
  { num: '04', icon: CheckSquare, title: 'Get Approved',     desc: 'Our expert team reviews your application within 48 hours and notifies you instantly with a clear decision.', color: '#D4AF37' },
  { num: '05', icon: Banknote,    title: 'Receive Funds',    desc: 'Approved amount transferred directly to your bank account the same business day, with zero hidden charges.', color: '#C09830' },
];

export default function HowItWorksSection() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#07051A 0%,#03020A 100%)' }}>
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#D4AF37 1px,transparent 1px),linear-gradient(90deg,#D4AF37 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="flex items-center justify-center gap-3 text-gold-primary text-xs font-semibold tracking-[0.35em] uppercase mb-4">
            <span className="w-8 h-px bg-gold-primary" /> Simple Process <span className="w-8 h-px bg-gold-primary" />
          </p>
          <h2 className="section-title text-platinum mb-3">How It <span className="gold-text">Works</span></h2>
          <p className="section-subtitle max-w-lg mx-auto">A seamless, fully digital loan journey in five steps</p>
          <div className="gold-divider mt-6" />
        </motion.div>

        <div className="relative">
          {/* Vertical connecting line */}
          <motion.div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden lg:block"
            style={{ background: 'linear-gradient(180deg,transparent,rgba(212,175,55,0.3) 10%,rgba(212,175,55,0.3) 90%,transparent)' }}
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            whileInView={{ scaleY: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.3 }} />

          <div className="space-y-10 lg:space-y-0">
            {steps.map((step, i) => {
              const Icon    = step.icon;
              const isRight = i % 2 !== 0;
              return (
                <motion.div key={step.num}
                  className={`relative flex items-center gap-6 lg:gap-0 ${isRight ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                  initial={{ opacity: 0, x: isRight ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}>

                  {/* Content */}
                  <div className={`flex-1 ${isRight ? 'lg:pl-16' : 'lg:pr-16'}`}>
                    <div className={`group glass-card rounded-sm p-7 hover:shadow-gold hover:-translate-y-1 transition-all duration-400 max-w-md ${isRight ? 'lg:ml-0' : 'lg:ml-auto'}`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-11 h-11 rounded-sm flex items-center justify-center flex-shrink-0"
                          style={{ background: `${step.color}18`, border: `1px solid ${step.color}50` }}>
                          <Icon size={18} style={{ color: step.color }} />
                        </div>
                        <span className="text-display text-3xl font-bold opacity-40" style={{ color: step.color }}>{step.num}</span>
                      </div>
                      <h3 className="text-platinum font-bold text-lg mb-2 group-hover:text-gold-pale transition-colors">{step.title}</h3>
                      <p className="text-silver text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {/* Center node */}
                  <div className="hidden lg:flex w-14 flex-shrink-0 items-center justify-center z-10">
                    <div className="w-4 h-4 rounded-full bg-obsidian border-2 border-gold-primary"
                      style={{ boxShadow: `0 0 18px ${step.color}80` }} />
                  </div>

                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
