import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import GlowDot from './GlowDot';
import ShinyTitle from './ShinyTitle';
import BlurText from './BlurText';
import { useAnimationConfig } from '../hooks/useAnimationConfig';
import ScrollTextReveal from './ui/ScrollTextReveal';

export default function SocialProof() {
  const { t } = useLanguage();
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();
  const testimonials = t.testimonials.items;

  return (
    <section id="testimonials" className="py-28 bg-surface-alt relative overflow-hidden border-b border-zinc-200 gpu-accelerated">
      {/* Background radial accent */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-red via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: getDistance(15) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: getDuration(0.5), ease: getEase() }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <GlowDot />
            <ScrollTextReveal delay={0} textColor="#E11D2E">
              {t.testimonials.badge}
            </ScrollTextReveal>
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black text-ink tracking-tight mb-6">
            <ScrollTextReveal delay={0.1} textColor="#0A0A0A" wrapperClassName="block">
              <ShinyTitle
                blackText={t.testimonials.title.split(' ').slice(0, -1).join(' ') + ' '}
                redText={t.testimonials.title.split(' ').slice(-1).join(' ')}
              />
            </ScrollTextReveal>
          </h2>
          <ScrollTextReveal delay={0.2} textColor="#52525B" wrapperClassName="block">
            <BlurText
              text={t.testimonials.subtitle}
              delay={40}
              animateBy="words"
              direction="top"
              className="text-muted text-lg md:text-xl max-w-2xl font-light leading-relaxed justify-center text-center"
            />
          </ScrollTextReveal>
        </div>


        {/* Marquee Vertical Grid Grid */}
        <div 
           className="relative h-[600px] md:h-[750px] overflow-hidden" 
           style={{ 
             WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)', 
             maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
             contain: 'content'
           }}
        >
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              {[
                { speed: 'animate-marquee-vertical', offset: 0 },
                { speed: 'animate-marquee-vertical-slow', offset: 3 },
                { speed: 'animate-marquee-vertical-fast', offset: 6 }
              ].map((col, cIdx) => {
                // Slice and wrap reviews to give each column starting offsets
                const colReviews = [
                  ...testimonials.slice(col.offset), 
                  ...testimonials.slice(0, col.offset)
                ];
                // Duplicate column array to make vertical scroll seamless
                const repeatedReviews = [...colReviews, ...colReviews];
                
                return (
                  <div 
                    key={cIdx} 
                    className={`h-max ${cIdx === 1 ? 'hidden md:block' : ''} ${cIdx === 2 ? 'hidden lg:block' : ''}`}
                  >
                    <div
                      className={`flex flex-col gap-6 marquee-track will-change-transform ${col.speed}`}
                    >
                      {repeatedReviews.map((review, idx) => (
                          <div 
                            key={idx}
                            className="bg-white border border-zinc-200/60 p-8 rounded-[2rem] relative shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(225,29,46,0.06)] hover:border-brand-red/20 transition-all duration-500 hover:-translate-y-1 group"
                          >
                            <div className="absolute top-8 right-8 opacity-[0.04] group-hover:scale-110 group-hover:text-brand-red transition-all duration-500">
                              <Quote size={48} />
                            </div>
                            <div className="flex gap-1 mb-6 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill="currentColor" className="stroke-none" />
                              ))}
                            </div>
                            <p className="text-zinc-700 mb-8 font-medium text-base relative z-10 leading-relaxed min-h-[90px] tracking-tight italic">
                              "{review.content}"
                            </p>
                            <div className="pt-6 border-t border-zinc-100">
                              <p className="font-extrabold text-zinc-900 tracking-tight text-sm">
                                {review.role.split(',').slice(1).join(',').trim()}
                              </p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

      </div>
    </section>
  );
}
