import React, { Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import Services from './components/Services';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import WhatsAppButton from './components/WhatsAppButton';
import { LanguageProvider } from './context/LanguageContext';

const Portfolio = React.lazy(() => import('./components/Portfolio'));
const ImpactSection = React.lazy(() => import('./components/ImpactSection'));
const SocialProof = React.lazy(() => import('./components/SocialProof'));
const ScannerSection = React.lazy(() => import('./components/ScannerSection'));
const ContactSection = React.lazy(() => import('./components/ContactSection'));
const FaqSection = React.lazy(() => import('./components/FaqSection'));

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen selection:bg-brand-red-light selection:text-brand-red bg-surface text-ink antialiased">
        <Navbar />
        <main className="relative">
          <Hero />
          
          {/* Curved Content Overlay — paint containment isolates shadow repaint from scroll events */}
          <div 
            className="relative z-30 -mt-8 md:-mt-12 bg-white rounded-t-[40px] md:rounded-t-[80px] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden"
            style={{ isolation: 'isolate' }}
          >
            <StatsSection />
            <Services />
            
            <Suspense fallback={<div className="min-h-[400px] w-full bg-white" />}>
              <Portfolio />
            </Suspense>
            
            <Suspense fallback={<div className="min-h-[400px] w-full bg-white" />}>
              <ImpactSection />
            </Suspense>
            
            <Suspense fallback={<div className="min-h-[400px] w-full bg-white" />}>
              <SocialProof />
            </Suspense>
            
            <Suspense fallback={<div className="min-h-[400px] w-full bg-white" />}>
              <ScannerSection />
            </Suspense>
            
            <Suspense fallback={<div className="min-h-[400px] w-full bg-white" />}>
              <ContactSection />
            </Suspense>
            
            <Suspense fallback={<div className="min-h-[400px] w-full bg-white" />}>
              <FaqSection />
            </Suspense>
          </div>
        </main>
        <Footer />
        <StickyCTA />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  );
}
