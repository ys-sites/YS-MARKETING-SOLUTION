import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import GlowDot from './GlowDot';
import ShinyTitle from './ShinyTitle';
import BlurText from './BlurText';
import { ParallaxHeroImages } from './ParallaxHeroImages';
import { useAnimationConfig } from '../hooks/useAnimationConfig';
import ScrollTextReveal from './ui/ScrollTextReveal';


const categories = [
  { id: 'All', key: 'all' },
  { id: 'Restaurants', key: 'restaurants' },
  { id: 'E-commerce', key: 'ecommerce' },
  { id: 'Travel', key: 'travel' },
  { id: 'Home Services', key: 'homeServices' },
  { id: 'Luxury Services', key: 'luxuryServices' },
  { id: 'Sports & Recreation', key: 'sportsRecreation' },
  { id: 'Automotive', key: 'automotive' },
] as const;

const categoryKeyMap: Record<string, typeof categories[number]['key']> = Object.fromEntries(
  categories.map((c) => [c.id, c.key])
);

const projects = [
  { id: 1, slug: "allball",      name: "Centre AllBall",           category: "Sports & Recreation", url: "https://www.centreallball.com" },
  { id: 2, slug: "mevoyages",    name: "Majestic Experiences Voyages", category: "Travel",          url: "https://www.mevoyages.com" },
  { id: 3, slug: "1001nuits",    name: "1001 Nuits",               category: "Restaurants",         url: "https://www.1001nuit.com" },
  { id: 4, slug: "ironfuellab",  name: "IronFuel Lab",             category: "E-commerce",          url: "https://www.ironfuellab.com" },
  { id: 5, slug: "jannette",     name: "Jannette Caribbean",       category: "Restaurants",         url: "https://www.jannettecaribbean.ca" },
  { id: 6, slug: "mannypainter", name: "Manny Painter",            category: "Home Services",       url: "https://www.mannypainter.ca" },
  { id: 7, slug: "tierexotics",  name: "A-Tier Exotics",           category: "Luxury Services",     url: "https://a-tier-exotics.vercel.app" },
  { id: 8, slug: "pressurewash", name: "Pressure Wash Pro Elite",  category: "Home Services",       url: "https://pressure-wash-pro-elite.vercel.app" },
  { id: 9, slug: "autoruby",     name: "Auto Ruby",                category: "Automotive",          url: "https://auto-ruby.vercel.app" },
];

