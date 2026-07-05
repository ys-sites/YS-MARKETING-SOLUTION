import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import GlowDot from './GlowDot';
import ShinyText from './ShinyText';
import BlurText from './BlurText';
import ScrollTextReveal from './ui/ScrollTextReveal';

import { useAnimationConfig } from '../hooks/useAnimationConfig';
import { useVideoAutoplay } from '../hooks/useVideoAutoplay';

export default function Hero() {
  const t = useLanguage().t;
  const { isMobile } = useAnimationConfig();
  const videoRef = useRef<HTMLVideoElement>(null);

  useVideoAutoplay(videoRef);

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
    <section className="relative h-screen flex items-center justify-start overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full object-cover z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          <source
            media="(max-width: 767px)"
            src="https://res.cloudinary.com/dmnoikwb9/video/upload/q_auto:good,f_mp4,w_768,c_limit/v1783121626/CLIENT__Website_Background_Video_for_kwELITE_Keller_Williams_Real_Estate_-_DayCloud_Studios_efqnap.mp4"
            type="video/mp4"
          />
          <source
            src="https://res.cloudinary.com/dmnoikwb9/video/upload/q_auto:good,f_mp4,w_1920,c_limit/v1783121626/CLIENT__Website_Background_Video_for_kwELITE_Keller_Williams_Real_Estate_-_DayCloud_Studios_efqnap.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Dark Legibility Overlay — single gradient layer for fewer composited layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10 z-10 pointer-events-none" />

      {/* Hero Content Area */}
      <div className="max-w-7xl w-full mx-auto px-6 pt-16 md:pt-12 text-left text-white relative z-20">
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
            <GlowDot />
            <span>{t.hero.badge}</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] text-left">
            <ScrollTextReveal delay={0} textColor="#ffffff" wrapperClassName="block">
              <motion.span variants={itemVariants} className="block text-white">
                {t.hero.title1}
              </motion.span>
            </ScrollTextReveal>
            <ScrollTextReveal delay={0.1} textColor="#ffffff" wrapperClassName="block">
              <motion.span variants={itemVariants} className="block text-white">
                {t.hero.title2}
              </motion.span>
            </ScrollTextReveal>
            <ScrollTextReveal delay={0.2} textColor="#E11D2E" wrapperClassName="block">
              <motion.span variants={itemVariants} className="block">
                <ShinyText text={t.hero.title3} color="#E11D2E" shineColor="#ffffff" speed={2.5} className="font-extrabold" />
              </motion.span>
            </ScrollTextReveal>
          </h1>

          {/* Subheadline */}
          <ScrollTextReveal delay={0.3} textColor="#d1d5db" wrapperClassName="block">
            <BlurText
              text={t.hero.subtitle}
              delay={50}
              animateBy="words"
              direction="top"
              className="text-lg md:text-xl text-zinc-300 max-w-xl text-left leading-relaxed font-light"
            />
          </ScrollTextReveal>


          {/* Action CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-stretch sm:flex-row sm:items-center justify-start gap-4 sm:gap-5 w-full sm:w-auto"
          >
            {/* Primary Action Button */}
            <a
              href="#contact"
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-brand-red text-white rounded-full font-bold text-lg hover:bg-brand-red-dark transition-all duration-300 transform hover:scale-105 shadow-[0_4px_20px_rgba(225,29,46,0.3)] hover:shadow-[0_0_40px_-8px_rgba(225,29,46,0.7)] w-full sm:w-auto cursor-pointer"
            >
              {t.hero.ctaPrimary}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>

            {/* Secondary Link Button + Instagram — share a row on mobile */}
            <div className="flex items-center gap-3 w-full sm:w-auto sm:contents">
              <a
                href="#portfolio"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 bg-white/5 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 sm:w-auto backdrop-blur-sm cursor-pointer"
              >
                {t.hero.ctaSecondary}
              </a>

              {/* Instagram Social Icon Link */}
              <a
                href="https://www.instagram.com/ys.sites/"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 relative w-14 h-14 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
                  boxShadow: '0 0 20px rgba(253, 29, 29, 0.5), 0 0 40px rgba(131, 58, 180, 0.3)',
                }}
                aria-label="Instagram Profile"
              >
                {/* Pulsing glow ring */}
                <span
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
                  aria-hidden="true"
                />
                {/* Inner highlight */}
                <span
                  className="absolute inset-[2px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ background: 'radial-gradient(circle at 30% 30%, white, transparent)' }}
                  aria-hidden="true"
                />
                <Instagram className="w-6 h-6 relative z-10 drop-shadow-md" />
              </a>
            </div>
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
