import React, { useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  startX: number;
  startY: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  r: number;
  g: number;
  b: number;
  radius: number;
  maxRadius: number;
  // Blossom fields
  swaySpeed?: number;
  swayOffset?: number;
  gravity?: number;
  rotation?: number;
  rotationSpeed?: number;
  flutterSpeed?: number;
  spriteIndex?: number;
}

type AnimState = "dispersed" | "rising" | "stable" | "dispersing";

interface Registration {
  wrap: HTMLElement;
  getState: () => AnimState;
  riseUp: () => void;
  disperse: () => void;
}

// ─── Global scroll manager ────────────────────────────────────────────────────

const registry = new Set<Registration>();
let lastScrollY = 0;
let scrollDir: "up" | "down" = "down";
let rafPending = false;
let managerReady = false;

function tick() {
  rafPending = false;
  const vh = window.innerHeight;

  for (const reg of registry) {
    const rect = reg.wrap.getBoundingClientRect();
    const state = reg.getState();

    if (scrollDir === "down" && (state === "dispersed" || state === "dispersing")) {
      if (rect.top < vh + 120 && rect.bottom > 0) {
        reg.riseUp();
      }
    }

    if (scrollDir === "up" && state === "stable") {
      if (rect.top > vh * 0.75 && rect.top < vh) {
        reg.disperse();
      }
    }
  }
}

function onScroll() {
  const y = window.scrollY;
  scrollDir = y > lastScrollY ? "down" : "up";
  lastScrollY = y;
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(tick);
  }
}

function ensureManager() {
  if (managerReady || typeof window === "undefined") return;
  managerReady = true;
  lastScrollY = window.scrollY;
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ─── Pixel sampler ─────────────────────────────────────────────────────────

function samplePixels(
  el: HTMLElement, 
  fallback: string, 
  isMobile: boolean, 
  variant: "pixel" | "blossom"
): Particle[] {
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return [];

  const W = Math.ceil(rect.width);
  const H = Math.ceil(rect.height);
  const oc = document.createElement("canvas");
  oc.width = W; oc.height = H;
  const ctx = oc.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node: Node | null;

  while ((node = walker.nextNode())) {
    const tn = node as Text;
    if (!tn.textContent?.trim()) continue;
    const parent = tn.parentElement;
    if (!parent) continue;

    const cs = window.getComputedStyle(parent);
    const fill = cs.getPropertyValue("-webkit-text-fill-color");
    const color =
      fill === "transparent" ||
      cs.color === "rgba(0, 0, 0, 0)" ||
      cs.color === "transparent"
        ? fallback
        : cs.color;

    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";

    const text = tn.textContent;
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      try {
        range.setStart(tn, m.index);
        range.setEnd(tn, m.index + m[0].length);
        for (const r of Array.from(range.getClientRects())) {
          ctx.fillText(m[0], r.left - rect.left, r.top - rect.top);
        }
      } catch { /* Safe skip */ }
    }
  }

  const imageData = ctx.getImageData(0, 0, W, H);
  const { data } = imageData;
  
  // Count non-transparent pixels
  let filledCount = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] >= 100) filledCount++;
  }

  // Hard caps: 400 desktop, 220 mobile for blossom.
  const cap = variant === "blossom" ? (isMobile ? 220 : 400) : (isMobile ? 300 : 600);
  let STEP = 4;
  if (filledCount > 0) {
    const idealStep = Math.sqrt(filledCount / cap);
    STEP = Math.max(2, Math.ceil(idealStep));
  }

  const out: Particle[] = [];
  for (let py = 0; py < H; py += STEP) {
    for (let px = 0; px < W; px += STEP) {
      const i = (py * W + px) * 4;
      if (data[i + 3] < 100) continue;
      
      const rad = 1.5 + Math.random() * 1.5;
      out.push({
        x: px,
        y: py,
        startX: px,
        startY: py,
        vx: 0,
        vy: 0,
        alpha: 1,
        decay: 0.01,
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        radius: rad,
        maxRadius: rad,
      });
    }
  }
  return out;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  delay?: number;
  textColor?: string;
  variant?: "pixel" | "blossom";
}

