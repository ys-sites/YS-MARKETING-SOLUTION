import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah M.",
    role: 'E-commerce Client',
    content: 'YS Marketing Solutions did an incredible job designing our custom e-commerce website. It looks amazing and our sales have doubled since launch! Highly professional and clean code.',
    image: 'https://i.pravatar.cc/150?u=sarah',
  },
  {
    name: "Alex Soccer",
    role: 'Local Business Partner',
    content: 'The service was exceptionally good, with excellent communication and professionalism, particularly in their custom web development work.',
    image: 'https://i.pravatar.cc/150?u=alex',
  },
  {
    name: "David L.",
    role: 'SEO & Search Rankings Client',
    content: 'Their SEO and Google Ranking optimization was seamless, and our organic search rankings turned out perfect. They respected our timeline and finished on schedule.',
    image: 'https://i.pravatar.cc/150?u=david',
  },
  {
    name: "Elena V.",
    role: 'Marketing Manager',
    content: 'YS Marketing Solutions transformed our entire lead generation funnel. The attention to detail around UI/UX and mobile speed is unmatched. I highly recommend them.',
    image: 'https://i.pravatar.cc/150?u=elena',
  },
  {
    name: "Sylvie Lafontaine",
    role: 'Corporate Business Owner',
    content: 'YS is a real Pro! Our old business website has been completely refreshed! Their work is clean and their strategy is professional. Thank you YS!',
    image: 'https://i.pravatar.cc/150?u=sylvie',
  },
  {
    name: "Viviane C.",
    role: 'Local Guide – Montreal',
    content: "YS is very professional, works efficiently and the result is always amazing! I'm so glad I found such an amazing web development partner and I am looking forward to working with them again.",
    image: 'https://i.pravatar.cc/150?u=viviane',
  },
];

export default function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 bg-surface-alt relative overflow-hidden border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-6">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink mb-8 leading-tight">
              What Our <br />
              <span className="text-brand-red">Clients</span> Say
            </h2>
            <p className="text-muted text-lg mb-8 font-light leading-relaxed max-w-md">
              Don't just take our word for it. Hear directly from business owners who turned their websites from cash-burning liabilities into high-performance sales engines.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-12 h-12 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:text-brand-red hover:border-brand-red/30 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={next}
                aria-label="Next testimonial"
                className="w-12 h-12 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:text-brand-red hover:border-brand-red/30 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2 w-full relative min-h-[350px] flex items-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-zinc-200 p-8 md:p-10 rounded-[40px] shadow-md relative w-full"
              >
                <Quote className="absolute top-8 right-8 w-12 h-12 text-brand-red/10" />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-brand-red text-brand-red" />
                  ))}
                </div>

                <p className="text-lg md:text-xl text-zinc-800 mb-8 italic leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </p>

                <div className="flex items-center gap-4">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full border-2 border-brand-red object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-ink">{testimonials[currentIndex].name}</h4>
                    <p className="text-sm text-muted">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
