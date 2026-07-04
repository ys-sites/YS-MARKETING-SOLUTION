import React from 'react';
import { motion } from 'framer-motion';
import { Search, Megaphone, Users, PenTool, BarChart3, Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import GlowDot from './GlowDot';
import ShinyTitle from './ShinyTitle';
import BlurText from './BlurText';
import { useAnimationConfig } from '../hooks/useAnimationConfig';

const serviceIcons = [Globe, Search, Megaphone, Users, PenTool, BarChart3];

export default function Services() {
  const { t } = useLanguage();
  const { isMobile, getDistance, getDuration, getEase, getStagger, viewportConfig } = useAnimationConfig();
  const services = t.services.items.map((item, index) => ({ ...item, icon: serviceIcons[index] }));

  return (
    <section id="services" className="py-28 bg-white bg-grid-pattern relative overflow-hidden gpu-accelerated">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: getDistance(15) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: getDuration(0.5), ease: getEase() }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <GlowDot />
            {t.services.badge}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: getDistance(20) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: getDuration(0.5), ease: getEase() }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
          >
            <ShinyTitle
              blackText={t.services.title.split(' ').slice(0, -1).join(' ') + ' '}
              redText={t.services.title.split(' ').slice(-1).join(' ')}
            />
          </motion.h2>
          <BlurText
            text={t.services.subtitle}
            delay={60}
            animateBy="words"
            direction="top"
            className="text-muted max-w-2xl mx-auto text-lg md:text-xl font-light justify-center text-center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: getDistance(40) }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              whileHover={{ y: -6 }}
              transition={
                isMobile
                  ? {
                      duration: getDuration(0.45),
                      ease: getEase(),
                      delay: index * getStagger(0.05, services.length),
                    }
                  : {
                      type: 'spring',
                      stiffness: 200,
                      damping: 22,
                      delay: index * getStagger(0.05, services.length),
                    }
              }
              className="group relative bg-white border border-zinc-200/80 rounded-[32px] p-8 hover:bg-brand-red-light/5 hover:border-brand-red/40 transition-colors duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.07)] cursor-pointer overflow-hidden flex flex-col justify-between min-h-[290px]"
            >
              {/* Top Border Draws Left to Right on Hover */}
              <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[4px] bg-brand-red transition-all duration-300 ease-out" />

              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-red-light flex items-center justify-center mb-6 group-hover:bg-brand-red group-hover:scale-110 transition-all duration-300 shadow-[0_4px_10px_rgba(225,29,46,0.1)]">
                  <service.icon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-4 group-hover:text-brand-red transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-brand-red font-semibold text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 mt-4">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
