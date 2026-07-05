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
  Star,
  Search,
  ArrowRight,
  Play,
} from 'lucide-react';
import GlowDot from './GlowDot';
import ShinyTitle from './ShinyTitle';
import BlurText from './BlurText';
import { useAnimationConfig } from '../hooks/useAnimationConfig';
import ScrollTextReveal from './ui/ScrollTextReveal';
import { useVideoAutoplay } from '../hooks/useVideoAutoplay';


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
  const { viewportConfig, prefersReducedMotion } = useAnimationConfig();
  const inView = useInView(ref, { once: true, margin: viewportConfig.margin });
  const motionValue = useMotionValue(0);

  const formatter = compact
    ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
    : new Intl.NumberFormat('en-US');

  const displayValue = useTransform(motionValue, (latest) => formatter.format(Math.round(latest)) + suffix);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 2.2, ease: 'easeOut' });
    return controls.stop;
  }, [inView, value, motionValue, prefersReducedMotion]);

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}
    </motion.span>
  );
}

function ProgressRule() {
  const { getDuration, getEase, viewportConfig } = useAnimationConfig();
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={viewportConfig}
      transition={{ duration: getDuration(0.7), ease: getEase('easeOut'), delay: getDuration(0.15) }}
      className="h-1 w-16 bg-brand-red rounded-full origin-left my-5"
    />
  );
}

