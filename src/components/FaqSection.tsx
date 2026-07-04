import React from 'react';
import { motion } from 'framer-motion';
import GlowDot from './GlowDot';
import ShinyTitle from './ShinyTitle';
import BlurText from './BlurText';
import FaqAccordion, { type FaqItem } from './FaqAccordion';
import { useAnimationConfig } from '../hooks/useAnimationConfig';

// ... painPoints and items ...


const faqItems: FaqItem[] = [
  {
    id: 'cost',
    question: 'How much does a new website cost?',
    answer:
      "Most small-business projects fall between a few thousand dollars and low five figures, depending on the number of pages, integrations, and whether SEO or lead-generation systems are included. We give you a full line-by-line quote before any work starts — no vague packages, no surprise invoices.",
  },
  {
    id: 'timeline',
    question: 'How long does it take to build my website?',
    answer:
      "A standard marketing website launches in about 2-4 weeks from kickoff. Larger builds with custom booking systems, e-commerce, or multi-language content can take 6-8 weeks. You'll get a clear timeline with milestones before we start, not after.",
  },
  {
    id: 'seo-included',
    question: 'Do you handle SEO and Google ranking, or just design?',
    answer:
      "Both. Every site we build ships with on-page SEO, fast Core Web Vitals, and a clean structure search engines can actually crawl. For clients who want to rank locally, we also build out Google Business Profile optimization and ongoing local SEO — the same system that took Manny Painter from invisible to a Top 3 Google local ranking.",
  },
  {
    id: 'ownership',
    question: 'Will I own my website, and can I make changes myself?',
    answer:
      "Yes — the site, the code, and the domain are yours. You get full access at launch, and we hand over everything needed to edit content or bring on another developer later if you ever want to. We don't lock clients into our hosting to keep the account.",
  },
  {
    id: 'existing-site',
    question: 'I already have a website — can you improve it instead of rebuilding from scratch?',
    answer:
      "Often, yes. We start with a free conversion audit to see whether your current site can be optimized (speed, SEO, lead capture) or whether a rebuild is genuinely the faster path to results. We'll tell you honestly which one makes more sense for your budget.",
  },
  {
    id: 'lead-gen',
    question: 'Can you help generate leads, not just build a website that looks good?',
    answer:
      "That's the core of what we do. Beyond design, we build the systems around the site — WhatsApp and call-to-action capture, review and ranking systems, and organic content strategy. Our 1001 Nuits case study grew from zero to over 1,000,000 combined views and 7,000+ followers across Instagram and TikTok using exactly this approach.",
  },
  {
    id: 'revisions',
    question: 'How many revisions are included?',
    answer:
      "Every project includes structured revision rounds at the design and pre-launch stages, spelled out in your proposal before you sign anything. If you need changes beyond scope after launch, we quote them upfront at a flat hourly rate — never billed as a surprise.",
  },
  {
    id: 'location',
    question: 'Do you only work with Montreal businesses?',
    answer:
      "We're based in Montreal and love working with local businesses, but the majority of what we deliver — design, development, SEO, ad management — works just as well for clients anywhere. Distance has never been a blocker for a project.",
  },
];

export default function FaqSection() {
  const { getDistance, getDuration, getEase, viewportConfig } = useAnimationConfig();
  return (
    <section id="faq" className="py-24 md:py-28 bg-surface-alt relative overflow-hidden border-t border-zinc-100 gpu-accelerated">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14 flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: getDistance(15) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: getDuration(0.5), ease: getEase() }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red-light text-brand-red text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <GlowDot />
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: getDistance(20) }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: getDuration(0.5), ease: getEase() }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink mb-6"
          >
            <ShinyTitle blackText="Questions, " redText="answered." />
          </motion.h2>
          <BlurText
            text="Everything business owners ask us before starting a project — search below or browse them all."
            delay={40}
            animateBy="words"
            direction="top"
            className="text-muted max-w-xl mx-auto text-lg font-light justify-center text-center"
          />
        </div>

        <FaqAccordion items={faqItems} searchPlaceholder="Search pricing, SEO, timelines..." />
      </div>
    </section>
  );
}
