import { useEffect, RefObject } from 'react';

export function useVideoAutoplay(videoRef: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly set muted as a DOM property to bypass browser policy blocks
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.removeAttribute('controls');
    
    // Autoplay call
    const startPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay blocked, registering user gesture trigger", err);
          // Retry on first user interaction (safeguard)
          const retry = () => {
            video.play().catch(e => console.error("Video play retry failed:", e));
            window.removeEventListener('touchstart', retry);
            window.removeEventListener('scroll', retry);
          };
          window.addEventListener('touchstart', retry, { passive: true });
          window.addEventListener('scroll', retry, { passive: true });
        });
      }
    };

    if (video.readyState >= 2) {
      startPlay();
    } else {
      video.addEventListener('loadeddata', startPlay);
    }

    return () => {
      video.removeEventListener('loadeddata', startPlay);
    };
  }, [videoRef]);
}
