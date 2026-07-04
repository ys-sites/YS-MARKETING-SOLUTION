import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Marc-Antoine B.",
    role: "Owner, Centre AllBall",
    content: "Our sports complex needed a website that makes booking courts effortless. YS Marketing Solutions delivered a blazing-fast, premium platform. Court bookings have increased by 40%!",
  },
  {
    name: "Elena D.",
    role: "Founder, ME Voyages",
    content: "Absolutely outstanding work on our luxury travel website. YS captured our premium brand experience perfectly. The custom layouts and smooth animations have blown our clients away.",
  },
  {
    name: "Farid K.",
    role: "Owner, 1001 Nuits",
    content: "YS built a beautiful, high-converting digital presence for our restaurant. Table reservations and online orders went up immediately after launch. Highly professional and easy to work with!",
  },
  {
    name: "Alexandre S.",
    role: "Founder, IronFuel Lab",
    content: "Our e-commerce store load speed is critical. YS redesigned our shop from the ground up, cutting load times in half. Conversion rates spiked by 2.8% in the first month.",
  },
  {
    name: "Jannette W.",
    role: "Founder, Jannette Caribbean",
    content: "The team at YS Marketing Solutions really understands customer service. They took the time to understand our catering and restaurant needs, creating a beautiful website. 5 stars!",
  },
  {
    name: "Manny P.",
    role: "Founder, Manny Painter",
    content: "Stunning website! We went from getting zero online inquiries to receiving daily high-quality painting leads straight to our inbox. YS is the best in the business.",
  },
  {
    name: "Jayden L.",
    role: "Co-Founder, A-Tier Exotics",
    content: "Our luxury car rental brand demands visual perfection. The website YS crafted is state-of-the-art—modern, fluid, and extremely fast. It matches our luxury standards completely.",
  },
  {
    name: "Sylvain R.",
    role: "Owner, Pro Elite Wash",
    content: "YS built our lead generation system and it has been a game-changer. We've booked more exterior cleaning jobs in the past two months than all of last year combined!",
  },
  {
    name: "Robert G.",
    role: "Manager, Auto Ruby",
    content: "We needed a clean, fast inventory showcase website. YS Marketing Solutions built a high-performance system that loads instantly. Our customer inquiries have never been higher.",
  },
];

export default function SocialProof() {
  return (
    <section id="testimonials" className="py-28 bg-surface-alt relative overflow-hidden border-b border-zinc-200">
      {/* Background radial accent */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-red via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 flex flex-col items-center">
          <span className="px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-ink tracking-tight mb-6">
            What Our <span className="text-brand-red">Clients</span> Say
          </h2>
          <p className="text-muted text-lg md:text-xl max-w-2xl font-light leading-relaxed">
            Don't just take our word for it. Hear directly from the business owners who turned their websites into high-performance sales engines.
          </p>
        </div>

        {/* Marquee Vertical Grid Grid */}
        <div 
           className="relative h-[600px] md:h-[750px] overflow-hidden" 
           style={{ 
             WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)', 
             maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' 
           }}
        >
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              {[
                { speed: 'animate-marquee-vertical', offset: 0 },
                { speed: 'animate-marquee-vertical-slow', offset: 3 },
                { speed: 'animate-marquee-vertical-fast', offset: 6 }
              ].map((col, cIdx) => {
                // Slice and wrap reviews to give each column starting offsets
                const colReviews = [
                  ...testimonials.slice(col.offset), 
                  ...testimonials.slice(0, col.offset)
                ];
                // Duplicate column array to make vertical scroll seamless
                const repeatedReviews = [...colReviews, ...colReviews, ...colReviews];
                
                return (
                  <div 
                    key={cIdx} 
                    className={`h-max ${cIdx === 1 ? 'hidden md:block' : ''} ${cIdx === 2 ? 'hidden lg:block' : ''}`}
                  >
                    <div
                      className={`flex flex-col gap-6 marquee-track will-change-transform ${col.speed}`}
                    >
                      {repeatedReviews.map((review, idx) => (
                          <div 
                            key={idx}
                            className="bg-white border border-zinc-200/60 p-8 rounded-[2rem] relative shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(225,29,46,0.06)] hover:border-brand-red/20 transition-all duration-500 hover:-translate-y-1 group"
                          >
                            <div className="absolute top-8 right-8 opacity-[0.04] group-hover:scale-110 group-hover:text-brand-red transition-all duration-500">
                              <Quote size={48} />
                            </div>
                            <div className="flex gap-1 mb-6 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill="currentColor" className="stroke-none" />
                              ))}
                            </div>
                            <p className="text-zinc-700 mb-8 font-medium text-base relative z-10 leading-relaxed min-h-[90px] tracking-tight italic">
                              "{review.content}"
                            </p>
                            <div className="flex items-center gap-4 pt-6 border-t border-zinc-100">
                              <div className="w-12 h-12 bg-gradient-to-br from-brand-red-light/30 to-brand-red-light/80 rounded-2xl flex items-center justify-center text-brand-red font-black text-lg shadow-inner group-hover:scale-105 transition-transform duration-500 capitalize">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-extrabold text-zinc-900 tracking-tight text-sm">{review.name}</p>
                                <p className="text-[9px] text-brand-red font-black uppercase tracking-widest opacity-80">{review.role}</p>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

      </div>
    </section>
  );
}
