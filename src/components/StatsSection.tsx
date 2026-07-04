import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useInView, animate } from 'framer-motion';

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  compact?: boolean;
}

function Counter({ value, suffix = '', prefix = '', decimals = 0, compact = false }: CounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const motionValue = useMotionValue(0);

  const formatter = compact
    ? new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 })
    : new Intl.NumberFormat(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const displayValue = useTransform(motionValue, (latest) => {
    return prefix + formatter.format(latest) + suffix;
  });
  
  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, value, {
        duration: 2.5,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [inView, value, motionValue]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

export default function StatsSection() {
  const stats = [
    { label: 'SITES LAUNCHED', value: 10, suffix: '+', prefix: '', decimals: 0, compact: false },
    { label: 'SOCIAL VIEWS GENERATED', value: 1000000, suffix: '+', prefix: '', decimals: 0, compact: true },
    { label: 'AVG. CONVERSION LIFT', value: 35, suffix: '%', prefix: '', decimals: 0, compact: false },
    { label: 'CLIENT REVENUE GENERATED', value: 150, suffix: 'K+', prefix: '$', decimals: 0, compact: false },
  ];

  return (
    <section className="py-16 bg-zinc-50 border-b border-zinc-200/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-1.5"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-brand-red">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  decimals={stat.decimals}
                  compact={stat.compact}
                />
              </div>
              <div className="text-xs font-bold text-muted tracking-wider uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
