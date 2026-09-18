import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const WEBHOOK_URL = 'https://hook.us2.make.com/9z1ldu1b99eooozbpe3a4u99p5b19ji2';
const REQUEST_TIMEOUT_MS = 10000;
const TOTAL_STEPS = 3;

// ─── Step option data ─────────────────────────────────────────────────────────

const STEP1_OPTIONS = [
  { value: 'Website Development', label: 'Website Development', icon: '🌐' },
  { value: 'Google Business',     label: 'Google Business',     icon: '🔍' },
  { value: 'Meta Ads',            label: 'Meta Ads',            icon: '🎯' },
  { value: 'Something Else',      label: 'Something Else',      icon: '💬' },
];

// ─── Analytics ────────────────────────────────────────────────────────────────

function pushEvent(event: string, extra?: Record<string, string>) {
  try {
    const dl = (window as unknown as { dataLayer?: object[] }).dataLayer;
    if (Array.isArray(dl)) dl.push({ event, ...extra });
  } catch { /* analytics must never break the form */ }
}

// ─── Slide variants — transform + opacity only (compositor) ──────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as number[] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] as number[] },
  }),
};

// ─── Step dot indicator ───────────────────────────────────────────────────────

function StepDots({ step }: { step: number }) {
  const { t } = useLanguage();
  // Dot colours inspired by the screenshot: brand-red for active, green for done
  const dotColor = (i: number) => {
    if (i + 1 < step)  return '#22c55e'; // completed → green
    if (i + 1 === step) return '#E11D2E'; // current    → brand red
    return '#E4E4E7';                     // upcoming   → light grey
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      {/* Small eyebrow — exact text from screenshot */}
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
        {t.contact.leadFlow.oneQuestion}
      </p>

      {/* Step counter */}
      <p className="text-[11px] font-semibold text-zinc-400">
        {t.contact.leadFlow.stepCounter} {step} {t.contact.leadFlow.stepOf} {TOTAL_STEPS}
      </p>

      {/* Dots */}
      <div className="flex items-center gap-2 mt-0.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <motion.span
            key={i}
            animate={{
              backgroundColor: dotColor(i),
              width: i + 1 === step ? 20 : 8,
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="block h-2 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

// ─── Tappable option button ───────────────────────────────────────────────────

interface OptionBtnProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function OptionBtn({ icon, label, selected, onClick }: OptionBtnProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      style={{ transition: 'border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease' }}
      className={[
        'w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl border-2 text-left font-semibold text-sm cursor-pointer min-h-[52px]',
        selected
          ? 'border-brand-red bg-brand-red-light text-brand-red shadow-[0_0_0_3px_rgba(225,29,46,0.10)]'
          : 'border-zinc-200 bg-white text-ink hover:border-zinc-300 hover:bg-zinc-50/80',
      ].join(' ')}
    >
      <span className="text-lg leading-none shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {selected && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-5 h-5 rounded-full bg-brand-red flex items-center justify-center shrink-0"
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
          </svg>
        </motion.span>
      )}
    </motion.button>
  );
}

// ─── Lead data shape ──────────────────────────────────────────────────────────

interface LeadData {
  serviceType:      string;
  serviceTypeOther: string;
  businessName:     string;
  name:             string;
  email:            string;
  phone:            string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

// ─── Main component ───────────────────────────────────────────────────────────

export default function LeadFlowForm() {
  const { t, language } = useLanguage();
  const [step,      setStep]      = useState(1);
  const [direction, setDirection] = useState(1);  // 1 = forward, -1 = back

  const [lead, setLead] = useState<LeadData>({
    serviceType: '', serviceTypeOther: '', businessName: '',
    name: '', email: '', phone: '',
  });

  const [errors,  setErrors]  = useState<Partial<Record<keyof LeadData, string>>>({});
  const [status,  setStatus]  = useState<SubmitStatus>('idle');
  const [errMsg,  setErrMsg]  = useState('');

  const isSubmittingRef  = useRef(false);
  const partialFiredRef  = useRef(false);
  const mountTimeRef     = useRef(Date.now());
  const finalStepEnterTimeRef = useRef<number | null>(null);
  const honeypotRef      = useRef<HTMLInputElement>(null);
  const visibilityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track final (contact) step entry time
  useEffect(() => {
    if (step === TOTAL_STEPS) {
      finalStepEnterTimeRef.current = Date.now();
    } else {
      finalStepEnterTimeRef.current = null;
    }
  }, [step]);

  // ── Navigation ────────────────────────────────────────────────────────────

  const goForward = useCallback((n: number) => { setDirection(1);  setStep(n); }, []);
  const goBack    = useCallback(()           => { setDirection(-1); setStep(s => s - 1); }, []);

  const firePartialLead = useCallback(() => {
    if (partialFiredRef.current || !lead.serviceType || status === 'success') return;
    
    // Honeypot check
    if (honeypotRef.current?.value) return;

    // Must be on the final step for at least 3 seconds before any partial can fire
    if (!finalStepEnterTimeRef.current || (Date.now() - finalStepEnterTimeRef.current) < 3000) return;

    partialFiredRef.current = true;
    try {
      const finalServiceType = lead.serviceType === 'Something Else'
        ? (lead.serviceTypeOther || 'Something Else')
        : lead.serviceType;

      const isSuspectedBot = (Date.now() - mountTimeRef.current) < 3000;
      const tags = ['partial_lead'];
      if (isSuspectedBot) {
        tags.push('suspected_bot');
      }

      fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId:  crypto.randomUUID(),
          submittedAt:   new Date().toISOString(),
          // ── Make.com / Twilio template aliases ──────────────────────────
          name:          lead.name.trim() || '(not yet provided)',
          email:         lead.email.trim() || '(not yet provided)',
          phone:         lead.phone.trim() || '(not yet provided)',
          companyName:   lead.businessName.trim() || '(not yet provided)', // {{1.companyName}}
          company_name:  lead.businessName.trim() || '(not yet provided)',
          website:       '',               // {{1.website}} — field removed from form
          service:       finalServiceType, // {{1.service}}
          // ── New fields ───────────────────────────────────────────────────
          serviceType:   finalServiceType,
          businessName:  lead.businessName.trim(),
          // ── Meta ─────────────────────────────────────────────────────────
          source:        'Website Lead Flow',
          form_name:     'Lead Flow — PARTIAL (abandoned at contact step)',
          isPartial:     true,
          tags,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch { /* silently skip */ }
  }, [lead, status]);

  useEffect(() => {
    if (step < TOTAL_STEPS) return;

    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        if (visibilityTimerRef.current) clearTimeout(visibilityTimerRef.current);
        visibilityTimerRef.current = setTimeout(() => {
          if (document.visibilityState === 'hidden') {
            firePartialLead();
          }
        }, 2000);
      } else {
        if (visibilityTimerRef.current) {
          clearTimeout(visibilityTimerRef.current);
          visibilityTimerRef.current = null;
        }
      }
    };

    const onBeforeUnload = () => {
      firePartialLead();
    };

    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onBeforeUnload);
      if (visibilityTimerRef.current) clearTimeout(visibilityTimerRef.current);
    };
  }, [step, firePartialLead]);

  // ── Step handlers ─────────────────────────────────────────────────────────

  const onStep1 = (v: string) => {
    setLead(l => ({ ...l, serviceType: v }));
    if (v !== 'Something Else') {
      pushEvent('leadflow_step_1', { service_type: v });
      goForward(2);
    }
  };

  const onStep1OtherNext = () => {
    const val = lead.serviceTypeOther.trim();
    if (!val) { 
      setErrors(e => ({ 
        ...e, 
        serviceTypeOther: language === 'fr' ? 'Veuillez préciser votre besoin.' : 'Please tell us what you need.' 
      })); 
      return; 
    }
    pushEvent('leadflow_step_1', { service_type: `Something Else: ${val}` });
    goForward(2);
  };

  const onStep2Next = () => {
    const val = lead.businessName.trim();
    if (!val) { 
      setErrors(e => ({ 
        ...e, 
        businessName: language === 'fr' ? 'Veuillez entrer le nom de votre entreprise.' : 'Please enter your business name.' 
      })); 
      return; 
    }
    pushEvent('leadflow_step_2', { business_name: val });
    goForward(3);
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errs: Partial<Record<keyof LeadData, string>> = {};
    if (!lead.name.trim()) errs.name = language === 'fr' ? 'Veuillez entrer votre nom.' : 'Please enter your name.';
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim());
    const phoneOk = /^[\d\s\-()+]{7,}$/.test(lead.phone.trim());
    if (!emailOk && !phoneOk) errs.email = language === 'fr' ? 'Entrez un courriel ou un numéro de téléphone valide.' : 'Enter a valid email or phone number.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || status === 'submitting') return;

    // Honeypot check
    if (honeypotRef.current?.value) {
      partialFiredRef.current = true;
      setStatus('success');
      return;
    }

    if (!validate()) return;

    isSubmittingRef.current = true;
    setErrMsg(''); setStatus('submitting');

    const ctrl     = new AbortController();
    const tId      = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    const firstName = lead.name.trim().split(' ')[0] ?? '';
    const lastName  = lead.name.trim().split(' ').slice(1).join(' ');
    const finalServiceType = lead.serviceType === 'Something Else'
      ? (lead.serviceTypeOther.trim() || 'Something Else')
      : lead.serviceType;

    const isSuspectedBot = (Date.now() - mountTimeRef.current) < 3000;
    const tags = ['lead-flow'];
    if (isSuspectedBot) {
      tags.push('suspected_bot');
    }

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST', mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId:  crypto.randomUUID(),
          submittedAt:   new Date().toISOString(),
          // ── Make.com / Twilio template fields ───────────────────────────
          name:          lead.name.trim(),       // {{1.name}}
          email:         lead.email.trim(),      // {{1.email}}
          phone:         lead.phone.trim(),      // {{1.phone}}
          companyName:   lead.businessName.trim(), // {{1.companyName}}
          company_name:  lead.businessName.trim(),
          website:       '',                     // {{1.website}} — removed from form
          service:       finalServiceType,       // {{1.service}}
          // ── First / last name aliases (GHL / CRM) ──────────────────────
          first_name: firstName, firstName,
          last_name:  lastName,  lastName,
          // ── New multi-step fields ────────────────────────────────────────
          serviceType:   finalServiceType,
          businessName:  lead.businessName.trim(),
          // ── Meta ─────────────────────────────────────────────────────────
          source:        'Website Lead Flow',
          form_name:     'Lead Flow Form',
          isPartial:     false,
          tags,
        }),
        signal: ctrl.signal,
        keepalive: true,
      });

      if (!res.ok) throw new Error(`Webhook responded with ${res.status}`);

      pushEvent('leadflow_submit', {
        service_type: finalServiceType,
        business_name: lead.businessName.trim(),
      });

      partialFiredRef.current = true;
      setStatus('success');
    } catch (err) {
      console.error('LeadFlow submit error:', err);
      setErrMsg(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 6000);
    } finally {
      clearTimeout(tId);
      isSubmittingRef.current = false;
    }
  };

  // ── Step renderers ────────────────────────────────────────────────────────

  const renderStep = () => {
    const step1Options = [
      { value: 'Website Development', label: t.contact.leadFlow.options.webDev, icon: '🌐' },
      { value: 'Google Business',     label: t.contact.leadFlow.options.googleBiz, icon: '🔍' },
      { value: 'Meta Ads',            label: t.contact.leadFlow.options.metaAds, icon: '🎯' },
      { value: 'Something Else',      label: t.contact.leadFlow.options.somethingElse, icon: '💬' },
    ];

    switch (step) {

      // ── STEP 1 ────────────────────────────────────────────────────────────
      case 1:
        return (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-2xl font-extrabold text-ink text-center mb-1 leading-snug">
              {t.contact.leadFlow.step1Title}
            </h3>
            <p className="text-sm text-muted text-center mb-3">
              {t.contact.leadFlow.step1Subtitle}
            </p>
            {step1Options.map(o => (
              <OptionBtn
                key={o.value}
                icon={o.icon}
                label={o.label}
                selected={lead.serviceType === o.value}
                onClick={() => onStep1(o.value)}
              />
            ))}
            {/* Something Else text input */}
            <AnimatePresence>
              {lead.serviceType === 'Something Else' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2 mt-1"
                >
                  <input
                    autoFocus
                    type="text"
                    value={lead.serviceTypeOther}
                    onChange={e => {
                      setLead(l => ({ ...l, serviceTypeOther: e.target.value }));
                      setErrors(er => ({ ...er, serviceTypeOther: undefined }));
                    }}
                    onKeyDown={e => e.key === 'Enter' && onStep1OtherNext()}
                    placeholder={t.contact.leadFlow.step1OtherPlaceholder}
                    className="w-full bg-zinc-50 border border-zinc-200 text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:border-brand-red focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,46,0.10)] transition-all duration-200 text-sm"
                  />
                  {errors.serviceTypeOther && (
                    <p className="text-xs text-brand-red">{errors.serviceTypeOther}</p>
                  )}
                  <button
                    type="button"
                    onClick={onStep1OtherNext}
                    className="w-full bg-gradient-to-r from-[#E11D2E] via-[#D11220] to-[#B3121F] hover:shadow-[0_0_25px_rgba(225,29,46,0.6)] active:scale-98 text-white font-bold py-3.5 rounded-full transition-all duration-200 text-sm cursor-pointer"
                  >
                    {t.contact.leadFlow.continue}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      // ── STEP 2 ────────────────────────────────────────────────────────────
      case 2:
        return (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-2xl font-extrabold text-ink text-center mb-1 leading-snug">
              {t.contact.leadFlow.step2Title}
            </h3>
            <p className="text-sm text-muted text-center mb-3">
              {t.contact.leadFlow.step2Subtitle}
            </p>
            <input
              autoFocus
              id="lf-business-name"
              type="text"
              autoComplete="organization"
              value={lead.businessName}
              onChange={e => {
                setLead(l => ({ ...l, businessName: e.target.value }));
                setErrors(er => ({ ...er, businessName: undefined }));
              }}
              onKeyDown={e => e.key === 'Enter' && onStep2Next()}
              placeholder={t.contact.leadFlow.step2Placeholder}
              className={[
                'w-full bg-zinc-50 border text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:bg-white transition-all duration-200 text-sm',
                errors.businessName
                  ? 'border-brand-red focus:border-brand-red focus:shadow-[0_0_20px_rgba(225,29,46,0.10)]'
                  : 'border-zinc-200 focus:border-brand-red focus:shadow-[0_0_20px_rgba(225,29,46,0.10)]',
              ].join(' ')}
            />
            {errors.businessName && (
              <p className="text-xs text-brand-red">{errors.businessName}</p>
            )}
            <button
              type="button"
              onClick={onStep2Next}
              className="w-full bg-gradient-to-r from-[#E11D2E] via-[#D11220] to-[#B3121F] hover:shadow-[0_0_25px_rgba(225,29,46,0.6)] active:scale-98 text-white font-bold py-3.5 rounded-full transition-all duration-200 text-sm cursor-pointer mt-1"
            >
              {t.contact.leadFlow.continue}
            </button>
          </div>
        );

      // ── STEP 3 ────────────────────────────────────────────────────────────
      case 3:
        if (status === 'success') {
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center py-6 gap-5"
            >
              <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-ink mb-2">{t.contact.leadFlow.successTitle}</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
                  {t.contact.leadFlow.successSubtitle}
                </p>
              </div>
              <div className="w-full bg-zinc-50 rounded-2xl border border-zinc-200 px-5 py-4 text-left">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1">{t.contact.leadFlow.yourRequest}</p>
                <p className="text-sm font-semibold text-ink">
                  {lead.serviceType === 'Something Else' ? (lead.serviceTypeOther || 'Something Else') : lead.serviceType} · {lead.businessName}
                </p>
              </div>
            </motion.div>
          );
        }

        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Honeypot field for bot protection */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
              <input
                ref={honeypotRef}
                type="text"
                name="lf-website-verify"
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            <div className="text-center mb-1">
              <h3 className="text-2xl font-extrabold text-ink leading-snug">
                {t.contact.leadFlow.step3Title}
              </h3>
              <p className="text-sm text-muted mt-1">{t.contact.leadFlow.step3Subtitle}</p>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lf-name" className="text-xs font-bold uppercase tracking-wider text-muted">
                {t.contact.leadFlow.nameLabel}
              </label>
              <input
                id="lf-name"
                type="text"
                autoComplete="name"
                value={lead.name}
                onChange={e => {
                  setLead(l => ({ ...l, name: e.target.value }));
                  setErrors(er => ({ ...er, name: undefined }));
                }}
                placeholder={t.contact.leadFlow.namePlaceholder}
                className={[
                  'w-full bg-zinc-50 border text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:bg-white transition-all duration-200 text-sm',
                  errors.name
                    ? 'border-brand-red focus:border-brand-red focus:shadow-[0_0_20px_rgba(225,29,46,0.10)]'
                    : 'border-zinc-200 focus:border-brand-red focus:shadow-[0_0_20px_rgba(225,29,46,0.10)]',
                ].join(' ')}
              />
              {errors.name && <p className="text-xs text-brand-red">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lf-phone" className="text-xs font-bold uppercase tracking-wider text-muted">
                {t.contact.leadFlow.phoneLabel}
              </label>
              <input
                id="lf-phone"
                type="tel"
                autoComplete="tel"
                value={lead.phone}
                onChange={e => {
                  setLead(l => ({ ...l, phone: e.target.value }));
                  setErrors(er => ({ ...er, email: undefined }));
                }}
                placeholder={t.contact.leadFlow.phonePlaceholder}
                className="w-full bg-zinc-50 border border-zinc-200 text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:border-brand-red focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,46,0.10)] transition-all duration-200 text-sm"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lf-email" className="text-xs font-bold uppercase tracking-wider text-muted">
                {t.contact.leadFlow.emailLabel}{' '}
                <span className="text-zinc-400 normal-case font-normal tracking-normal">
                  {language === 'fr' ? '(ou téléphone ci-dessus)' : '(or phone above)'}
                </span>
              </label>
              <input
                id="lf-email"
                type="email"
                autoComplete="email"
                value={lead.email}
                onChange={e => {
                  setLead(l => ({ ...l, email: e.target.value }));
                  setErrors(er => ({ ...er, email: undefined }));
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); handleSubmit(e as unknown as React.FormEvent); }
                }}
                placeholder={t.contact.leadFlow.emailPlaceholder}
                className={[
                  'w-full bg-zinc-50 border text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:bg-white transition-all duration-200 text-sm',
                  errors.email
                    ? 'border-brand-red focus:border-brand-red focus:shadow-[0_0_20px_rgba(225,29,46,0.10)]'
                    : 'border-zinc-200 focus:border-brand-red focus:shadow-[0_0_20px_rgba(225,29,46,0.10)]',
                ].join(' ')}
              />
              {errors.email && <p className="text-xs text-brand-red">{errors.email}</p>}
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full font-bold py-4 rounded-full text-base flex items-center justify-center gap-2 cursor-pointer mt-1 bg-gradient-to-r from-[#E11D2E] via-[#D11220] to-[#B3121F] hover:shadow-[0_0_30px_rgba(225,29,46,0.6)] active:scale-98 text-white shadow-lg shadow-brand-red/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cta-pulse border border-white/20 tap-target-min"
            >
              {status === 'submitting' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {t.contact.leadFlow.submitting}</>
              ) : (
                <>{t.contact.leadFlow.submitBtn} →</>
              )}
            </button>

            {status === 'error' && errMsg && (
              <p className="text-xs text-brand-red text-center leading-relaxed">{errMsg}</p>
            )}

            <p className="text-[11px] text-center text-zinc-400 leading-relaxed">
              {language === 'fr' ? '🔒 Aucun pourriel. Nous ne vous contacterons que pour votre projet.' : "🔒 No spam, ever. We'll only reach out about your project."}
            </p>
          </form>
        );

      default:
        return null;
    }
  };

  // ── Shell ─────────────────────────────────────────────────────────────────

  return (
    /*
     * Fixed min-height so the card never resizes between steps — no layout shift.
     * The card is always the same height; step content scrolls internally on very small screens.
     */
    <div
      className="relative bg-white border border-zinc-100 rounded-[32px] shadow-xl overflow-hidden"
      style={{ minHeight: 500 }}
    >
      {/* Decorative top-right red glow — static, no animation */}
      <div
        aria-hidden="true"
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(225,29,46,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 px-7 pt-8 pb-8 md:px-10 md:pt-10 md:pb-10">

        {/* Step header — always visible unless success */}
        {status !== 'success' && <StepDots step={step} />}

        {/* Back button — steps 2+ */}
        {step > 1 && status !== 'success' && (
          <motion.button
            type="button"
            onClick={goBack}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -2 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 text-muted text-sm font-semibold mb-5 cursor-pointer hover:text-ink transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            {language === 'fr' ? 'Retour' : 'Back'}
          </motion.button>
        )}

        {/* Animated step content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`step-${step}-${status}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
