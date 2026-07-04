import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { Heart, ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react';

const WEBHOOK_URL = 'https://hook.us2.make.com/9z1ldu1b99eooozbpe3a4u99p5b19ji2';
const REQUEST_TIMEOUT_MS = 10000;

export default function ContactSection() {
  const formRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    website: '',
    service: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current || status === 'submitting') {
      return;
    }

    isSubmittingRef.current = true;
    setErrorMessage('');
    setStatus('submitting');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const firstName = formData.fullName.split(' ')[0] || '';
      const lastName = formData.fullName.split(' ').slice(1).join(' ');

      const payload = {
        submissionId: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
        name: formData.fullName,
        first_name: firstName,
        firstName,
        last_name: lastName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.businessName,
        company_name: formData.businessName,
        businessName: formData.businessName,
        website: formData.website,
        service: formData.service,
        source: 'Website Contact Form',
        form_name: 'Website Contact Form',
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
        keepalive: true,
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed with status ${response.status}`);
      }

      setStatus('success');
      setFormData({ fullName: '', email: '', phone: '', businessName: '', website: '', service: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Submission failed. Please try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      clearTimeout(timeoutId);
      isSubmittingRef.current = false;
    }
  };

  const background = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(225, 29, 46, 0.08), transparent 80%)`;
  const secondaryBackground = useMotionTemplate`radial-gradient(400px circle at ${springX}px ${springY}px, rgba(225, 29, 46, 0.04), transparent 80%)`;

  return (
    <section id="contact" className="py-24 bg-surface relative overflow-hidden border-b border-zinc-200">
      {/* Background Soft Red Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-red-light/30 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-red-light/20 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-6 w-fit">
            Get Proposal
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink mb-6 leading-tight">
            Ready to Scale Your <br />
            <span className="text-brand-red">Conversions?</span>
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-10 max-w-md font-light">
            Fill out the form for a free conversion-performance proposal. We'll find exactly where your website is leaking leads and deliver a custom blueprint to fix it.
          </p>

          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface-alt p-6 rounded-[24px] flex items-center gap-6 border border-zinc-200 hover:border-brand-red/30 transition-all duration-300 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-red-light flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="font-bold text-ink text-lg mb-0.5">High Abandonment</h4>
                <p className="text-muted text-sm">Stop letting visitors slip away due to slow speeds and friction.</p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface-alt p-6 rounded-[24px] flex items-center gap-6 border border-zinc-200 hover:border-brand-red/30 transition-all duration-300 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-red-light flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="font-bold text-ink text-lg mb-0.5">Missed Revenues</h4>
                <p className="text-muted text-sm">Turn cold search queries and ads traffic into immediate booked calls.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Form */}
        <motion.div
          ref={formRef}
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-white border border-zinc-200 p-8 md:p-10 rounded-[40px] group overflow-hidden shadow-lg"
        >
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75"
            style={{ background: secondaryBackground }}
          />

          <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-muted">Full Name</label>
              <input 
                type="text" 
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe" 
                className="w-full bg-zinc-50 border border-zinc-200 text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:border-brand-red focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,46,0.1)] transition-all duration-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted">Business Email</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@company.com" 
                className="w-full bg-zinc-50 border border-zinc-200 text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:border-brand-red focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,46,0.1)] transition-all duration-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="businessName" className="text-xs font-bold uppercase tracking-wider text-muted">Business Name</label>
              <input 
                type="text" 
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                placeholder="Acme Corp" 
                className="w-full bg-zinc-50 border border-zinc-200 text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:border-brand-red focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,46,0.1)] transition-all duration-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="website" className="text-xs font-bold uppercase tracking-wider text-muted">Website <span className="text-zinc-400 lowercase font-normal tracking-normal">(optional)</span></label>
              <input 
                type="url" 
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com" 
                className="w-full bg-zinc-50 border border-zinc-200 text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:border-brand-red focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,46,0.1)] transition-all duration-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted">Phone Number</label>
              <input 
                type="tel" 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1 (555) 000-0000" 
                className="w-full bg-zinc-50 border border-zinc-200 text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:border-brand-red focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,46,0.1)] transition-all duration-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="service" className="text-xs font-bold uppercase tracking-wider text-muted">
                Select Service
              </label>
              <div className="relative">
                <select 
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:border-brand-red focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,46,0.1)] transition-all duration-200 appearance-none cursor-pointer text-sm"
                >
                  <option value="" disabled className="text-zinc-400">Select a service...</option>
                  <option value="Website-Development">Website Development</option>
                  <option value="SEO">Google Ranking (SEO)</option>
                  <option value="Meta-Ads">Meta Ads</option>
                  <option value="Social-Media">Social Media</option>
                  <option value="Content-Creation">Content Creation</option>
                  <option value="Digital-Strategy">Digital Strategy</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={status === 'submitting' || status === 'success'}
              className={`w-full font-bold py-4 rounded-full text-base transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                status === 'success' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : status === 'error'
                  ? 'bg-brand-red text-white shadow-lg'
                  : 'bg-brand-red hover:bg-brand-red-dark text-white shadow-lg shadow-brand-red/10 hover:shadow-brand-red/30'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {status === 'submitting' ? (
                'Sending Request...'
              ) : status === 'success' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Proposal Requested Successfully!
                </>
              ) : status === 'error' ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Submission Failed
                </>
              ) : (
                'Request Free Website Proposal'
              )}
            </button>
            {status === 'error' && errorMessage ? (
              <p className="text-xs text-brand-red leading-relaxed text-center">{errorMessage}</p>
            ) : null}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
