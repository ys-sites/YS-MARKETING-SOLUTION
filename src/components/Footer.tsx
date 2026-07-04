import React from 'react';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const quickLinks = [
    { name: t.nav.services, href: '#services' },
    { name: t.nav.portfolio, href: '#portfolio' },
    { name: t.nav.testimonials, href: '#testimonials' },
  ];

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1.5fr] gap-12 mb-16">

          {/* Col 1: Logo + Name + Social */}
          <div className="flex flex-col gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity self-start"
            >
              {/* Logo asset in a padded circle */}
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center p-2 backdrop-blur-sm shrink-0">
                <img src="/YS.png" alt="YS Marketing Solutions" className="h-full w-auto object-contain" />
              </div>
              <span className="text-sm md:text-base font-black tracking-wider text-white uppercase whitespace-nowrap">YS Marketing Solutions</span>
            </button>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/ys.sites/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-brand-red hover:border-brand-red/35 hover:shadow-sm transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wider">{t.footer.quickLinksTitle}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-brand-red transition-colors duration-200 text-sm font-semibold"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wider">{t.footer.contactTitle}</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:4384048385"
                  className="flex items-center gap-3 text-zinc-400 hover:text-brand-red transition-all duration-200 text-sm font-semibold"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-brand-red">
                    <Phone className="w-4 h-4 shrink-0" />
                  </div>
                  438-404-8385
                </a>
              </li>
              <li>
                <a
                  href="mailto:cloud@ysdev.ca"
                  className="flex items-center gap-3 text-zinc-400 hover:text-brand-red transition-all duration-200 text-sm font-semibold"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-brand-red">
                    <Mail className="w-4 h-4 shrink-0" />
                  </div>
                  cloud@ysdev.ca
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3 text-zinc-400 text-sm font-semibold">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
                    <MapPin className="w-4 h-4 shrink-0" />
                  </div>
                  {t.footer.location}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-zinc-900 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs tracking-wide">
            © {new Date().getFullYear()} YS Marketing Solutions. {t.footer.rights}
          </p>
          <p className="text-zinc-600 text-[10px] tracking-wide">
            {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