interface ProjectCardProps {
  project: typeof projects[number];
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const { t } = useLanguage();
  const { isMobile, getDistance, getDuration, getEase, getStagger, viewportConfig } = useAnimationConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgHeight, setImgHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(300);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight - 36);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Disable rise-up on mobile AND tablet (only animate y on large desktop ≥1024px)
  const isTabletOrSmaller = typeof window !== 'undefined' && window.innerWidth < 1024;

  useEffect(() => {
    if (!imgRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.height > 0) {
          setImgHeight(entry.contentRect.height);
        }
      }
    });
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollDistance = imgHeight > containerHeight ? imgHeight - containerHeight : 0;

  // Dynamic duration: 18px scrolled per second, bound between 18s and 40s for an extra slow and readable scroll down
  const baseDuration = scrollDistance > 0 ? Math.max(18, Math.min(40, scrollDistance / 18)) : 18;

  // Per-card speed variance + phase offset so the grid doesn't scroll in lockstep —
  // some cards run noticeably slower/faster and start mid-cycle, giving the grid texture
  // instead of every card moving in parallel.
  const speedFactor = 0.6 + ((index * 47) % 100) / 100 * 1.3;
  const duration = baseDuration * speedFactor;
  const phaseOffset = -(((index * 53) % 100) / 100) * duration;

  return (
    <motion.div
      ref={containerRef}
      initial={isTabletOrSmaller ? { opacity: 0, y: 0 } : { opacity: 0, y: getDistance(40) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportConfig}
      transition={isTabletOrSmaller ? { duration: getDuration(0.4), ease: getEase() } : { duration: getDuration(0.5), delay: index * getStagger(0.05, 9), ease: getEase() }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm hover:shadow-2xl hover:border-brand-red/30 transition-all duration-300 cursor-pointer h-[350px] transform hover:-translate-y-2 select-none"
    >
      {/* Minimal Browser Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 border-b border-zinc-200/80">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        </div>
        <div className="text-[10px] text-zinc-400 font-mono bg-white border border-zinc-200/60 rounded-md px-3 py-0.5 max-w-[180px] truncate">
          {project.url.replace('https://', '').replace('www.', '')}
        </div>
        <div className="w-8" />
      </div>

      {/* Website Preview Area */}
      <div className="relative w-full h-[314px] overflow-hidden bg-zinc-50">
        {imageError ? (
          /* Graceful Fallback Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-50 text-zinc-400">
            <span className="text-sm font-semibold mb-1 text-zinc-700">{project.name}</span>
            <span className="text-xs text-zinc-400 mb-4">{t.portfolio.categories[categoryKeyMap[project.category]]}</span>
            <span className="text-[10px] text-brand-red font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-brand-red-light/80">
              Preview Offline
            </span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={`/portfolio/${project.slug}.jpg`}
            alt={project.name}
            width={350}
            height={314}
            decoding="async"
            onError={() => setImageError(true)}
            className={`w-full h-auto block select-none pointer-events-none origin-top portfolio-scroll-img ${
              isInView && !isHovered && !prefersReducedMotion && scrollDistance > 0 ? '' : 'paused'
            }`}
            style={{
              '--scroll-distance': `-${scrollDistance}px`,
              '--scroll-duration': `${duration}s`,
              '--scroll-delay': `${phaseOffset}s`,
            } as React.CSSProperties}
            loading="lazy"
          />
        )}

        {/* Hover overlay details */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10 pointer-events-none">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
            <span className="px-3 py-1 rounded-full bg-brand-red text-[10px] font-bold uppercase tracking-wider text-white w-fit inline-block">
              {t.portfolio.categories[categoryKeyMap[project.category]]}
            </span>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">
              {project.name}
            </h3>
            <div className="flex items-center gap-1.5 text-brand-red-light font-bold text-sm">
              <span>{t.portfolio.visit}</span>
              <ArrowUpRight className="w-4 h-4 text-brand-red" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface PortfolioProps {
  limit?: number;
  isSubpage?: boolean;
  onBack?: () => void;
  onViewAll?: () => void;
}

export default function Portfolio({ limit, isSubpage = false, onBack, onViewAll }: PortfolioProps) {
  const { language, t } = useLanguage();
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const displayedProjects = (!isSubpage && limit) ? filteredProjects.slice(0, limit) : filteredProjects;

  const renderCategoryButton = (category: typeof categories[number]) => (
    <button
      key={category.id}
      onClick={() => setSelectedCategory(category.id)}
      className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-tight transition-all duration-300 relative cursor-pointer shrink-0 ${
        selectedCategory === category.id
          ? 'text-white'
          : 'text-muted hover:text-ink hover:bg-zinc-100'
      }`}
    >
      {selectedCategory === category.id && (
        <motion.div
          layoutId="activeCategory"
          className="absolute inset-0 bg-brand-red rounded-full -z-10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <ScrollTextReveal delay={0} textColor={selectedCategory === category.id ? "#ffffff" : "#71717A"}>
        {t.portfolio.categories[category.key]}
      </ScrollTextReveal>
    </button>
  );

  return (
    <section id="portfolio" className={`relative overflow-hidden border-y border-zinc-100 gpu-accelerated ${isSubpage ? 'py-12 bg-white' : 'py-24 bg-surface-alt'}`}>
      <div className="max-w-7xl mx-auto px-6">
        {isSubpage && (
          <div className="mb-10">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-full text-sm font-bold text-zinc-600 hover:text-ink cursor-pointer transition-all duration-200"
            >
              ← {language === 'en' ? 'Back to Home' : 'Retour à l\'accueil'}
            </button>
          </div>
        )}

        <div className="relative text-center mb-16 min-h-[420px] md:min-h-[480px] flex flex-col items-center justify-center">
          <ParallaxHeroImages
            images={[
              '/portfolio/allball.jpg',
              '/portfolio/mevoyages.jpg',
              '/portfolio/1001nuits.jpg',
              '/portfolio/ironfuellab.jpg',
              '/portfolio/jannette.jpg',
              '/portfolio/mannypainter.jpg',
              '/portfolio/tierexotics.jpg',
              '/portfolio/pressurewash.jpg',
            ]}
            imageClassName="h-12 w-16 sm:h-16 sm:w-24 md:h-20 md:w-28 opacity-20"
          />
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: getDistance(15) }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ duration: getDuration(0.5), ease: getEase() }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <GlowDot />
              <ScrollTextReveal delay={0} textColor="#E11D2E">
                {t.portfolio.badge}
              </ScrollTextReveal>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              <ScrollTextReveal delay={0.1} textColor="#0A0A0A" wrapperClassName="block">
                <ShinyTitle
                  blackText={t.portfolio.title.split(' ').slice(0, -1).join(' ') + ' '}
                  redText={t.portfolio.title.split(' ').slice(-1).join(' ')}
                />
              </ScrollTextReveal>
            </h2>
            <ScrollTextReveal delay={0.2} textColor="#52525B" wrapperClassName="block">
              <BlurText
                text={t.portfolio.subtitle}
                delay={60}
                animateBy="words"
                direction="top"
                className="text-muted max-w-2xl mx-auto text-lg md:text-xl font-light justify-center text-center"
              />
            </ScrollTextReveal>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-2 md:gap-3 mb-12 max-w-full px-4">
          {/* Row 1: All, E-commerce, Home Services */}
          <div className="flex flex-row justify-center gap-2 md:contents">
            {categories.filter(c => ['All', 'E-commerce', 'Home Services'].includes(c.id)).map(renderCategoryButton)}
          </div>
          {/* Row 2: Travel, Automotive, Restaurants */}
          <div className="flex flex-row justify-center gap-2 md:contents">
            {categories.filter(c => ['Travel', 'Automotive', 'Restaurants'].includes(c.id)).map(renderCategoryButton)}
          </div>
          {/* Row 3: Luxury Services, Sports & Recreation */}
          <div className="flex flex-row justify-center gap-2 md:contents">
            {categories.filter(c => ['Luxury Services', 'Sports & Recreation'].includes(c.id)).map(renderCategoryButton)}
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, index) => (
              <ProjectCard 
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Home page "View more of our work" button OR subpage project CTA */}
        {!isSubpage && limit && filteredProjects.length > limit ? (
          <div className="mt-16 text-center">
            <button
              onClick={onViewAll}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-red text-white hover:bg-brand-red-dark rounded-full font-bold text-lg hover:bg-brand-red-dark transition-all duration-300 transform hover:scale-105 shadow-[0_4px_20px_rgba(225,29,46,0.2)] hover:shadow-[0_0_40px_-8px_rgba(225,29,46,0.5)] cursor-pointer"
            >
              {language === 'en' ? 'View more of our work' : 'Voir plus de nos réalisations'}
              <ArrowUpRight className="w-5 h-5 animate-pulse" />
            </button>
          </div>
        ) : (
          /* Secondary CTA — only show when viewing all work */
          <div className="mt-20 text-center">
            <h4 className="text-xl md:text-2xl font-bold text-ink mb-4">Want results like these?</h4>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-red text-white rounded-full font-bold text-lg hover:bg-brand-red-dark transition-all duration-300 transform hover:scale-105 shadow-[0_4px_20px_rgba(225,29,46,0.2)] hover:shadow-[0_0_40px_-8px_rgba(225,29,46,0.5)] cursor-pointer"
            >
              Start Your Project
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
