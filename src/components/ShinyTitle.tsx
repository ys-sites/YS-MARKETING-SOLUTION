import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform, useInView } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface ShinyTitleProps {
  blackText: string;
  redText: string;
  className?: string;
}

export default function ShinyTitle({ blackText, redText, className = '' }: ShinyTitleProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [isAnimating, setIsAnimating] = useState(true);
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  // Monitor font loading to prevent layout shifts/stutters on font swaps
  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setIsFontLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  // Viewport checking to freeze rAF when offscreen
  const isInView = useInView(containerRef, { margin: "100px" });

  useEffect(() => {
    const checkVisibility = () => {
      if (!containerRef.current) return;
      const style = window.getComputedStyle(containerRef.current);
      const parentStyle = containerRef.current.parentElement ? window.getComputedStyle(containerRef.current.parentElement) : null;
      
      const visible = isInView && 
                      style.opacity !== '0' && 
                      style.display !== 'none' && 
                      containerRef.current.offsetParent !== null &&
                      (!parentStyle || parentStyle.opacity !== '0');
      setIsAnimating(visible);
    };

    checkVisibility();
    const interval = setInterval(checkVisibility, 400); // Consolidated throttle
    return () => clearInterval(interval);
  }, [isInView]);

  // Timing: 2.5s sweep + 2.0s pause = 4.5s total cycle
  const animationDuration = 2500;
  const delayDuration = 2000;

  useAnimationFrame((time) => {
    if (!isAnimating || !isFontLoaded || prefersReducedMotion) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += delta;

    const cycleDuration = animationDuration + delayDuration;
    const cycleTime = elapsedRef.current % cycleDuration;

    if (cycleTime < animationDuration) {
      const p = (cycleTime / animationDuration) * 100;
      progress.set(p);
    } else {
      progress.set(100); // Hold off-screen during the pause
    }
  });

  const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`);

  const blackStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(120deg, #0A0A0A 0%, #0A0A0A 35%, #E11D2E 50%, #0A0A0A 65%, #0A0A0A 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline',
  };

  const redStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(120deg, #E11D2E 0%, #E11D2E 35%, #ffffff 50%, #E11D2E 65%, #E11D2E 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline',
  };

  return (
    <span 
      ref={containerRef} 
      className={`inline-block ${className}`}
      style={{ display: 'inline-block' }}
    >
      <motion.span
        style={{ ...blackStyle, backgroundPosition }}
      >
        {blackText}
      </motion.span>
      <motion.span
        style={{ ...redStyle, backgroundPosition }}
      >
        {redText}
      </motion.span>
    </span>
  );
}
