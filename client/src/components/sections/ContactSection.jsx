import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import toast from 'react-hot-toast';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We will get back to you within 24 hours.');
    setForm({ name: '', email: '', message: '' });
    setLoading(false);
  };

  return (
    <section className="py-28 bg-obsidian">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-gold-primary text-sm tracking-[0.3em] uppercase mb-3">Get In Touch</p>
          <h2 className="section-title text-platinum mb-4">Contact <span className="gold-text">Us</span></h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-heading text-2xl text-platinum mb-6">We're here to help</h3>
            <p className="text-muted mb-8">Our financial advisors are available to guide you through any questions about our loan products.</p>
            {[
              { icon: Phone,  label: '+1 (555) 123-4567' },
              { icon: Mail,   label: 'loans@premierbank.com' },
              { icon: MapPin, label: '100 Financial District, New York, NY 10004' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 bg-gold-primary/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-gold-primary" />
                </div>
                <span className="text-silver text-sm">{label}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="glass-card rounded-sm p-8 space-y-5">
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Smith" required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@email.com" required />
            <div>
              <label className="text-silver text-sm tracking-wide block mb-1">Message</label>
              <textarea className="input-luxury w-full h-32 resize-none" placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <Button type="submit" loading={loading} className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
