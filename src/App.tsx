import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import Services from './components/Services';
import ScannerSection from './components/ScannerSection';
import Portfolio from './components/Portfolio';
import ImpactSection from './components/ImpactSection';
import SocialProof from './components/SocialProof';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import WhatsAppButton from './components/WhatsAppButton';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen selection:bg-brand-red-light selection:text-brand-red bg-surface text-ink antialiased">
        <Navbar />
        <main className="relative">
          <Hero />
          
          {/* Curved Content Overlay — paint containment isolates shadow repaint from scroll events */}
          <div 
            className="relative z-30 -mt-20 md:-mt-28 bg-white rounded-t-[40px] md:rounded-t-[80px] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden"
            style={{ isolation: 'isolate' }}
          >
            <StatsSection />
            <Services />
            <Portfolio />
            <ImpactSection />
            <SocialProof />
            <ScannerSection />
            <ContactSection />
          </div>
        </main>
        <Footer />
        <StickyCTA />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  );
}