function ClientTag({ name, role, tag }: { name: string; role: string; tag: string }) {
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();
  return (
    <motion.div
      initial={{ opacity: 0, y: getDistance(15) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportConfig}
      transition={{ duration: getDuration(0.5), ease: getEase() }}
      className="flex flex-wrap items-center gap-3"
    >
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-[11px] font-bold uppercase tracking-wider">
        <GlowDot />
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
  badge: string;
  href?: string;
  alt?: string;
  zIndex?: number;
  onHoverChange?: (hovered: boolean) => void;
}

function PhoneMockup({ src, rotate, fromSide, delay, badge, href, alt, zIndex = 10, onHoverChange }: PhoneMockupProps) {
  const [error, setError] = useState(false);
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();

  const phone = (
    <motion.div
      initial={{ opacity: 0, x: fromSide === 'left' ? getDistance(-90) : getDistance(90), rotate: 0 }}
      whileInView={{ opacity: 1, x: 0, rotate }}
      viewport={viewportConfig}
      transition={{ duration: getDuration(0.7), ease: getEase('easeOut'), delay: getDuration(delay) }}
      whileHover={{ rotate: 0, scale: 1.06 }}
      onHoverStart={() => onHoverChange?.(true)}
      onHoverEnd={() => onHoverChange?.(false)}
      style={{ zIndex }}
      className="relative w-36 sm:w-44 md:w-52 aspect-[9/19] rounded-[2rem] border-[6px] border-zinc-900 bg-zinc-900 shadow-2xl overflow-hidden cursor-pointer select-none"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-zinc-900 rounded-b-xl z-20" />
      <div className="relative w-full h-full bg-zinc-100">
        {!error ? (
          <img
            src={src}
            alt={alt ?? 'Social media content for 1001 Nuits'}
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
          <Instagram className="w-2.5 h-2.5" /> {badge}
        </div>
      </div>
    </motion.div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="View on Instagram">
      {phone}
    </a>
  ) : (
    phone
  );
}

interface PhoneVideoMockupProps {
  src: string;
  rotate: number;
  delay: number;
  badge: string;
  href?: string;
  raised?: boolean;
  zIndex?: number;
  onHoverChange?: (hovered: boolean) => void;
}

function PhoneVideoMockup({ src, rotate, delay, badge, href, raised = false, zIndex = 20, onHoverChange }: PhoneVideoMockupProps) {
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, { margin: "200px" });

  useVideoAutoplay(videoRef);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView]);

  const phone = (
    <motion.div
      initial={{ opacity: 0, y: getDistance(60), rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={viewportConfig}
      transition={{ duration: getDuration(0.7), ease: getEase('easeOut'), delay: getDuration(delay) }}
      whileHover={{ rotate: 0, scale: 1.06 }}
      onHoverStart={() => onHoverChange?.(true)}
      onHoverEnd={() => onHoverChange?.(false)}
      style={{ zIndex }}
      className={`relative w-36 sm:w-44 md:w-52 aspect-[9/19] rounded-[2rem] border-[6px] border-zinc-900 bg-zinc-900 shadow-2xl overflow-hidden cursor-pointer select-none ${
        raised ? '-translate-y-4 md:-translate-y-6' : ''
      }`}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-zinc-900 rounded-b-xl z-20" />
      <div className="relative w-full h-full bg-zinc-100">
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="w-full h-full object-cover"
          style={{ transform: "translate3d(0,0,0)" }}
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold whitespace-nowrap">
          <Play className="w-2.5 h-2.5 fill-white" /> {badge}
        </div>
      </div>
    </motion.div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="View on Instagram">
      {phone}
    </a>
  ) : (
    phone
  );
}

function FloatingChip({
  icon: Icon,
  image,
  label,
  href,
  className = '',
  revealDelay = 0,
  floatDelay = 0,
}: {
  icon?: React.ElementType;
  image?: string;
  label: string;
  href?: string;
  className?: string;
  revealDelay?: number;
  floatDelay?: number;
}) {
  const chipClasses = "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-lg border border-zinc-100 text-xs font-bold text-ink whitespace-nowrap";
  const { getDuration, viewportConfig } = useAnimationConfig();
  const content = (
    <>
      {image ? (
        <img src={image} alt="" className="w-3.5 h-3.5 object-contain shrink-0" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 text-brand-red shrink-0" />
      ) : null}
      {label}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={viewportConfig}
      transition={{ duration: getDuration(0.5), delay: getDuration(revealDelay) }}
      className={`absolute z-30 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
      >
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={`${chipClasses} hover:border-brand-red/30 hover:shadow-xl transition-all duration-200 cursor-pointer pointer-events-auto`}>
            {content}
          </a>
        ) : (
          <div className={chipClasses}>{content}</div>
        )}
      </motion.div>
    </motion.div>
  );
}

const IG_VIDEO_URL = 'https://www.instagram.com/reel/DYGqIS0ujCQ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==';
const IG_PROFILE_URL = 'https://www.instagram.com/1001nu1t/';
const IG_GROWTH_POST_URL = 'https://www.instagram.com/p/DZQNaGFRsd7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==';

function TwoPhoneVisual() {
  const [frontPhone, setFrontPhone] = useState<'video' | 'profile'>('video');

  return (
    <div className="relative flex items-center justify-center min-h-[360px] sm:min-h-[400px] py-10">
      <div className="absolute w-64 h-64 md:w-80 md:h-80 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex items-center -space-x-8 sm:-space-x-10 md:-space-x-12">
        <PhoneVideoMockup
          src="/video-business.mp4"
          rotate={-8}
          delay={0}
          badge="212K reach"
          href={IG_VIDEO_URL}
          zIndex={frontPhone === 'video' ? 20 : 10}
          onHoverChange={() => setFrontPhone('video')}
        />
        <PhoneMockup
          src="/insta.png"
          rotate={8}
          fromSide="right"
          delay={0.15}
          badge="@1001nu1t"
          href={IG_PROFILE_URL}
          alt="1001 Nuits Instagram profile"
          zIndex={frontPhone === 'profile' ? 20 : 10}
          onHoverChange={(hovered) => setFrontPhone(hovered ? 'profile' : 'video')}
        />
      </div>

      <FloatingChip
        icon={Instagram}
        label="+7,000 followers"
        className="bottom-4 right-2 sm:right-6 md:right-0"
        revealDelay={0.8}
        floatDelay={0.6}
      />
    </div>
  );
}

function InstagramPostCard({ src, href, caption }: { src: string; href: string; caption: string }) {
  const [error, setError] = useState(false);
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: getDistance(30) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportConfig}
      transition={{ duration: getDuration(0.6), ease: getEase() }}
      whileHover={{ y: -4 }}
      className="group block w-full max-w-xs mx-auto bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden cursor-pointer"
    >
      <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-zinc-100">
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 via-brand-red to-purple-600 p-[2px] shrink-0">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden p-1">
            <img src="/YS.png" alt="" className="w-full h-full object-contain" />
          </div>
        </div>
        <span className="text-xs font-bold text-ink">ys.sites</span>
        <Instagram className="w-3.5 h-3.5 text-zinc-400 ml-auto shrink-0" />
      </div>
      <div className="relative aspect-square bg-zinc-100 overflow-hidden">
        {!error ? (
          <img
            src={src}
            alt={caption}
            loading="lazy"
            onError={() => setError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-red via-brand-red-dark to-zinc-900">
            <Instagram className="w-10 h-10 text-white/70" />
          </div>
        )}
      </div>
      <div className="px-3.5 py-3">
        <p className="text-xs text-zinc-600 leading-relaxed">{caption}</p>
      </div>
    </motion.a>
  );
}

const FEEDBACK_REEL_URL = 'https://www.instagram.com/reel/DZQMOA0x60C/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==';

function InstagramVideoPostCard({ src, href, caption }: { src: string; href: string; caption: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();
  const isInView = useInView(videoRef, { margin: "200px" });

  useEffect(() => {
    if (!isInView && isPlaying) {
      const video = videoRef.current;
      if (video) {
        video.pause();
        setIsPlaying(false);
      }
    }
  }, [isInView, isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: getDistance(30) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportConfig}
      transition={{ duration: getDuration(0.6), ease: getEase() }}
      className="w-full max-w-xs md:max-w-[360px] mx-auto md:ml-auto md:mr-0 bg-white rounded-2xl md:rounded-3xl border border-zinc-200 shadow-xl overflow-hidden"
    >
      <div className="flex items-center gap-2.5 px-3.5 md:px-5 py-3 md:py-4 border-b border-zinc-100">
        <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-brand-red-light flex items-center justify-center shrink-0">
          <Play className="w-3 h-3 md:w-4 md:h-4 text-brand-red fill-brand-red ml-0.5" />
        </div>
        <span className="text-xs md:text-sm font-bold text-ink">Client Feedback</span>
        <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400 ml-auto shrink-0" />
      </div>
      <div className="relative aspect-[9/16] bg-zinc-900 overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          playsInline
          loop
          muted
          preload="metadata"
          className="w-full h-full object-cover cursor-pointer"
          style={{ transform: "translate3d(0,0,0)" }}
          onClick={togglePlay}
          onPause={() => setIsPlaying(false)}
        />
        {!isPlaying && (
          <button
            onClick={togglePlay}
            aria-label="Play client feedback video with sound"
            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          >
            <span className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 md:w-8 md:h-8 text-brand-red fill-brand-red ml-1" />
            </span>
          </button>
        )}
      </div>
      <div className="px-3.5 md:px-5 py-3 md:py-4 flex items-center justify-between gap-3">
        <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">{caption}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 text-[10px] md:text-xs font-bold text-brand-red hover:underline whitespace-nowrap"
        >
          View
        </a>
      </div>
    </motion.div>
  );
}

function RankFlip() {
  const ref = useRef(null);
  const { viewportConfig, prefersReducedMotion } = useAnimationConfig();
  const inView = useInView(ref, { once: true, margin: viewportConfig.margin });
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setShowFinal(true);
      return;
    }
    const t = setTimeout(() => setShowFinal(true), 850);
    return () => clearTimeout(t);
  }, [inView, prefersReducedMotion]);

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
  const { getDistance, getDuration, getEase, getStagger, viewportConfig } = useAnimationConfig();
  const rows = [
    { rank: 1, name: 'Manny Painter', rating: '5.0', reviews: 8, highlight: true },
    { rank: 2, name: 'Peinture Rive-Sud', rating: '4.2', reviews: 18, highlight: false },
    { rank: 3, name: 'Atelier Couleur Pro', rating: '4.0', reviews: 9, highlight: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: getDistance(30) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportConfig}
      transition={{ duration: getDuration(0.6), ease: getEase() }}
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
            initial={{ opacity: 0, x: getDistance(-24) }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportConfig}
            transition={{ duration: getDuration(0.5), delay: i * getStagger(0.15, rows.length), ease: getEase() }}
            className={`relative flex items-center gap-3 p-3 rounded-2xl border overflow-hidden ${
              row.highlight
                ? 'border-brand-red bg-brand-red-light/40'
                : 'border-zinc-100 bg-zinc-50/70 grayscale opacity-60'
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
                {row.highlight ? (
                  row.name
                ) : (
                  <>
                    <span>{row.name.charAt(0)}</span>
                    <span className="blur-[4px] select-none">{row.name.slice(1)}</span>
                  </>
                )}
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
                initial={{ opacity: 0, x: getDistance(10) }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportConfig}
                transition={{ delay: getDuration(0.75), duration: getDuration(0.4), ease: getEase() }}
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
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();
  return (
    <section id="results" className="py-24 md:py-32 bg-white relative overflow-hidden gpu-accelerated">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-28 flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: getDistance(15) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: getDuration(0.5), ease: getEase() }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <GlowDot />
            <ScrollTextReveal delay={0} textColor="#E11D2E">
              Client Impact
            </ScrollTextReveal>
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink mb-6">
            <ScrollTextReveal delay={0.1} textColor="#0A0A0A" wrapperClassName="block">
              <ShinyTitle
                blackText="Real Clients. Real "
                redText="Numbers."
              />
            </ScrollTextReveal>
          </h2>
          <ScrollTextReveal delay={0.2} textColor="#52525B" wrapperClassName="block">
            <BlurText
              text="No vanity promises — just the measurable growth these two campaigns actually produced."
              delay={40}
              animateBy="words"
              direction="top"
              className="text-muted max-w-2xl mx-auto text-lg md:text-xl font-light justify-center text-center"
            />
          </ScrollTextReveal>
        </div>

        {/* Case Study 1: 1001 Nuits */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-28 md:mb-36">
          <div className="order-1">
            <ClientTag name="1001 Nuits" role="Halal Restaurant, Montreal" tag="Social Media Management" />
            <ProgressRule />
            <div className="mb-6">
              <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-brand-red">
                <ScrollTextReveal delay={0} textColor="#E11D2E" wrapperClassName="block">
                  <CountUp value={1000000} suffix="+" compact />
                </ScrollTextReveal>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-muted mt-3 leading-snug uppercase tracking-wide">
                <ScrollTextReveal delay={0} textColor="#71717A">
                  Combined views across Instagram &amp; TikTok
                </ScrollTextReveal>
              </div>
            </div>
            <div className="text-zinc-600 leading-relaxed max-w-lg mb-2">
              <ScrollTextReveal delay={0.05} textColor="#52525B">
                Started from zero — no followers, no content, no online presence at all. We built an organic
                content strategy from scratch around viral reels that grew the account past 7,000 engaged followers.
              </ScrollTextReveal>
            </div>
            <div className="text-zinc-600 leading-relaxed max-w-lg">
              <ScrollTextReveal delay={0.1} textColor="#52525B">
                The impact has been huge: over 1,000,000 combined views across Instagram and TikTok, and a steady
                stream of consistent new customers walking through the door every week.
              </ScrollTextReveal>
            </div>
          </div>
          <div className="order-2">
            <TwoPhoneVisual />
          </div>
        </div>

        {/* Progress Recap: 1001 Nuits Growth */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-28 md:mb-36">
          <div className="order-1">
            <h4 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-4">
              <ScrollTextReveal delay={0} textColor="#0A0A0A">
                The progress, <span className="text-brand-red">so far.</span>
              </ScrollTextReveal>
            </h4>
            <div className="mb-6">
              <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-brand-red">
                <ScrollTextReveal delay={0.05} textColor="#E11D2E" wrapperClassName="block">
                  <CountUp value={615600} suffix="+" compact />
                </ScrollTextReveal>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-muted mt-2 uppercase tracking-wide">
                <ScrollTextReveal delay={0.05} textColor="#71717A">
                  Views in the last 30 days alone
                </ScrollTextReveal>
              </div>
            </div>
            <div className="text-zinc-600 leading-relaxed max-w-lg mb-2">
              <ScrollTextReveal delay={0.1} textColor="#52525B">
                This isn't a one-off spike from a single viral post — it's a snapshot of where the account stands
                today, and it's still climbing.
              </ScrollTextReveal>
            </div>
            <div className="text-zinc-600 leading-relaxed max-w-lg">
              <ScrollTextReveal delay={0.15} textColor="#52525B">
                It's the result of a consistent content system: reels published on a regular schedule, tracked in
                a live performance dashboard, and refined every month based on what's actually working.
              </ScrollTextReveal>
            </div>
          </div>
          <div className="order-2">
            <InstagramPostCard
              src="/growth.png"
              href={IG_GROWTH_POST_URL}
              caption="Professional dashboard — 615.6K views in the last 30 days."
            />
          </div>
        </div>

        {/* Case Study 2: Manny Painter */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-1 md:order-2">
            <ClientTag name="Manny Painter" role="Painting Services, Montreal" tag="Google Business Profile & Local SEO" />
            <ProgressRule />
            <div className="mb-6">
              <RankFlip />
              <div className="text-xs sm:text-sm font-semibold text-muted mt-3 leading-snug uppercase tracking-wide">
                <ScrollTextReveal delay={0} textColor="#71717A">
                  Ranks Top 3–10 in Google local search results
                </ScrollTextReveal>
              </div>
            </div>
            <div className="text-zinc-600 leading-relaxed max-w-lg mb-2">
              <ScrollTextReveal delay={0.05} textColor="#52525B">
                Google Business Profile built from scratch, plus a proper review &amp; ranking system.
              </ScrollTextReveal>
            </div>
            <div className="text-zinc-600 leading-relaxed max-w-lg mb-8">
              <ScrollTextReveal delay={0.1} textColor="#52525B">
                A real system — profile optimization, categories, reviews, posts — turned an invisible business into
                one customers actually find.
              </ScrollTextReveal>
            </div>
            <GoogleSearchMockup />
          </div>
          <div className="order-2 md:order-1">
            <InstagramVideoPostCard
              src="/feedback.mp4"
              href={FEEDBACK_REEL_URL}
              caption="Straight from the client: real feedback on the leads and results."
            />
          </div>
        </div>

      </div>
    </section>
  );
}
