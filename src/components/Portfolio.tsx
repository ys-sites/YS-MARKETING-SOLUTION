import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const categories = ['All', 'Restaurants', 'E-commerce', 'Travel', 'Corporate'];

const projects = [
  {
    id: 1,
    name: "Janette's Caribbean Kitchen",
    category: "Restaurants",
    image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop",
    url: "#"
  },
  {
    id: 2,
    name: "Aura Boutique & Apparel",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop",
    url: "#"
  },
  {
    id: 3,
    name: "Vantage Alpine Escapes",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=600&auto=format&fit=crop",
    url: "#"
  },
  {
    id: 4,
    name: "Apex Consulting Firm",
    category: "Corporate",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    url: "#"
  },
  {
    id: 5,
    name: "Nomad Coffee & Co.",
    category: "Restaurants",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
    url: "#"
  },
  {
    id: 6,
    name: "Nova SaaS Analytics",
    category: "Corporate",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&auto=format&fit=crop",
    url: "#"
  },
];

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
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-tight transition-all duration-300 relative cursor-pointer ${
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
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative h-[350px] rounded-3xl overflow-hidden border border-zinc-200 bg-white shadow-sm cursor-pointer"
              >
                {/* Full-bleed website screenshot/thumbnail */}
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Dark overlay sliding up on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 translate-y-[70%] group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col justify-end p-6 md:p-8" />

                {/* Visible Info always / reveals more on hover */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end z-10 text-white pointer-events-none">
                  <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out space-y-2">
                    <span className="px-3 py-1 rounded-full bg-brand-red/90 text-[10px] font-bold uppercase tracking-wider w-fit">
                      {project.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                      {project.name}
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex items-center gap-1 text-brand-red-light font-semibold text-sm">
                      <span>Visit Site</span>
                      <ArrowUpRight className="w-4 h-4 text-brand-red" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
