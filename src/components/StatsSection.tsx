import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useInView, animate } from 'framer-motion';
import { useAnimationConfig } from '../hooks/useAnimationConfig';
import ScrollTextReveal from './ui/ScrollTextReveal';

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  compact?: boolean;
}

function Counter({ value, suffix = '', prefix = '', decimals = 0, compact = false }: CounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const motionValue = useMotionValue(0);

  const formatter = compact
    ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
    : new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const displayValue = useTransform(motionValue, (latest) => {
    const formatted = compact ? formatter.format(latest).toUpperCase() : formatter.format(latest);
    return prefix + formatted + suffix;
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
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();
  const stats = [
    { label: 'SITES LAUNCHED', value: 10, suffix: '+', prefix: '', decimals: 0, compact: false },
    { label: 'SOCIAL VIEWS GENERATED', value: 1000000, suffix: '+', prefix: '', decimals: 0, compact: true },
    { label: 'AVG. CONVERSION LIFT', value: 35, suffix: '%', prefix: '', decimals: 0, compact: false },
    { label: 'CLIENT REVENUE GENERATED', value: 150, suffix: 'K+', prefix: '$', decimals: 0, compact: false },
  ];

  return (
    <section className="py-16 bg-zinc-50 border-b border-zinc-200/60 gpu-accelerated">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: getDistance(30) }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ duration: getDuration(0.5), delay: index * 0.1, ease: getEase() }}
              className="space-y-1.5"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-brand-red">
                <ScrollTextReveal delay={index * 0.05} textColor="#E11D2E" wrapperClassName="block">
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    decimals={stat.decimals}
                    compact={stat.compact}
                  />
                </ScrollTextReveal>
              </div>
              <div className="text-xs font-bold text-muted tracking-wider uppercase">
                <ScrollTextReveal delay={index * 0.05} textColor="#71717A">
                  {stat.label}
                </ScrollTextReveal>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

