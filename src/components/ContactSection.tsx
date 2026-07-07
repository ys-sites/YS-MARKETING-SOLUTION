import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import GlowDot from './GlowDot';
import BlurText from './BlurText';
import { useAnimationConfig } from '../hooks/useAnimationConfig';
import ScrollTextReveal from './ui/ScrollTextReveal';
import LeadFlowForm from './LeadFlowForm';

export default function ContactSection() {
  const { t } = useLanguage();
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();

  return (
    <section
      id="contact"
      className="pt-10 md:pt-14 pb-24 bg-surface relative overflow-hidden border-b border-zinc-200 gpu-accelerated"
    >
      {/* Background soft glows — static, no animation */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-red-light/30 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-red-light/20 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* ── Left: copy + trust signals ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: getDistance(30) }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: getDuration(0.6), ease: getEase() }}
          className="flex flex-col justify-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-6 w-fit">
            <GlowDot />
            <ScrollTextReveal delay={0} textColor="#E11D2E">
              {t.contact.badge}
            </ScrollTextReveal>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink mb-4 leading-tight">
            <ScrollTextReveal delay={0.1} textColor="#0A0A0A" wrapperClassName="block">
              Tell us what you need
            </ScrollTextReveal>
          </h2>

          {/* Sub-heading */}
          <ScrollTextReveal delay={0.2} textColor="#52525B" wrapperClassName="block">
            <BlurText
              text="30 seconds, no commitment — one question at a time."
              delay={50}
              animateBy="words"
              direction="top"
              className="text-muted text-lg leading-relaxed mb-10 max-w-md font-light"
            />
          </ScrollTextReveal>

          {/* Trust cards */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: getDistance(15) }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              className="bg-surface-alt p-6 rounded-[24px] flex items-center gap-6 border border-zinc-200 hover:border-brand-red/30 transition-all duration-300 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-red-light flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h3 className="font-bold text-ink text-lg mb-0.5">
                  <ScrollTextReveal delay={0} textColor="#0A0A0A">
                    {t.contact.trust.abandonmentTitle}
                  </ScrollTextReveal>
                </h3>
                <div className="text-muted text-sm">
                  <ScrollTextReveal delay={0.05} textColor="#71717A">
                    {t.contact.trust.abandonmentDesc}
                  </ScrollTextReveal>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: getDistance(15) }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              className="bg-surface-alt p-6 rounded-[24px] flex items-center gap-6 border border-zinc-200 hover:border-brand-red/30 transition-all duration-300 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-red-light flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h3 className="font-bold text-ink text-lg mb-0.5">
                  <ScrollTextReveal delay={0.1} textColor="#0A0A0A">
                    {t.contact.trust.missedRevenueTitle}
                  </ScrollTextReveal>
                </h3>
                <div className="text-muted text-sm">
                  <ScrollTextReveal delay={0.15} textColor="#71717A">
                    {t.contact.trust.missedRevenueDesc}
                  </ScrollTextReveal>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Right: multi-step lead flow ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: getDistance(30) }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: getDuration(0.6), ease: getEase(), delay: 0.1 }}
        >
          <LeadFlowForm />
        </motion.div>

      </div>
    </section>
  );
}
