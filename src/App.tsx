import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import ProblemAgitate from './components/ProblemAgitate';
import Services from './components/Services';
import InteractiveConcept from './components/InteractiveConcept';
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
      <main>
        <Hero />
        <StatsSection />
        <ProblemAgitate />
        <Services />
        <InteractiveConcept />
        <ScannerSection />
        <Portfolio />
        <Process />
        <SocialProof />
        <CTA />
        <ContactSection />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
