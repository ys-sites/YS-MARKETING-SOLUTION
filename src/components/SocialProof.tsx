import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Janette's Spicy Caribbean Food",
    role: 'Google Review',
    content: 'Ys Marketing Solutions seems to really stand out in terms of customer service and product quality, honestly the people there are easy to work with, kind and they actually take their time to understand your needs. Final product turns out amazing. Overall, 5/5. Very underrated.',
    image: '/store.jpg',
  },
  {
    name: 'Michael',
    role: 'Founder, Tech Startup',
    content: 'The website they built for us is clean and professional. We saw an immediate uptick in inquiries after the launch.',
    image: 'https://i.pravatar.cc/150?u=michael',
  },
  {
    name: 'Sebastien',
    role: 'Founder, Nunest Painting',
    content: 'I love our website! In the first month, we got $10K in project revenue. All our leads come straight to our inbox and by SMS.',
    image: 'https://i.pravatar.cc/150?u=sebastien',
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
