import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface ShinyTitleProps {
  blackText: string;
  redText: string;
  className?: string;
}

export default function ShinyTitle({ blackText, redText, className = '' }: ShinyTitleProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const blackRef = useRef<HTMLSpanElement>(null);
  const redRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [offsets, setOffsets] = useState({ containerWidth: 0, blackLeft: 0, redLeft: 0 });

  useEffect(() => {
    const updateOffsets = () => {
      if (containerRef.current && blackRef.current && redRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const blackRect = blackRef.current.getBoundingClientRect();
        const redRect = redRef.current.getBoundingClientRect();
        setOffsets({
          containerWidth: containerRect.width,
          blackLeft: blackRect.left - containerRect.left,
          redLeft: redRect.left - containerRect.left,
        });
      }
    };

    // Measure initially
    updateOffsets();
    
    // Set up listeners
    window.addEventListener('resize', updateOffsets);
    const observer = new ResizeObserver(updateOffsets);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateOffsets);
      observer.disconnect();
    };
  }, [blackText, redText]); // Re-run if text changes to get correct bounding boxes

  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (prefersReducedMotion) {
      progress.set(1.5); // Hold off-screen
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += delta;

    const cycleDuration = 5200; // 5.2 seconds total cycle (including pause)
    const sweepDuration = 2400; // 2.4 seconds sweep
    const cycleTime = elapsedRef.current % cycleDuration;

    if (cycleTime < sweepDuration) {
      const normalTime = cycleTime / sweepDuration;
      // Cubic ease-in-out for premium smoothness
      const easedTime = normalTime < 0.5 
        ? 4 * normalTime * normalTime * normalTime 
        : 1 - Math.pow(-2 * normalTime + 2, 3) / 2;
      progress.set(easedTime);
    } else {
      progress.set(1.5); // Pause off-screen
    }
  });

  const W = offsets.containerWidth || 500;
  // Sweep spans from center at -0.6W to center at 1.8W (total width 2.4W)
  const blackBgPos = useTransform(progress, (p) => {
    const x_bg = -0.6 * W + p * (2.4 * W);
    return `${x_bg - offsets.blackLeft}px center`;
  });

  const redBgPos = useTransform(progress, (p) => {
    const x_bg = -0.6 * W + p * (2.4 * W);
    return `${x_bg - offsets.redLeft}px center`;
  });

  const bgSize = `${2 * W}px 100%`;

  const blackStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(120deg, #0A0A0A 40%, #E11D2E 50%, #0A0A0A 60%)`,
    backgroundSize: bgSize,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline',
  };

  const redStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(120deg, #E11D2E 40%, #ffffff 50%, #E11D2E 60%)`,
    backgroundSize: bgSize,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline',
  };

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      <motion.span
        ref={blackRef}
        style={{ ...blackStyle, backgroundPosition: blackBgPos }}
      >
        {blackText}
      </motion.span>
      <motion.span
        ref={redRef}
        style={{ ...redStyle, backgroundPosition: redBgPos }}
      >
        {redText}
      </motion.span>
    </span>
  );
}
