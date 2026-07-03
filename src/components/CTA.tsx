import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-brand-red text-white relative overflow-hidden">
      {/* Background visual flame dynamic overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest">
            <Flame className="w-4 h-4 text-white fill-white animate-pulse" />
            <span>Exclusive Performance Offer</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight">
            Ready to Stop <br className="sm:hidden" />
            <span className="underline decoration-white/30">Burning Cash?</span>
          </h2>
          
          <p className="text-brand-red-light text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
            Stop losing leads to sluggish pages, unproven strategies, and bad layouts. Let us build a high-converting digital system that drives real, predictable ROI.
          </p>

          <div className="flex justify-center pt-4">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-3 bg-white text-brand-red hover:bg-brand-red-light font-extrabold text-lg md:text-xl px-10 py-5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Get Your Free Website Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>
          </div>

          <p className="text-brand-red-light text-sm font-medium tracking-wide">
            100% Free Consultation • No Obligation • Instant Improvement Strategy
          </p>
        </motion.div>
      </div>
    </section>
  );
}
