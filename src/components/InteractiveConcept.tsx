import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, HelpCircle, DollarSign, ArrowRight, Flame } from 'lucide-react';
import { useAnimationConfig } from '../hooks/useAnimationConfig';
import ScrollTextReveal from './ui/ScrollTextReveal';


export default function InteractiveConcept() {
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();
  const [traffic, setTraffic] = useState(10000);
  const [conversionRate, setConversionRate] = useState(1.0);
  const [leadValue, setLeadValue] = useState(100);

  // Targets / Benchmarks
  const targetConversion = 3.5; // YS Sites target conversion rate

  // Calculations
  const currentLeads = Math.round((traffic * conversionRate) / 100);
  const optimizedLeads = Math.round((traffic * targetConversion) / 100);
  const leadDifference = Math.max(0, optimizedLeads - currentLeads);
  
  const currentRevenue = currentLeads * leadValue;
  const optimizedRevenue = optimizedLeads * leadValue;
  const moneyWasted = Math.max(0, optimizedRevenue - currentRevenue);

  // 3D Parallax Tilt Effect on Card
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const rotateX = useSpring(useTransform(y, [-150, 150], [10, -10]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-10, 10]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates from center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="py-24 bg-surface relative overflow-hidden border-b border-zinc-100 gpu-accelerated">
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-brand-red-light/40 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-zinc-100 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Text and Strategy */}
        <motion.div
          initial={{ opacity: 0, x: getDistance(-30) }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportConfig}
          transition={{ duration: getDuration(0.6), ease: getEase() }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-6">
            <ScrollTextReveal delay={0} textColor="#E11D2E" wrapperClassName="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-brand-red fill-brand-red animate-bounce" />
              Interactive Cash Burn Audit
            </ScrollTextReveal>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink mb-6 leading-tight">
            <ScrollTextReveal delay={0.1} textColor="#0A0A0A" wrapperClassName="block">
              Calculate How Much You're <br />
              <span className="text-brand-red">Burning on Bad Design</span>
            </ScrollTextReveal>
          </h2>
          <p className="text-muted text-lg md:text-xl font-light mb-8 leading-relaxed">
            <ScrollTextReveal delay={0.2} textColor="#52525B" wrapperClassName="block">
              Most agencies sell you beautiful templates. We build **sales systems**. Toggle the sliders to see the exact value of your missed conversions, and see how simple tweaks can add tens of thousands to your bottom line.
            </ScrollTextReveal>
          </p>

          <div className="space-y-6 mb-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-brand-red shrink-0">1</div>
              <div>
                <h4 className="font-bold text-ink text-lg mb-1">Increase Conversions by 3x</h4>
                <p className="text-muted text-sm">Optimize page weight, visual pathways, and friction to elevate passive browsing into active lead inquiries.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-brand-red shrink-0">2</div>
              <div>
                <h4 className="font-bold text-ink text-lg mb-1">Stop Leaking Traffic</h4>
                <p className="text-muted text-sm">Slow loading times on mobile account for up to 53% of abandoned visits. We build on blistering-fast custom infrastructure.</p>
              </div>
            </div>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-3 bg-brand-red hover:bg-brand-red-dark text-white font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_4px_20px_rgba(225,29,46,0.25)]"
          >
            Claim Your Free Audit
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Right Side: Interactive 3D Card Calculator */}
        <div className="perspective-1000 flex justify-center">
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-full max-w-lg bg-white border border-zinc-200 rounded-[40px] p-8 md:p-10 shadow-xl relative overflow-hidden group transition-shadow duration-500 hover:shadow-2xl"
          >
            {/* Gloss shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-brand-red-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="space-y-6" style={{ transform: "translateZ(30px)" }}>
              <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                <span className="font-bold text-ink text-lg">YS Live Value Estimator</span>
                <span className="text-brand-red text-xs font-bold tracking-widest uppercase bg-brand-red-light px-2.5 py-1 rounded-full">ROI Meter</span>
              </div>

              {/* Sliders Block */}
              <div className="space-y-6">
                {/* Slider 1: Traffic */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-muted">Monthly Website Traffic</span>
                    <span className="text-brand-red font-bold">{traffic.toLocaleString()} visitors</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={traffic}
                    onChange={(e) => setTraffic(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-brand-red"
                  />
                </div>

                {/* Slider 2: Conversion */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-muted">Current Conversion Rate</span>
                    <span className="text-brand-red font-bold">{conversionRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-brand-red"
                  />
                </div>

                {/* Slider 3: Lead value */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-muted">Average Deal Value</span>
                    <span className="text-brand-red font-bold">${leadValue}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={leadValue}
                    onChange={(e) => setLeadValue(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-brand-red"
                  />
                </div>
              </div>

              {/* Comparison Section */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                  <div className="text-xs text-muted font-bold uppercase tracking-wide">Current Leads</div>
                  <div className="text-2xl font-extrabold text-muted mt-1">{currentLeads} / mo</div>
                </div>
                <div className="bg-brand-red-light/30 rounded-2xl p-4 border border-brand-red/20">
                  <div className="text-xs text-brand-red font-bold uppercase tracking-wide">YS Target (3.5%)</div>
                  <div className="text-2xl font-extrabold text-brand-red mt-1">{optimizedLeads} / mo</div>
                </div>
              </div>

              {/* Final calculation block */}
              <div className="pt-6 border-t border-zinc-100 text-center space-y-1">
                <div className="text-sm font-semibold text-muted uppercase tracking-wider flex items-center justify-center gap-1">
                  Estimated Cash Leakage
                  <span title="Lost revenue based on industry-benchmark conversion gains">
                    <HelpCircle className="w-4 h-4 text-zinc-400 cursor-help" />
                  </span>
                </div>
                <motion.div
                  key={moneyWasted}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl md:text-5xl font-extrabold text-brand-red tracking-tight"
                >
                  ${moneyWasted.toLocaleString()} <span className="text-lg text-muted font-medium">/ yr</span>
                </motion.div>
                <p className="text-xs text-muted max-w-xs mx-auto">
                  That's cash you're actively burning on a website that isn't built to scale. Let's patch the leak.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
