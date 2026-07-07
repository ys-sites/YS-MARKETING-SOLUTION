import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function SEOMetaManager() {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const path = location.pathname;
    const isFrench = path.startsWith('/fr');
    const isPortfolio = path.endsWith('/portfolio');

    let title = '';
    let description = '';
    let canonical = 'https://www.ysdev.ca' + path.replace(/\/$/, '');

    // Set self-referencing canonical
    if (canonical === 'https://www.ysdev.ca') {
      canonical = 'https://www.ysdev.ca/';
    }

    if (isPortfolio) {
      if (isFrench) {
        title = "Portfolio Web | Conception et Réalisations de Sites Web à Montréal";
        description = "Découvrez nos réalisations de sites web haute performance créés par YS Marketing Solutions à Montréal. Voyez comment nous propulsons les entreprises.";
      } else {
        title = "Web Design Portfolio Montreal | High-Converting Websites Showcase";
        description = "Explore our portfolio of high-converting websites designed by YS Marketing Solutions in Montreal. See how we help local businesses scale.";
      }
    } else {
      // Home
      if (isFrench) {
        title = "Conception de Sites Web Montréal | YS Marketing Solutions | SEO";
        description = "Agence de conception web et SEO à Montréal. YS Marketing Solutions crée des sites web haute performance pour convertir vos visiteurs locaux en clients.";
      } else {
        title = "Web Design Montreal | YS Marketing Solutions | SEO & Web Development";
        description = "Premium web design and SEO agency in Montreal. YS Marketing Solutions builds high-performance websites and strategic marketing to scale your local business.";
      }
    }

    // Update document title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical);

    // Update html lang
    document.documentElement.lang = language;

    // Clean up old hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

    // Generate dynamic hreflangs
    const basePath = isPortfolio ? '/portfolio' : '';
    const hreflangs = [
      { lang: 'en-ca', href: `https://www.ysdev.ca${basePath}` || 'https://www.ysdev.ca/' },
      { lang: 'fr-ca', href: `https://www.ysdev.ca/fr${basePath}` },
      { lang: 'x-default', href: `https://www.ysdev.ca${basePath}` || 'https://www.ysdev.ca/' }
    ];

    hreflangs.forEach((cfg) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', cfg.lang);
      link.setAttribute('href', cfg.href);
      document.head.appendChild(link);
    });

  }, [location.pathname, language]);

  return null;
}
