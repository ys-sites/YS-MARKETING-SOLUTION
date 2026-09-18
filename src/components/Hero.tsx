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
    <section className="relative min-h-[100dvh] flex items-center justify-start overflow-hidden bg-black pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-16">
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full object-cover z-0">
        {isMobile ? (
          <img
            src="/hero-mobile.jpg"
            alt="High-Performance Marketing"
            width={1024}
            height={1024}
            className="w-full h-full object-cover"
            loading="eager"
            // @ts-ignore
            fetchpriority="high"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/hero-mobile.jpg"
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
        )}
      </div>

      {/* Dark Legibility Overlay — single gradient layer for fewer composited layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20 z-10 pointer-events-none" />

      {/* Hero Content Area */}
      <div className="max-w-7xl w-full mx-auto px-5 sm:px-6 md:px-8 text-left text-white relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start max-w-3xl xl:max-w-4xl"
        >
          {/* Top Pill Accent */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] sm:text-xs font-semibold text-zinc-300 uppercase tracking-widest backdrop-blur-sm mb-2.5 sm:mb-4 shadow-sm"
          >
            <GlowDot />
            <span>{t.hero.badge}</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08] text-left">
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
          <div className="mt-2.5 sm:mt-3 mb-5 sm:mb-7">
            <ScrollTextReveal delay={0.3} textColor="#d1d5db" wrapperClassName="block">
              <BlurText
                text={t.hero.subtitle}
                delay={40}
                animateBy="words"
                direction="top"
                className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-xl lg:max-w-2xl text-left leading-relaxed font-light"
              />
            </ScrollTextReveal>
          </div>


          {/* Action CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center justify-start gap-3 sm:gap-4 w-full sm:w-auto"
          >
            {/* Primary Action Button — Power Design 5-state CTA */}
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#E11D2E] via-[#D11220] to-[#B3121F] text-white rounded-full font-bold text-sm sm:text-base md:text-lg whitespace-nowrap hover:shadow-[0_0_35px_rgba(225,29,46,0.65)] active:scale-95 active:translate-y-0.5 transition-all duration-200 w-full sm:w-auto cursor-pointer cta-pulse shadow-[0_4px_25px_rgba(225,29,46,0.4)] border border-white/20 tap-target-min shrink-0"
            >
              <span className="tracking-tight">{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform duration-200 shrink-0" />
            </a>

            {/* Secondary Link Button + Instagram — share a row on mobile, side-by-side on desktop */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="#portfolio"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 border border-white/20 hover:border-white/40 bg-white/5 rounded-full font-bold text-sm sm:text-base md:text-lg whitespace-nowrap hover:bg-white/10 active:scale-95 active:bg-white/15 transition-all duration-200 sm:w-auto backdrop-blur-sm cursor-pointer tap-target-min shrink-0"
              >
                {t.hero.ctaSecondary}
              </a>

              {/* Instagram Social Icon Link */}
              <a
                href="https://www.instagram.com/ys.sites/"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 relative w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group tap-target-min"
                style={{
                  background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
                  boxShadow: '0 0 15px rgba(253, 29, 29, 0.4), 0 0 30px rgba(131, 58, 180, 0.25)',
                }}
                aria-label="Instagram Profile"
              >
                {/* Pulsing glow ring */}
                <span
                  className="absolute inset-0 rounded-full animate-ping opacity-25"
                  style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
                  aria-hidden="true"
                />
                {/* Inner highlight */}
                <span
                  className="absolute inset-[2px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ background: 'radial-gradient(circle at 30% 30%, white, transparent)' }}
                  aria-hidden="true"
                />
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 drop-shadow-md" />
              </a>
            </div>
          </motion.div>

          {/* Trust Guarantee Microcopy (Power Design Rule #6) */}
          <motion.div
            variants={itemVariants}
            className="mt-3.5 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-300/90 tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
            <span>{t.hero.trust}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator — hidden on compact viewports to prevent collision */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 8 }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 1.2,
          ease: 'easeInOut'
        }}
        className="hidden xl:flex [@media(max-height:800px)]:hidden absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 flex-col items-center gap-1 cursor-pointer pointer-events-none z-10"
      >
        <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">Scroll</span>
        <ArrowDown className="w-3.5 h-3.5 text-brand-red" />
      </motion.div>
    </section>
  );
}
