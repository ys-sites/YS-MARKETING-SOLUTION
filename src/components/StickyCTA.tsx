import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4"
        >
          <a
            href="#contact"
            className="w-full bg-brand-red text-white py-4 rounded-2xl font-bold text-base shadow-2xl hover:bg-brand-red-dark transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer transform hover:scale-105 shadow-brand-red/20"
          >
            <Calendar className="w-5 h-5" />
            Book Free Call
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