export default function ScrollTextReveal({
  children,
  className = "",
  wrapperClassName = "",
  delay = 0,
  textColor = "#1a1c19",
  variant = "blossom",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cvRef   = useRef<HTMLCanvasElement>(null);
  const psRef   = useRef<Particle[]>([]);
  const rafRef  = useRef<number | null>(null);
  const state   = useRef<AnimState>("dispersed");

  useEffect(() => {
    ensureManager();
    const wrap = wrapRef.current;
    const text = textRef.current;
    const cv   = cvRef.current;
    if (!wrap || !text || !cv) return;

    // Detect mobile and system reduced motion preference
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Rise-up ───────────────────────────────────────────────────────────
    const riseUp = () => {
      if (state.current === "stable" || state.current === "rising") return;
      const wasDispersing = state.current === "dispersing";

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      cv.style.display = "none";
      psRef.current = [];

      state.current = "rising";
      text.style.transition = "none";
      text.style.opacity    = "0";

      if (!wasDispersing) {
        text.style.transform = "translateY(30px)";
      }

      requestAnimationFrame(() => {
        text.style.transition =
          `opacity 0.35s ease ${delay}s, transform 0.43s cubic-bezier(0.16,1,0.3,1) ${delay}s`;
        text.style.opacity   = "1";
        text.style.transform = "translateY(0px)";

        const ms = (delay + 0.43) * 1000 + 50;
        setTimeout(() => {
          if (state.current === "rising") state.current = "stable";
        }, ms);
      });
    };

    // ── Pixel dispersion ──────────────────────────────────────────────────
    const disperse = () => {
      if (state.current !== "stable") return;
      
      if (prefersReducedMotion) {
        state.current = "dispersing";
        text.style.transition = "opacity 0.3s ease";
        text.style.opacity = "0";
        setTimeout(() => {
          state.current = "dispersed";
          text.style.transform = "translateY(30px)";
        }, 300);
        return;
      }

      state.current = "dispersing";
      const r = text.getBoundingClientRect();
      
      // Calculate canvas bounds: Cap expanded bounds at viewport width and 1.5x text height
      let canvasW = Math.ceil(r.width);
      let canvasH = Math.ceil(r.height);
      let offsetX = 0;
      let offsetY = 0;

      if (variant === "blossom") {
        offsetX = r.width * 0.15;
        offsetY = Math.min(100, Math.ceil(r.height * 0.25));
        canvasW = Math.min(window.innerWidth, Math.ceil(r.width * 1.6));
        canvasH = Math.ceil(r.height * 1.5);
        
        cv.style.left = -offsetX + "px";
        cv.style.top = -offsetY + "px";
      } else {
        cv.style.left = "0px";
        cv.style.top = "0px";
      }

      cv.width  = canvasW;
      cv.height = canvasH;
      cv.style.width  = canvasW + "px";
      cv.style.height = canvasH + "px";
      cv.style.display = "block";

      const sampled = samplePixels(text, textColor, isMobile, variant);

      // Pre-render 6 cherry blossom sprites offscreen
      const spriteCanvases: HTMLCanvasElement[] = [];
      if (variant === "blossom") {
        const basePinks = [
          { r: 255, g: 77,  b: 128 }, // Dark pink
          { r: 255, g: 110, b: 145 }, // Deep rose
          { r: 255, g: 143, b: 171 }, // Medium pink
          { r: 255, g: 165, b: 188 }, // Light-medium pink
        ];

        for (let i = 0; i < 6; i++) {
          const base = basePinks[i % basePinks.length];
          const shade = 0.8 + Math.random() * 0.2;
          const r = Math.round(base.r * shade);
          const g = Math.round(base.g * shade);
          const b = Math.round(base.b * shade);

          const sizeX = 3 + Math.random() * 2.5;
          const sizeY = 5 + Math.random() * 3.5;

          const sc = document.createElement("canvas");
          const pad = 4;
          const w = Math.ceil(sizeX * 2 + pad * 2);
          const h = Math.ceil(sizeY * 2 + pad * 2);
          sc.width = w;
          sc.height = h;
          const sCtx = sc.getContext("2d");
          if (sCtx) {
            // High speed offscreen draw
            const grad = sCtx.createLinearGradient(w / 2, h / 2 + sizeY, w / 2, h / 2 - sizeY);
            grad.addColorStop(0, `rgb(${r},${g},${b})`); // base
            grad.addColorStop(1, `rgb(255, 238, 243)`); // tip (light tip)
            
            sCtx.beginPath();
            sCtx.ellipse(w / 2, h / 2, sizeX, sizeY, 0, 0, Math.PI * 2);
            sCtx.fillStyle = grad;
            sCtx.fill();
          }
          spriteCanvases.push(sc);
        }
      }

      // Initialize particles
      psRef.current = sampled.map((p) => {
        const pX = p.startX + offsetX;
        const pY = p.startY + offsetY;

        if (variant === "blossom") {
          const spriteIndex = Math.floor(Math.random() * 6);
          return {
            ...p,
            x: pX,
            y: pY,
            spriteIndex,
            // Sweeps right and slightly upwards mimicking diagonal wind tunnel in images
            vx: 0.5 + Math.random() * 2.0,
            vy: -0.5 - Math.random() * 1.5,
            decay: 0.0012 + Math.random() * 0.002, // slower decay ~0.0022 for longer flight
            swaySpeed: 0.02 + Math.random() * 0.03,
            swayOffset: Math.random() * Math.PI * 2,
            gravity: 0.02 + Math.random() * 0.02,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: -0.04 + Math.random() * 0.08,
            flutterSpeed: 0.04 + Math.random() * 0.06,
          };
        } else {
          // Pixel variant setup (without shadowBlur)
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random() * 2.5;
          return {
            ...p,
            x: pX,
            y: pY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.3,
            decay: 0.004 + Math.random() * 0.004,
          };
        }
      });

      // Hide actual text
      text.style.transition = "none";
      text.style.opacity    = "0";

      const ctx2d = cv.getContext("2d");
      if (!ctx2d || psRef.current.length === 0) {
        cv.style.display  = "none";
        state.current     = "dispersed";
        text.style.transform = "translateY(30px)";
        return;
      }

      let frameCount = 0;
      let lastFrameTime: number | null = null;
      let jankCount = 0;

      const animParticles = () => {
        ctx2d.clearRect(0, 0, cv.width, cv.height);
        let alive = 0;
        frameCount++;

        // --- Frame Budget Guard ---
        const now = performance.now();
        if (lastFrameTime !== null) {
          const dt = now - lastFrameTime;
          if (dt > 22) { // Frame took longer than 22ms (~45fps drop)
            jankCount++;
            if (jankCount >= 3) {
              // Dynamic Culling: Cull 30% of active particles with the lowest alpha
              const active = psRef.current.filter(p => p.alpha > 0);
              active.sort((a, b) => a.alpha - b.alpha);
              const cullCount = Math.floor(active.length * 0.30);
              for (let i = 0; i < cullCount; i++) {
                active[i].alpha = 0;
              }
              jankCount = 0;
            }
          } else {
            jankCount = Math.max(0, jankCount - 1);
          }
        }
        lastFrameTime = now;

        if (variant === "blossom") {
          // Wind sweep forces
          const windX = 0.03 + Math.random() * 0.03; // push right
          const windY = -0.015 - Math.random() * 0.02; // lift up

          for (const p of psRef.current) {
            if (p.alpha <= 0) continue;
            alive++;

            p.rotation = (p.rotation || 0) + (p.rotationSpeed || 0);
            
            // Dynamic wind acceleration
            p.vx += windX;
            p.vy += windY;
            p.vx *= 0.975;
            p.vy *= 0.975;

            // Sway wave horizontal/vertical turbulence
            const sway = Math.sin((p.swayOffset || 0) + frameCount * (p.swaySpeed || 0.03)) * 0.5;
            const flutterY = Math.cos((p.swayOffset || 0) + frameCount * (p.swaySpeed || 0.03)) * 0.25;

            p.x += p.vx + sway;
            p.y += p.vy + flutterY;
            p.alpha -= p.decay;

            // 3D flutter scale
            const scaleY = 0.3 + Math.abs(Math.sin(frameCount * (p.flutterSpeed || 0.05))) * 0.7;

            const sprite = spriteCanvases[p.spriteIndex ?? 0];
            if (sprite) {
              ctx2d.save();
              ctx2d.translate(p.x, p.y);
              ctx2d.rotate(p.rotation);
              ctx2d.scale(1, scaleY);
              ctx2d.globalAlpha = Math.max(0, Math.min(1, p.alpha));
              ctx2d.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
              ctx2d.restore();
            }
          }
        } else {
          // Pixel variant particle loop (Optimized: Removed shadowBlur entirely)
          for (const p of psRef.current) {
            if (p.alpha <= 0) continue;
            alive++;

            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.985;
            p.vy *= 0.985;
            p.alpha -= p.decay;

            const currentRadius = p.radius * (0.3 + p.alpha * 0.7);

            ctx2d.beginPath();
            ctx2d.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
            ctx2d.fillStyle = `rgba(${p.r},${p.g},${p.b},${Math.max(0, p.alpha)})`;
            ctx2d.fill();
          }
        }

        if (alive > 0) {
          rafRef.current = requestAnimationFrame(animParticles);
        } else {
          cv.style.display     = "none";
          psRef.current        = [];
          state.current        = "dispersed";
          text.style.transform = "translateY(30px)";
        }
      };

      rafRef.current = requestAnimationFrame(animParticles);
    };

    const reg: Registration = {
      wrap,
      getState: () => state.current,
      riseUp,
      disperse,
    };
    registry.add(reg);

    // Visibility trigger on mount
    const initTimer = setTimeout(() => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0 && state.current === "dispersed") {
        riseUp();
      }
    }, 80);

    return () => {
      registry.delete(reg);
      clearTimeout(initTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [delay, textColor, variant]);

  return (
    <div ref={wrapRef} className={wrapperClassName} style={{ position: "relative" }}>
      <div
        ref={textRef}
        className={className}
        style={{ opacity: 0, transform: "translateY(30px)" }}
      >
        {children}
      </div>
      <canvas
        ref={cvRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          display: "none",
          zIndex: 40,
        }}
      />
    </div>
  );
}
