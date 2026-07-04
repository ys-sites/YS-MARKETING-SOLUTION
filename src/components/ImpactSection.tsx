import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useInView,
  animate,
} from 'framer-motion';
import {
  Instagram,
  Music2,
  Star,
  Search,
  ArrowRight,
  ArrowUpRight,
  Play,
} from 'lucide-react';

function useReducedMotionPref() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

interface CountUpProps {
  value: number;
  suffix?: string;
  compact?: boolean;
  className?: string;
}

function CountUp({ value, suffix = '', compact = false, className = '' }: CountUpProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotionPref();
  const motionValue = useMotionValue(0);

  const formatter = compact
    ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
    : new Intl.NumberFormat('en-US');

  const displayValue = useTransform(motionValue, (latest) => formatter.format(Math.round(latest)) + suffix);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 2.2, ease: 'easeOut' });
    return controls.stop;
  }, [inView, value, motionValue, reducedMotion]);

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}
    </motion.span>
  );
}

function ProgressRule() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
      className="h-1 w-16 bg-brand-red rounded-full origin-left my-5"
    />
  );
}

function ClientTag({ name, role, tag }: { name: string; role: string; tag: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap items-center gap-3"
    >
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-[11px] font-bold uppercase tracking-wider">
        {tag}
      </span>
      <span className="text-sm font-semibold text-muted">
        {name} — {role}
      </span>
    </motion.div>
  );
}

interface PhoneMockupProps {
  src: string;
  rotate: number;
  fromSide: 'left' | 'right';
  delay: number;
  viewBadge: string;
}

