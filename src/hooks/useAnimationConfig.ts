import { useIsMobile } from './useIsMobile';
import { useReducedMotion } from 'framer-motion';

export function useAnimationConfig() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Every whileInView MUST have viewport={{ once: true, margin: "-10% 0px" }}
  const viewportConfig = {
    once: true,
    margin: "-10% 0px" as any,
  };


  const getDuration = (desktopDuration: number) => {
    if (prefersReducedMotion) return 0;
    // On mobile: shorter durations (0.4–0.5s)
    return isMobile ? Math.min(desktopDuration, 0.45) : desktopDuration;
  };

  const getDistance = (desktopDistance: number) => {
    if (prefersReducedMotion) return 0;
    const absVal = Math.abs(desktopDistance);
    const sign = Math.sign(desktopDistance);
    // Change initial={{ opacity: 0, y: 50 }} values: reduce all y offsets to max 24px on mobile
    const capped = isMobile ? Math.min(absVal, 24) : absVal;
    return capped * sign;
  };

  const getEase = (desktopEase: any = "easeInOut") => {
    return isMobile ? "easeOut" : desktopEase;
  };

  const getStagger = (desktopStagger: number, totalChildren: number) => {
    if (isMobile) {
      // NO staggered children delays longer than 0.3s total.
      if (totalChildren <= 1) return 0;
      return Math.min(desktopStagger, 0.3 / (totalChildren - 1));
    }
    return desktopStagger;
  };

  return {
    isMobile,
    prefersReducedMotion,
    getDuration,
    getDistance,
    getEase,
    getStagger,
    viewportConfig,
  };
}
