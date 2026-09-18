import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Hysteresis threshold (600 / 480) so momentum scroll doesn't jitter
        setIsVisible((prev) => (window.scrollY > 600 ? true : window.scrollY < 480 ? false : prev));
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 sm:bottom-7 left-4 sm:left-1/2 sm:-translate-x-1/2 z-40 pr-16 sm:pr-0"
        >
          <a
            href="#contact"
            className="group relative flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-[#E11D2E] via-[#D11220] to-[#B3121F] text-white rounded-full font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(225,29,46,0.45)] hover:shadow-[0_12px_35px_rgba(225,29,46,0.65)] active:scale-95 active:translate-y-0.5 border border-white/20 backdrop-blur-md transition-all duration-200 cursor-pointer cta-pulse"
          >
            {/* Sparkle badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wider text-white/90">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {t.stickyCta.badge}
            </span>

            {/* Primary CTA label */}
            <span className="tracking-tight whitespace-nowrap">
              {t.stickyCta.button}
            </span>

            {/* Arrow icon */}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
