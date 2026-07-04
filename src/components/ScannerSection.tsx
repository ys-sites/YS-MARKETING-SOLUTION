import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function ScannerSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const cardStreamRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);

  const controllers = useRef<{
    cardStream?: any;
    particleSystem?: any;
    particleScanner?: any;
  }>({});

  const isVisibleRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !cardLineRef.current || !cardStreamRef.current || !particleCanvasRef.current || !scannerCanvasRef.current) return;

    class CardStreamController {
      container: HTMLDivElement;
      cardLine: HTMLDivElement;
      position: number;
      velocity: number;
      direction: number;
      isDragging: boolean;
      lastTime: number;
      lastMouseX: number;
      mouseVelocity: number;
      friction: number;
      minVelocity: number;
      containerWidth: number;
      cardLineWidth: number;
      rafId: number | null = null;
      resizeHandler: ((() => void) | null) = null;

      constructor(container: HTMLDivElement, cardLine: HTMLDivElement) {
        this.container = container;
        this.cardLine = cardLine;
        this.position = 0;
        this.velocity = 120;
        this.direction = -1;
        this.isDragging = false;
        this.lastTime = 0;
        this.lastMouseX = 0;
        this.mouseVelocity = 0;
        this.friction = 0.95;
        this.minVelocity = 30;
        this.containerWidth = 0;
        this.cardLineWidth = 0;
        this.init();
      }

      init() {
        this.populateCardLine();
        this.calculateDimensions();
        this.setupEventListeners();
        this.updateCardPosition();
        this.animate();
      }

      calculateDimensions() {
        this.containerWidth = this.container.offsetWidth;
        const isMobile = window.innerWidth < 768;
        const cardWidth = isMobile ? 280 : 400;
        const cardGap = 60;
        const cardCount = this.cardLine.children.length;
        this.cardLineWidth = (cardWidth + cardGap) * cardCount;
      }

      setupEventListeners() {
        const onStart = (e: any) => this.startDrag(e.touches ? e.touches[0] : e);
        const onMove = (e: any) => this.onDrag(e.touches ? e.touches[0] : e);
        const onEnd = () => this.endDrag();

        this.cardLine.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        this.cardLine.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);

        this.resizeHandler = () => this.calculateDimensions();
        window.addEventListener('resize', this.resizeHandler);
      }

      startDrag(e: any) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.mouseVelocity = 0;
        
        const transform = window.getComputedStyle(this.cardLine).transform;
        if (transform !== 'none') {
          const matrix = new DOMMatrix(transform);
          this.position = matrix.m41;
        }
        this.cardLine.classList.add('dragging');
      }

      onDrag(e: any) {
        if (!this.isDragging) return;
        const deltaX = e.clientX - this.lastMouseX;
        this.position += deltaX;
        this.mouseVelocity = deltaX * 60;
        this.lastMouseX = e.clientX;
        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
      }

      endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.cardLine.classList.remove('dragging');
        if (Math.abs(this.mouseVelocity) > this.minVelocity) {
          this.velocity = Math.abs(this.mouseVelocity);
          this.direction = this.mouseVelocity > 0 ? 1 : -1;
        } else {
          this.velocity = 120;
        }
      }

      animate() {
        if (!isVisibleRef.current) {
          this.rafId = requestAnimationFrame(() => this.animate());
          return;
        }
        const currentTime = performance.now();
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.05); // cap delta to avoid jumps
        this.lastTime = currentTime;

        if (!this.isDragging) {
          if (this.velocity > this.minVelocity) {
            this.velocity *= this.friction;
          } else {
            this.velocity = Math.max(this.minVelocity, this.velocity);
          }
          this.position += this.velocity * this.direction * deltaTime;
          this.updateCardPosition();
        }
        this.rafId = requestAnimationFrame(() => this.animate());
      }

      updateCardPosition() {
        if (this.position < -this.cardLineWidth) {
          this.position = this.containerWidth;
        } else if (this.position > this.containerWidth) {
          this.position = -this.cardLineWidth;
        }
        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
      }

      updateCardClipping() {
        const scannerX = window.innerWidth / 2;
        const scannerWidth = 2;
        const scannerLeft = scannerX - scannerWidth / 2;
        const scannerRight = scannerX + scannerWidth / 2;
        let anyScanningActive = false;

        const wrappers = this.cardLine.querySelectorAll('.card-wrapper');
        wrappers.forEach((wrapper: any) => {
          const rect = wrapper.getBoundingClientRect();
          const cardLeft = rect.left;
          const cardRight = rect.right;
          const cardWidth = rect.width;

          const normalCard = wrapper.querySelector('.card-normal');
          const asciiCard = wrapper.querySelector('.card-ascii');

          if (cardLeft < scannerRight && cardRight > scannerLeft) {
            anyScanningActive = true;
            const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
            const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth);

            const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
            const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

            normalCard.style.setProperty('--clip-right', `${normalClipRight}%`);
            asciiCard.style.setProperty('--clip-left', `${asciiClipLeft}%`);

            if (!wrapper.hasAttribute('data-scanned') && scannerIntersectLeft > 0) {
              wrapper.setAttribute('data-scanned', 'true');
              const scanEffect = document.createElement('div');
              scanEffect.className = 'scan-effect';
              wrapper.appendChild(scanEffect);
              setTimeout(() => scanEffect.remove(), 600);
            }
          } else {
            if (cardRight < scannerLeft) {
              normalCard.style.setProperty('--clip-right', '100%');
              asciiCard.style.setProperty('--clip-left', '100%');
            } else if (cardLeft > scannerRight) {
              normalCard.style.setProperty('--clip-right', '0%');
              asciiCard.style.setProperty('--clip-left', '0%');
            }
            wrapper.removeAttribute('data-scanned');
          }
        });

        if (controllers.current.particleScanner) {
          controllers.current.particleScanner.setScanningActive(anyScanningActive);
        }
      }

      generateCode(width: number, height: number) {
        const library = [
          "// compiled preview • scanner demo",
          "const SCAN_WIDTH = 8;",
          "const FADE_ZONE = 35;",
          "const MAX_PARTICLES = 2500;",
          "function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }",
          "function lerp(a, b, t) { return a + (b - a) * t; }",
          "const now = () => performance.now();",
          "class Particle { constructor(x, y) { this.x = x; this.y = y; } }",
          "const state = { intensity: 1.2, particles: 2500 };",
          "// YS Marketing Solutions - Scaling Businesses",
          "// High-performance digital solutions",
          "// Lead generation • Conversion lift",
          "// Custom Web Development • AI Integration"
        ];
        let flow = library.join(" ");
        const totalChars = width * height;
        while (flow.length < totalChars) flow += " " + library[Math.floor(Math.random() * library.length)];
        
        let out = "";
        for (let row = 0; row < height; row++) {
          out += flow.slice(row * width, (row + 1) * width) + "\n";
        }
        return out;
      }

      populateCardLine() {
        this.cardLine.innerHTML = "";
        const cardsCount = 15;
        const cardImages = [
          "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png",
          "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png",
          "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png",
          "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png",
          "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png"
        ];

        for (let i = 0; i < cardsCount; i++) {
          const wrapper = document.createElement("div");
          wrapper.className = "card-wrapper";

          const normalCard = document.createElement("div");
          normalCard.className = "card card-normal";
          const img = document.createElement("img");
          img.className = "card-image";
          img.src = cardImages[i % cardImages.length];
          img.referrerPolicy = "no-referrer";
          normalCard.appendChild(img);

          const asciiCard = document.createElement("div");
          asciiCard.className = "card card-ascii";
          const asciiContent = document.createElement("div");
          asciiContent.className = "ascii-content";
          asciiContent.textContent = this.generateCode(60, 20);
          asciiCard.appendChild(asciiContent);

          wrapper.appendChild(normalCard);
          wrapper.appendChild(asciiCard);
          this.cardLine.appendChild(wrapper);
        }
      }

      resetPosition() {
        this.position = this.containerWidth;
        this.velocity = 120;
        this.direction = -1;
        this.cardLine.style.transform = `translateX(${this.position}px)`;
      }

      destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
      }
    }

    class ParticleSystem {
      scene: THREE.Scene;
      camera: THREE.OrthographicCamera;
      renderer: THREE.WebGLRenderer;
      particles: THREE.Points | null = null;
      particleCount = 200;
      canvas: HTMLCanvasElement;
      rafId: number | null = null;
      velocities: Float32Array = new Float32Array(0);

      lastFrameTime = 0;

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, 150, -150, 1, 1000);
        this.camera.position.z = 100;
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: false });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.setSize(window.innerWidth, 300);
        this.createParticles();
        this.animate();
      }

      createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const alphas = new Float32Array(this.particleCount);
        const velocities = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount; i++) {
          positions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 2;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
          positions[i * 3 + 2] = 0;
          alphas[i] = Math.random();
          velocities[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        
        const material = new THREE.ShaderMaterial({
          uniforms: { color: { value: new THREE.Color(0xe11d2e) } }, // Brand Red Accent
          vertexShader: `
            attribute float alpha;
            varying float vAlpha;
            void main() {
              vAlpha = alpha;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = 2.0;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            varying float vAlpha;
            void main() {
              gl_FragColor = vec4(color, vAlpha * 0.5);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        this.velocities = velocities;
      }

      animate() {
        this.rafId = requestAnimationFrame(() => this.animate());
        if (!isVisibleRef.current) return;
        // Throttle WebGL to ~30fps to reduce GPU pressure
        const now = performance.now();
        if (now - this.lastFrameTime < 33) return;
        this.lastFrameTime = now;
        if (this.particles) {
          const positions = this.particles.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] += this.velocities[i];
            if (positions[i * 3] > window.innerWidth / 2) positions[i * 3] = -window.innerWidth / 2;
          }
          this.particles.geometry.attributes.position.needsUpdate = true;
        }
        this.renderer.render(this.scene, this.camera);
      }

      destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.renderer.dispose();
      }
    }

    class ParticleScanner {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      particles: any[] = [];
      scanningActive = false;
      rafId: number | null = null;

      lastFrameTime = 0;

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.canvas.width = window.innerWidth;
        this.canvas.height = 400;
        this.animate();
      }

      setScanningActive(active: boolean) {
        this.scanningActive = active;
      }

      animate() {
        this.rafId = requestAnimationFrame(() => this.animate());
        if (!isVisibleRef.current) return;
        // Throttle canvas scanner to ~30fps
        const now = performance.now();
        if (now - this.lastFrameTime < 33) return;
        this.lastFrameTime = now;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.scanningActive) {
          for (let i = 0; i < 3; i++) {
            this.particles.push({
              x: this.canvas.width / 2,
              y: Math.random() * this.canvas.height,
              vx: (Math.random() - 0.2) * 5,
              vy: (Math.random() - 0.5) * 2,
              life: 1.0,
              size: Math.random() * 2 + 1
            });
          }
        }

        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.025;
          this.ctx.fillStyle = `rgba(225, 29, 46, ${p.life * 0.45})`;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        });
      }

      destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
      }
    }

    controllers.current.cardStream = new CardStreamController(cardStreamRef.current, cardLineRef.current);
    controllers.current.particleSystem = new ParticleSystem(particleCanvasRef.current);
    controllers.current.particleScanner = new ParticleScanner(scannerCanvasRef.current);

    // Pause all loops when section is off-screen — eliminates off-screen rendering cost
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: '100px 0px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      controllers.current.cardStream?.destroy();
      controllers.current.particleSystem?.destroy();
      controllers.current.particleScanner?.destroy();
    };
  }, []);

  return (
    <section className="scanner-section" ref={containerRef}>
      <motion.div 
        className="w-full h-full flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="absolute top-8 md:top-10 left-1/2 -translate-x-1/2 text-center z-50 w-full px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-4 tracking-tight leading-tight">
            {t.scanner.titlePart1} <br />
            <span className="text-zinc-900">{t.scanner.titlePart2} <span className="bg-gradient-to-r from-brand-red to-brand-red-dark text-white px-3 py-1 rounded-xl inline-block transform -rotate-2 shadow-lg shadow-brand-red/20">{t.scanner.titlePart3}</span><span className="text-brand-red font-black">{t.scanner.titlePart4}</span></span>
          </h2>
        </div>

        <div className="container">
          <canvas id="particleCanvas" ref={particleCanvasRef} aria-hidden="true"></canvas>
          <canvas id="scannerCanvas" ref={scannerCanvasRef} aria-hidden="true"></canvas>

          <div className="scanner"></div>

          <div className="card-stream" ref={cardStreamRef}>
            <div className="card-line" ref={cardLineRef}></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