function PhoneMockup({ src, rotate, fromSide, delay, viewBadge }: PhoneMockupProps) {
  const [error, setError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: fromSide === 'left' ? -90 : 90, rotate: 0 }}
      whileInView={{ opacity: 1, x: 0, rotate }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      whileHover={{ rotate: 0, scale: 1.06, zIndex: 20 }}
      className="relative w-36 sm:w-44 md:w-52 aspect-[9/19] rounded-[2rem] border-[6px] border-zinc-900 bg-zinc-900 shadow-2xl overflow-hidden cursor-pointer select-none"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-zinc-900 rounded-b-xl z-20" />
      <div className="relative w-full h-full bg-zinc-100">
        {!error ? (
          <img
            src={src}
            alt="Viral social media content for 1001 Nuits"
            loading="lazy"
            onError={() => setError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-red via-brand-red-dark to-zinc-900">
            <div className="absolute inset-0 opacity-40 blur-2xl bg-gradient-to-tr from-brand-red to-transparent" />
            <div className="relative w-11 h-11 rounded-full bg-white/25 backdrop-blur flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        )}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold whitespace-nowrap">
          <Play className="w-2.5 h-2.5 fill-white" /> {viewBadge}
        </div>
      </div>
    </motion.div>
  );
}

function FloatingChip({
  icon: Icon,
  label,
  className = '',
  revealDelay = 0,
  floatDelay = 0,
}: {
  icon: React.ElementType;
  label: string;
  className?: string;
  revealDelay?: number;
  floatDelay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: revealDelay }}
      className={`absolute z-30 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-lg border border-zinc-100 text-xs font-bold text-ink whitespace-nowrap"
      >
        <Icon className="w-3.5 h-3.5 text-brand-red shrink-0" />
        {label}
      </motion.div>
    </motion.div>
  );
}

function ViralPhonesVisual() {
  return (
    <div className="relative flex items-center justify-center min-h-[360px] sm:min-h-[400px] py-10">
      <div className="absolute w-64 h-64 md:w-80 md:h-80 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex items-center -space-x-6 sm:-space-x-8">
        <PhoneMockup src="/results/1001nuits-viral-1.jpg" rotate={-6} fromSide="left" delay={0} viewBadge="487K" />
        <PhoneMockup src="/results/1001nuits-viral-2.jpg" rotate={6} fromSide="right" delay={0.15} viewBadge="1.2M" />
      </div>

      <FloatingChip
        icon={Instagram}
        label="▶ 1M+ views"
        className="top-2 left-2 sm:left-6 md:left-2"
        revealDelay={0.7}
        floatDelay={0}
      />
      <FloatingChip
        icon={Music2}
        label="+7,000 followers"
        className="bottom-4 right-2 sm:right-6 md:right-0"
        revealDelay={0.95}
        floatDelay={1.4}
      />
    </div>
  );
}

function RankFlip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const reducedMotion = useReducedMotionPref();
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setShowFinal(true);
      return;
    }
    const t = setTimeout(() => setShowFinal(true), 850);
    return () => clearTimeout(t);
  }, [inView, reducedMotion]);

  return (
    <div ref={ref} className="inline-block [perspective:800px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={showFinal ? 'final' : 'start'}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="block text-6xl sm:text-7xl font-extrabold tracking-tight text-brand-red"
        >
          {showFinal ? 'Top 3' : 'Top 10'}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function GoogleSearchMockup() {
  const rows = [
    { rank: 1, name: 'Manny Painter', rating: '4.9', reviews: 47, highlight: true },
    { rank: 2, name: 'Peinture Rive-Sud', rating: '4.2', reviews: 18, highlight: false },
    { rank: 3, name: 'Atelier Couleur Pro', rating: '4.0', reviews: 9, highlight: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="relative bg-white rounded-3xl border border-zinc-200 shadow-2xl p-5 sm:p-6 w-full max-w-md mx-auto"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-full border border-zinc-200 bg-zinc-50 mb-5">
        <Search className="w-4 h-4 text-zinc-400 shrink-0" />
        <span className="text-sm text-zinc-500 truncate">painter near me</span>
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <motion.div
            key={row.rank}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={`relative flex items-center gap-3 p-3 rounded-2xl border overflow-hidden ${
              row.highlight
                ? 'border-brand-red bg-brand-red-light/40'
                : 'border-zinc-100 bg-zinc-50/70 grayscale opacity-60 blur-[0.5px]'
            }`}
          >
            {row.highlight && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 1, 0] }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.9 }}
                className="absolute inset-0 bg-brand-red/25 pointer-events-none"
              />
            )}
            <div
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                row.highlight ? 'bg-brand-red text-white' : 'bg-zinc-200 text-zinc-500'
              }`}
            >
              {row.rank}
            </div>
            <div className="relative min-w-0 flex-1">
              <p className={`text-sm font-bold truncate ${row.highlight ? 'text-ink' : 'text-zinc-500'}`}>
                {row.name}
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, s) => (
                  <Star
                    key={s}
                    size={11}
                    className={row.highlight ? 'text-amber-500' : 'text-zinc-300'}
                    fill="currentColor"
                  />
                ))}
                <span className="text-[10px] text-zinc-400 ml-1">
                  {row.rating} ({row.reviews})
                </span>
              </div>
            </div>
            {row.highlight && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.75, duration: 0.4 }}
                className="relative hidden sm:flex items-center gap-1 text-[10px] font-bold text-brand-red whitespace-nowrap"
              >
                Your business
                <ArrowRight className="w-3 h-3" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ImpactSection() {
  return (
    <section id="results" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-28 flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-4"
          >
            Client Impact
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink mb-6"
          >
            Real Clients. Real <span className="text-brand-red">Numbers.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            No vanity promises — just the measurable growth these two campaigns actually produced.
          </motion.p>
        </div>

        {/* Case Study 1: 1001 Nuits */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-28 md:mb-36">
          <div className="order-1">
            <ClientTag name="1001 Nuits" role="Halal Restaurant, Montreal" tag="Social Media Management" />
            <ProgressRule />
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-brand-red">
                  <CountUp value={7000} suffix="+" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-muted mt-2 leading-snug">
                  Followers grown from zero
                </p>
              </div>
              <div>
                <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-brand-red">
                  <CountUp value={1000000} suffix="+" compact />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-muted mt-2 leading-snug">
                  Views across Instagram &amp; TikTok
                </p>
              </div>
            </div>
            <p className="text-zinc-600 leading-relaxed max-w-lg">
              Started from zero with no online presence. We built an organic content strategy around viral reels,
              and 1001 Nuits is now a local brand people actively search for and recognize on the street.
            </p>
          </div>
          <div className="order-2">
            <ViralPhonesVisual />
          </div>
        </div>

        {/* Case Study 2: Manny Painter */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-1 md:order-2">
            <ClientTag name="Manny Painter" role="Painting Services, Montreal" tag="Google Business Profile & Local SEO" />
            <ProgressRule />
            <div className="mb-6">
              <RankFlip />
              <p className="text-xs sm:text-sm font-semibold text-muted mt-3 leading-snug uppercase tracking-wide">
                Ranks Top 3–10 in Google local search results
              </p>
            </div>
            <p className="text-zinc-600 leading-relaxed max-w-lg mb-2">
              Google Business Profile built from scratch, plus a proper review &amp; ranking system.
            </p>
            <p className="text-zinc-600 leading-relaxed max-w-lg">
              A real system — profile optimization, categories, reviews, posts — turned an invisible business into
              one customers actually find.
            </p>
          </div>
          <div className="order-2 md:order-1">
            <GoogleSearchMockup />
          </div>
        </div>

        {/* Closing CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-28 md:mt-36 pt-12 border-t border-zinc-100 flex flex-col items-center text-center gap-6"
        >
          <h4 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
            Your business could be <span className="text-brand-red">next.</span>
          </h4>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-red text-white rounded-full font-bold text-lg hover:bg-brand-red-dark transition-all duration-300 transform hover:scale-105 shadow-[0_4px_20px_rgba(225,29,46,0.2)] hover:shadow-[0_0_40px_-8px_rgba(225,29,46,0.5)] cursor-pointer"
          >
            Get Your Free Audit
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
