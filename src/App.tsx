import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import Services from './components/Services';
import ScannerSection from './components/ScannerSection';
import Portfolio from './components/Portfolio';
import Process from './components/Process';
import SocialProof from './components/SocialProof';
import CTA from './components/CTA';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';

export default function App() {
  return (
    <div className="min-h-screen selection:bg-brand-red-light selection:text-brand-red bg-surface text-ink antialiased">
      <Navbar />
      <main className="relative">
        <Hero />
        
        {/* Curved Content Overlay */}
        <div className="relative z-30 -mt-20 md:-mt-28 bg-white rounded-t-[40px] md:rounded-t-[80px] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden">
          <StatsSection />
          <Services />
          <Portfolio />
          <Process />
          <SocialProof />
          <CTA />
          <ScannerSection />
          <ContactSection />
        </div>
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
