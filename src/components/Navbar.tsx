import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, t, toggleLanguage } = useLanguage();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.services, href: '#services' },
    { name: t.nav.portfolio, href: '#portfolio' },
    { name: t.nav.results, href: '#results' },
    { name: t.nav.testimonials, href: '#testimonials' },
  ];

  return (
    <div className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-4 flex justify-center">
      <nav
        className={cn(
          'liquid-glass liquid-glass-pill w-full max-w-6xl rounded-full py-2 sm:py-2.5 px-3.5 sm:px-5 text-white shadow-xl transition-all duration-300'
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-90 transition-opacity min-w-0 shrink-0"
          >
            {/* Logo asset kept exactly as-is without circle padding */}
            <img src="/YS.png" alt="YS Marketing Solutions" className="h-8 sm:h-9 md:h-11 w-auto shrink-0" />
            <span className="text-[11px] sm:text-sm md:text-lg font-black tracking-wider text-white uppercase whitespace-nowrap">
              YS Marketing Solutions
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors duration-200 cursor-pointer",
                  isScrolled
                    ? "text-zinc-300 hover:text-white"
                    : "text-zinc-200 hover:text-white"
                )}
              >
                {link.name}
              </a>
            ))}

            {/* Language Selector */}
            <button
              onClick={toggleLanguage}
              className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1"
            >
              <span className={language === 'en' ? 'text-white' : 'text-zinc-400'}>EN</span>
              <span className="text-white/20">|</span>
              <span className={language === 'fr' ? 'text-white' : 'text-zinc-400'}>FR</span>
            </button>

            <a
              href="#contact"
              className="bg-brand-red text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-brand-red-dark transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-102 whitespace-nowrap shrink-0"
            >
              {t.nav.proposalBtn}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Toggle & Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 md:hidden shrink-0">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full border border-white/20 bg-white/5 text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1"
            >
              <span className={language === 'en' ? 'text-white' : 'text-zinc-400'}>EN</span>
              <span className="text-white/20">|</span>
              <span className={language === 'fr' ? 'text-white' : 'text-zinc-400'}>FR</span>
            </button>

            <button
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="cursor-pointer transition-colors duration-200 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col gap-4 md:hidden shadow-xl"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-bold text-muted hover:text-brand-red transition-colors duration-200 cursor-pointer py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}

              <a
                href="#contact"
                className="bg-brand-red text-white px-5 py-3 rounded-2xl text-center font-bold hover:bg-brand-red-dark transition-colors duration-200 cursor-pointer mt-2 shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.nav.proposalBtn}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
