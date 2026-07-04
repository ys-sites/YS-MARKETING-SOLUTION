import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, Instagram } from 'lucide-react';

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

  const itemVariants = {
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
    <section className="relative h-screen flex items-center justify-start overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full object-cover z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dmnoikwb9/video/upload/v1783121626/CLIENT__Website_Background_Video_for_kwELITE_Keller_Williams_Real_Estate_-_DayCloud_Studios_efqnap.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Dark Legibility Overlay Scrim */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Hero Content Area */}
      <div className="max-w-7xl w-full mx-auto px-6 text-left text-white relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 max-w-2xl"
        >
          {/* Top Pill Accent */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-zinc-300 uppercase tracking-widest backdrop-blur-sm"
          >
            <span>High-Performance Websites</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.1] text-left">
            <motion.span variants={itemVariants} className="block text-white">
              Digital
            </motion.span>
            <motion.span variants={itemVariants} className="block text-white">
              Marketing
            </motion.span>
            <motion.span 
              variants={itemVariants} 
              className="block text-brand-red"
            >
              Services
            </motion.span>
          </h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-zinc-300 max-w-xl text-left leading-relaxed font-light"
          >
            We transform underperforming websites into fast, conversion-optimized growth channels. No cookie-cutter templates—just blazing-fast systems that turn traffic into immediate leads.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-start gap-5"
          >
            {/* Primary Action Button */}
            <a
              href="#contact"
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-brand-red text-white rounded-full font-bold text-lg hover:bg-brand-red-dark transition-all duration-300 transform hover:scale-105 shadow-[0_4px_20px_rgba(225,29,46,0.3)] hover:shadow-[0_0_40px_-8px_rgba(225,29,46,0.7)] w-full sm:w-auto cursor-pointer"
            >
              Get Your Free Audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>

            {/* Secondary Link Button */}
            <a
              href="#portfolio"
              className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 bg-white/5 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm cursor-pointer"
            >
              See Our Work
            </a>

            {/* Instagram Social Icon Link */}
            <a
              href="https://www.instagram.com/ys.sites/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full border border-white/20 hover:border-white/40 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:text-brand-red hover:scale-105 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              aria-label="Instagram Profile"
            >
              <Instagram className="w-6 h-6" />
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
