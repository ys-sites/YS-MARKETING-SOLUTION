import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import Services from './components/Services';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import WhatsAppButton from './components/WhatsAppButton';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import SEOMetaManager from './components/SEOMetaManager';

const Portfolio = React.lazy(() => import('./components/Portfolio'));
const ImpactSection = React.lazy(() => import('./components/ImpactSection'));
const SocialProof = React.lazy(() => import('./components/SocialProof'));
const ScannerSection = React.lazy(() => import('./components/ScannerSection'));
const ContactSection = React.lazy(() => import('./components/ContactSection'));
const FaqSection = React.lazy(() => import('./components/FaqSection'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function MainLayout() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  return (
    <>
      <Hero />
      <div 
        className="relative z-30 -mt-8 md:-mt-12 bg-white rounded-t-[40px] md:rounded-t-[80px] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden"
        style={{ isolation: 'isolate' }}
      >
        <StatsSection />
        <Services />
        
        <Suspense fallback={<div className="min-h-[400px] w-full bg-white" />}>
          <Portfolio 
            limit={6} 
            onViewAll={() => {
              navigate(language === 'fr' ? '/fr/portfolio' : '/portfolio');
            }} 
          />
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
    </>
  );
}

function PortfolioLayout() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 bg-white min-h-screen pb-16">
      <Suspense fallback={<div className="min-h-[600px] w-full bg-white" />}>
        <Portfolio 
          isSubpage={true} 
          onBack={() => {
            navigate(language === 'fr' ? '/fr' : '/');
          }} 
          onStartProject={() => {
            navigate(language === 'fr' ? '/fr' : '/');
            setTimeout(() => {
              const el = document.querySelector('#contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }}
        />
      </Suspense>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isPortfolio = location.pathname.endsWith('/portfolio');
  const view = isPortfolio ? 'portfolio-all' : 'home';
  
  return (
    <div className="min-h-screen selection:bg-brand-red-light selection:text-brand-red bg-surface text-ink antialiased">
      <SEOMetaManager />
      <ScrollToTop />
      <Navbar 
        currentView={view} 
        setView={(v) => {
          if (v === 'home') {
            navigate(language === 'fr' ? '/fr' : '/');
          }
        }} 
      />
      <main className="relative">
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/portfolio" element={<PortfolioLayout />} />
          <Route path="/fr" element={<MainLayout />} />
          <Route path="/fr/portfolio" element={<PortfolioLayout />} />
          {/* Fallback to home */}
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </main>
      <Footer />
      <StickyCTA />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
