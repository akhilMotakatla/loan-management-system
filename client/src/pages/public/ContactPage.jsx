import ContactSection from '../../components/sections/ContactSection.jsx';

export default function ContactPage() {
  return (
    <div className="pt-20">
      <section className="pt-16 pb-8 bg-obsidian text-center">
        <p className="text-gold-primary text-sm tracking-[0.3em] uppercase mb-3">Contact</p>
        <h1 className="text-display text-5xl font-bold text-platinum mb-4">Get In <span className="gold-text">Touch</span></h1>
        <p className="text-silver max-w-xl mx-auto">Our advisors are ready to help you choose the right loan product.</p>
      </section>
      <ContactSection />
    </div>
  );
}
