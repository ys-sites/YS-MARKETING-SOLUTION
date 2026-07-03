import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ClipboardList, Palette, Code, TrendingUp } from 'lucide-react';

const steps = [
  {
    phase: '01',
    title: 'Audit & Diagnose',
    description: 'We tear down your current performance, track friction zones, and calculate exactly how much money is slipping away.',
    icon: ClipboardList
  },
  {
    phase: '02',
    title: 'Visual Architecture',
    description: 'We wireframe a bespoke journey designed around visual pathways, clear CTAs, and elegant modern layouts.',
    icon: Palette
  },
  {
    phase: '03',
    title: 'Speed & Execution',
    description: 'We build on ultra-fast, modern infrastructure using clean clean, search-indexable React and Tailwind v4 structures.',
    icon: Code
  },
  {
    phase: '04',
    title: 'Scale & Dominate',
    description: 'We hook up lead automation, launch campaigns (Google Ads, SEO), and continuously optimize to boost conversion.',
    icon: TrendingUp
  }
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Map progress to width percentage
  const progressWidth = useTransform(scrollYProgress, [0.15, 0.8], ["0%", "100%"]);

  return (
    <section ref={containerRef} id="process" className="py-24 bg-surface-alt relative overflow-hidden border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-4"
          >
            How We Work
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink mb-6"
          >
            The Path to <span className="text-brand-red">High Conversions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            A systematic, data-guided method ensuring your brand turns traffic into revenue without waste.
          </motion.p>
        </div>

        {/* Timeline container */}
        <div className="relative mt-16 pb-8">
          
          {/* Desktop central progress line */}
          <div className="hidden lg:block absolute top-[52px] left-[5%] right-[5%] h-[2px] bg-zinc-200" />
          
          {/* Animated red scroll-linked line */}
          <motion.div
            style={{ width: progressWidth }}
            className="hidden lg:block absolute top-[52px] left-[5%] max-w-[90%] h-[2.5px] bg-brand-red z-10 origin-left"
          />

          {/* Timeline Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Node icon sphere */}
                <div className="w-[100px] h-[100px] rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-md relative z-30 group-hover:border-brand-red group-hover:shadow-lg transition-all duration-300">
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-red text-white text-[10px] font-extrabold flex items-center justify-center">
                    {step.phase}
                  </div>
                  <step.icon className="w-8 h-8 text-muted group-hover:text-brand-red group-hover:scale-110 transition-all duration-300" />
                </div>

                {/* Info Text */}
                <h3 className="text-xl font-extrabold text-ink mt-8 mb-3 group-hover:text-brand-red transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
