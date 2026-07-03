import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';

const headlineWords = "Stop Burning Cash on Bad Websites.".split(" ");

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100
      }
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full object-cover -z-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          poster="https://res.cloudinary.com/dmnoikwb9/video/upload/so_0/CLIENT__Website_Background_Video_for_kwELITE_Keller_Williams_Real_Estate_-_DayCloud_Studios_efqnap.jpg"
        >
          <source
            src="https://res.cloudinary.com/dmnoikwb9/video/upload/q_auto,f_auto/CLIENT__Website_Background_Video_for_kwELITE_Keller_Williams_Real_Estate_-_DayCloud_Studios_efqnap.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Dark Legibility Overlay Scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85 -z-10" />

      {/* Hero Content Area */}
      <div className="max-w-7xl mx-auto px-6 text-center text-white z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Top Pill Accent */}
          <motion.div
            variants={wordVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-zinc-300 uppercase tracking-widest backdrop-blur-sm"
          >
            <span>Stop The Leak</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          </motion.div>

          {/* Staggered Word Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] max-w-5xl mx-auto">
            {headlineWords.map((word, i) => {
              const isAccent = word.toLowerCase().includes("burning") || word.toLowerCase().includes("cash") || word.toLowerCase().includes("bad");
              return (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className={`inline-block mr-3 md:mr-5 ${
                    isAccent 
                      ? 'text-brand-red relative after:content-[""] after:absolute after:bottom-1 after:left-0 after:w-full after:h-[6px] after:bg-brand-red/20 after:transform after:-skew-y-1' 
                      : 'text-white'
                  }`}
                >
                  {word}
                </motion.span>
              );
            })}
          </h1>

          {/* Subheadline */}
          <motion.p
            variants={wordVariants}
            className="text-lg md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
          >
            We rebuild underperforming websites into fast, conversion-optimized marketing systems that transform traffic into actual clients.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={wordVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            {/* Primary Action Button */}
            <a
              href="#contact"
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-brand-red text-white rounded-full font-bold text-lg hover:bg-brand-red-dark transition-all duration-300 transform hover:scale-105 shadow-[0_4px_20px_rgba(225,29,46,0.3)] hover:shadow-[0_0_40px_-8px_rgba(225,29,46,0.7)] w-full sm:w-auto cursor-pointer"
            >
              Get a Free Website Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>

            {/* Secondary Link Button */}
            <a
              href="#portfolio"
              className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 bg-white/5 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm cursor-pointer"
            >
              See Our Work
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 10 }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 1.2,
          ease: 'easeInOut'
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-1 cursor-pointer pointer-events-none"
      >
        <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">Scroll</span>
        <ArrowDown className="w-4 h-4 text-brand-red" />
      </motion.div>
    </section>
  );
}
