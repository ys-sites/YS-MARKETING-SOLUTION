import React from 'react';
import { motion } from 'framer-motion';
import { Search, Megaphone, Users, PenTool, BookOpen, BarChart3, Globe, ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Google Ranking (SEO)',
    description: "Get discovered by high-intent customers who are actively searching for what you offer. Real rankings, real traffic.",
    icon: Search,
  },
  {
    title: 'Google Ads',
    description: "Laser-targeted paid campaign management that bypasses search organic timeframes to capture immediate buying leads.",
    icon: Megaphone,
  },
  {
    title: 'Social Media',
    description: "Build an active, authentic audience and turn passive scrollers into long-term brand advocates with high-quality content.",
    icon: Users,
  },
  {
    title: 'Content Creation',
    description: "Copywriting, graphic design, and custom brand assets designed to tell your story and optimize conversion rate.",
    icon: PenTool,
  },
  {
    title: 'Blogs & PR',
    description: "Authoritative authority-building articles that drive organic keyword coverage and build your domain ranking power.",
    icon: BookOpen,
  },
  {
    title: 'Digital Strategy',
    description: "Comprehensive scaling roadmaps, market analyses, and conversion funnels mapped directly to your revenue targets.",
    icon: BarChart3,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-28 bg-white bg-grid-pattern relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-4"
          >
            What We Do
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink mb-6"
          >
            The Six Pillars of <span className="text-brand-red">Growth</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            With **Web Design & Development** as our primary production powerhouse, we weave these high-performance organic and paid marketing strategies into every screen we build.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ 
                type: "spring",
                stiffness: 150,
                damping: 20,
                delay: index * 0.05
              }}
              className="group relative bg-white border border-zinc-200/80 rounded-[32px] p-8 hover:bg-brand-red-light/5 hover:border-brand-red/40 transition-all duration-300 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] cursor-pointer overflow-hidden flex flex-col justify-between min-h-[290px]"
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
