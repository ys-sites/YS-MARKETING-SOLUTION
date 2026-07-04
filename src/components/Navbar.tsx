import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'liquid-glass py-4 text-white shadow-xl'
          : 'bg-transparent py-6 text-white'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
        >
          {/* Logo asset in a padded circle */}
          <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center p-2.5 backdrop-blur-sm">
            <img src="/YS.png" alt="YS Marketing Solutions" className="h-full w-auto object-contain" />
          </div>
          <span className="text-lg font-black tracking-wider text-white uppercase">
            YS Marketing Solutions
          </span>
        </button>
 
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
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
          <a
            href="#contact"
            className="bg-brand-red text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-brand-red-dark transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-102"
          >
            Free Audit
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
 
        {/* Mobile Toggle */}
        <button 
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden cursor-pointer transition-colors duration-200 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-4 right-4 mt-2 bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col gap-4 md:hidden shadow-xl"
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
              Get Started
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
