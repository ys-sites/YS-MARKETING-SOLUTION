import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useInView, animate } from 'framer-motion';

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

function Counter({ value, suffix = '', prefix = '', decimals = 0 }: CounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  const motionValue = useMotionValue(0);

  const displayValue = useTransform(motionValue, (latest) => {
    return prefix + latest.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + suffix;
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
    { label: 'SITES LAUNCHED', value: 15, suffix: '+', prefix: '' },
    { label: 'AD SPEND MANAGED', value: 10, suffix: 'K+', prefix: '$' },
    { label: 'AVG. CONVERSION LIFT', value: 38, suffix: '%', prefix: '' },
    { label: 'CLIENT REVENUE GENERATED', value: 25, suffix: 'K+', prefix: '$' },
  ];

  return (
    <section className="py-16 bg-surface-alt border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-1.5">
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-brand-red">
                <Counter 
                  value={stat.value} 
                  suffix={stat.suffix} 
                  prefix={stat.prefix} 
                />
              </div>
              <div className="text-xs font-bold text-muted tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
