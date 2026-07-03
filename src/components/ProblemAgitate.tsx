import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ZapOff, UserX } from 'lucide-react';

const painPoints = [
  {
    title: "Blistering Slow Speeds",
    description: "Every extra second of page load time reduces customer conversion rates by up to 20%. If your site isn't fully loaded in under 2 seconds, your customers are already clicking back to Google.",
    icon: ZapOff,
  },
  {
    title: "Cookie-Cutter AI Slop",
    description: "Customers can spot an AI-generated template from a mile away. When your agency copies and pastes the same design used by 500 other competitors, your unique brand authority gets instantly erased.",
    icon: ShieldAlert,
  },
  {
    title: "Zero Conversion Logic",
    description: "A gorgeous website is totally useless if it doesn't prompt visitors to make a decision. Without explicit visual pathways, magnetic calls-to-action, and optimized forms, you're leaving money on the table.",
    icon: UserX,
  },
];

export default function ProblemAgitate() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 90
      }
    }
  };

  return (
    <section className="py-24 bg-surface relative overflow-hidden border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-4"
          >
            The Harsh Reality
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink mb-6"
          >
            Why Your Current Site is <span className="text-brand-red">Burning Cash</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            A website shouldn't just be an expensive business card. If it isn't proactively capturing leads and driving calls, it's a liability.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group bg-surface-alt border border-zinc-200 rounded-[32px] p-8 md:p-10 hover:bg-white hover:border-brand-red/30 transition-all duration-300 shadow-sm hover:shadow-xl relative cursor-pointer"
            >
              {/* Top accent accent highlight */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-zinc-200 group-hover:bg-brand-red group-hover:w-24 transition-all duration-300 rounded-b-full" />

              <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-6 group-hover:bg-brand-red-light transition-colors duration-300">
                <point.icon className="w-7 h-7 text-muted group-hover:text-brand-red transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-4 group-hover:text-brand-red transition-colors duration-200">
                {point.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
