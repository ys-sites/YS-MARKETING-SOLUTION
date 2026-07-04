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
  const blackRef = useRef<HTMLSpanElement>(null);
  const redRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [offsets, setOffsets] = useState({ containerWidth: 0, blackLeft: 0, redLeft: 0 });
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

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

    updateOffsets();
    
    window.addEventListener('resize', updateOffsets);
    const observer = new ResizeObserver(updateOffsets);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateOffsets);
      observer.disconnect();
    };
  }, [blackText, redText]);

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

  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

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

    // Timing config: 2.5s sweep + 2.0s pause = 4.5s total cycle
    const cycleDuration = 4500;
    const sweepDuration = 2500;
    const cycleTime = elapsedRef.current % cycleDuration;

    if (cycleTime < sweepDuration) {
      const normalTime = cycleTime / sweepDuration;
      // Cubic ease-in-out curve
      const easedTime = normalTime < 0.5 
        ? 4 * normalTime * normalTime * normalTime 
        : 1 - Math.pow(-2 * normalTime + 2, 3) / 2;
      progress.set(easedTime);
    } else {
      progress.set(1.5); // Park offscreen during the 2s pause
    }
  });

  const W = offsets.containerWidth || 500;

  // Compute translateX coordinates for compositor layers
  const blackShineX = useTransform(progress, (p) => {
    const globalX = -1.2 * W + p * (3.4 * W);
    return globalX - offsets.blackLeft;
  });

  const redShineX = useTransform(progress, (p) => {
    const globalX = -1.2 * W + p * (3.4 * W);
    return globalX - offsets.redLeft;
  });

  return (
    <span 
      ref={containerRef} 
      className={`relative inline-block ${className}`}
      style={{ display: 'inline-block' }}
    >
      {/* ==========================================
          LAYER 1: Static Base Text (No repaints)
         ========================================== */}
      <span ref={blackRef} className="text-[#0A0A0A] inline">
        {blackText}
      </span>
      <span ref={redRef} className="text-[#E11D2E] inline">
        {redText}
      </span>

      {/* ==========================================
          LAYER 2: Hardware-Accelerated Overlay Shine
         ========================================== */}
      {isFontLoaded && (
        <span 
          className="absolute inset-0 pointer-events-none select-none overflow-hidden text-transparent"
          style={{ display: 'inline-block' }}
        >
          {/* Black span overlay with RED shine */}
          <span 
            className="absolute top-0 text-transparent bg-clip-text -webkit-background-clip: text"
            style={{ 
              left: offsets.blackLeft,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              overflow: 'hidden',
              display: 'inline-block',
              whiteSpace: 'nowrap'
            }}
          >
            {blackText}
            <motion.span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '180%',
                height: '100%',
                backgroundImage: 'linear-gradient(120deg, transparent 35%, rgba(225,29,46,0.95) 50%, transparent 65%)',
                x: blackShineX,
                willChange: 'transform',
              }}
            />
          </span>

          {/* Red span overlay with WHITE shine */}
          <span 
            className="absolute top-0 text-transparent bg-clip-text -webkit-background-clip: text"
            style={{ 
              left: offsets.redLeft,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              overflow: 'hidden',
              display: 'inline-block',
              whiteSpace: 'nowrap'
            }}
          >
            {redText}
            <motion.span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '180%',
                height: '100%',
                backgroundImage: 'linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.95) 50%, transparent 65%)',
                x: redShineX,
                willChange: 'transform',
              }}
            />
          </span>
        </span>
      )}
    </span>
  );
}
