import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  'All',
  'Restaurants',
  'E-commerce',
  'Travel',
  'Home Services',
  'Luxury Services',
  'Sports & Recreation',
  'Automotive'
];

const projects = [
  { id: 1, slug: "allball",      name: "Centre AllBall",           category: "Sports & Recreation", url: "https://www.centreallball.com" },
  { id: 2, slug: "mevoyages",    name: "Majestic Experiences Voyages", category: "Travel",          url: "https://www.mevoyages.com" },
  { id: 3, slug: "1001nuits",    name: "1001 Nuits",               category: "Restaurants",         url: "https://www.1001nuits.com" },
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });
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

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgHeight(e.currentTarget.naturalHeight || e.currentTarget.offsetHeight);
  };

  const scrollDistance = imgHeight > containerHeight ? imgHeight - containerHeight : 0;
  
  // Dynamic duration: 60px scrolled per second, bound between 6s and 18s
  const duration = scrollDistance > 0 ? Math.max(6, Math.min(18, scrollDistance / 60)) : 10;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
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
      <div className="relative flex-1 overflow-hidden bg-zinc-50">
        {imageError ? (
          /* Graceful Fallback Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-50 text-zinc-400">
            <span className="text-sm font-semibold mb-1 text-zinc-700">{project.name}</span>
            <span className="text-xs text-zinc-400 mb-4">{project.category}</span>
            <span className="text-[10px] text-brand-red font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-brand-red-light/80">
              Preview Offline
            </span>
          </div>
        ) : (
          <motion.img
            src={`/portfolio/${project.slug}.jpg`}
            alt={project.name}
            onLoad={handleImageLoad}
            onError={() => setImageError(true)}
            className="w-full h-auto object-cover origin-top will-change-transform"
            style={{ y: 0 }}
            animate={
              isInView && !isHovered && !prefersReducedMotion && scrollDistance > 0
                ? {
                    y: [0, -scrollDistance, -scrollDistance, 0, 0],
                  }
                : { y: 0 }
            }
            transition={{
              duration: duration + 2, // Account for pauses
              times: [0, 0.45, 0.55, 0.95, 1], // Pause ratios
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
            loading="lazy"
          />
        )}

        {/* Hover overlay details */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10 pointer-events-none">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
            <span className="px-3 py-1 rounded-full bg-brand-red text-[10px] font-bold uppercase tracking-wider text-white w-fit inline-block">
              {project.category}
            </span>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">
              {project.name}
            </h3>
            <div className="flex items-center gap-1.5 text-brand-red-light font-bold text-sm">
              <span>Visit Site</span>
              <ArrowUpRight className="w-4 h-4 text-brand-red" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="portfolio" className="py-24 bg-surface-alt relative overflow-hidden border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-4"
          >
            Portfolio
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink mb-6"
          >
            Websites That <span className="text-brand-red">Convert</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            We don't build generic brochure sites. We design high-converting, blazing-fast sales channels tailored to capture leads.
          </motion.p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory gap-2 md:gap-3 mb-12 max-w-full pb-4 px-4 -mx-4 justify-start md:justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-tight transition-all duration-300 relative cursor-pointer snap-start shrink-0 ${
                selectedCategory === category
                  ? 'text-white'
                  : 'text-muted hover:text-ink hover:bg-zinc-100'
              }`}
            >
              {selectedCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-brand-red rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Secondary CTA */}
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
      </div>
    </section>
  );
}
