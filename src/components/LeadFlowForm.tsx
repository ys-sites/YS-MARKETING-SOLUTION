import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const WEBHOOK_URL = 'https://hook.us2.make.com/9z1ldu1b99eooozbpe3a4u99p5b19ji2';
const REQUEST_TIMEOUT_MS = 10000;
const TOTAL_STEPS = 4;

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEP1_OPTIONS = [
  { value: 'New Website',       label: 'New Website',        emoji: '🚀' },
  { value: 'Website Redesign',  label: 'Website Redesign',   emoji: '✏️' },
  { value: 'SEO & Marketing',   label: 'SEO & Marketing',    emoji: '📈' },
  { value: 'Something Else',    label: 'Something Else',     emoji: '💬' },
];

const STEP2_OPTIONS = [
  { value: 'Restaurant',         label: 'Restaurant',          emoji: '🍽️' },
  { value: 'Food & Drink',       label: 'Food & Drink',        emoji: '☕' },
  { value: 'Trades & Services',  label: 'Trades & Services',   emoji: '🔧' },
  { value: 'E-commerce',         label: 'E-commerce',          emoji: '🛒' },
  { value: 'Other',              label: 'Other',               emoji: '🏢' },
];

const STEP3_OPTIONS = [
  { value: 'ASAP',            label: 'ASAP',             emoji: '⚡' },
  { value: 'Within a month',  label: 'Within a month',   emoji: '📅' },
  { value: '1–3 months',      label: '1–3 months',       emoji: '🗓️' },
  { value: 'Just exploring',  label: 'Just exploring',   emoji: '👀' },
];

// ─── Analytics helper ─────────────────────────────────────────────────────────

function pushEvent(event: string, extra?: Record<string, string>) {
  try {
    const dl = (window as unknown as { dataLayer?: object[] }).dataLayer;
    if (Array.isArray(dl)) {
      dl.push({ event, ...extra });
    }
  } catch {
    // fail silently — analytics must never break the form
  }
}

// ─── Slide animation variants ─────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as number[] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.22, ease: [0.7, 0, 0.84, 0] as number[] },
  }),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400">
        STEP {step} OF {TOTAL_STEPS}
      </p>
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <motion.span
            key={i}
            animate={{
              width: i + 1 === step ? 24 : 8,
              backgroundColor: i + 1 <= step ? '#E11D2E' : '#E4E4E7',
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="block h-2 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

interface OptionButtonProps {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function OptionButton({ emoji, label, selected, onClick }: OptionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={[
        'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left font-semibold text-sm transition-all duration-250 cursor-pointer',
        'min-h-[56px]',
        selected
          ? 'border-brand-red bg-brand-red-light text-brand-red shadow-[0_0_0_3px_rgba(225,29,46,0.12)]'
          : 'border-zinc-200 bg-white text-ink hover:border-brand-red/40 hover:bg-zinc-50',
      ].join(' ')}
      style={{ transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease' }}
    >
      <span className="text-xl leading-none shrink-0">{emoji}</span>
      <span className="flex-1">{label}</span>
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 rounded-full bg-brand-red flex items-center justify-center shrink-0"
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.span>
      )}
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface LeadData {
  serviceType: string;
  businessType: string;
  businessTypeOther: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function LeadFlowForm() {
  const [step, setStep]           = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [lead, setLead]           = useState<LeadData>({
    serviceType: '',
    businessType: '',
    businessTypeOther: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors]       = useState<Partial<Record<keyof LeadData, string>>>({});
  const [status, setStatus]       = useState<SubmitStatus>('idle');
  const [errMsg, setErrMsg]       = useState('');
  const isSubmittingRef           = useRef(false);
  const partialFiredRef           = useRef(false);

  // ── Navigation helpers ──

  const goForward = useCallback((newStep: number) => {
    setDirection(1);
    setStep(newStep);
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => s - 1);
  }, []);

  // ── Partial-lead fire ──

  const firePartialLead = useCallback(() => {
    if (partialFiredRef.current) return;
    if (!lead.serviceType) return; // nothing to send
    if (status === 'success') return; // already submitted
    partialFiredRef.current = true;

    const payload = {
      submissionId: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      serviceType: lead.serviceType,
      businessType: lead.businessType === 'Other' ? (lead.businessTypeOther || 'Other') : lead.businessType,
      timeline: lead.timeline,
      source: 'Website Lead Flow',
      form_name: 'Lead Flow Form',
      tags: ['partial_lead'],
    };

    // keepalive so it survives page unload
    try {
      navigator.sendBeacon(WEBHOOK_URL, JSON.stringify(payload));
    } catch {
      // silently skip if unsupported
    }
  }, [lead, status]);

  // Fire partial on tab-close / visibility-hide — only if at step 4
  React.useEffect(() => {
    if (step < 4) return;
    const handleHide = () => { if (document.visibilityState === 'hidden') firePartialLead(); };
    document.addEventListener('visibilitychange', handleHide);
    window.addEventListener('beforeunload', firePartialLead);
    return () => {
      document.removeEventListener('visibilitychange', handleHide);
      window.removeEventListener('beforeunload', firePartialLead);
    };
  }, [step, firePartialLead]);

  // ── Step 1 ──

  const handleStep1Select = (value: string) => {
    setLead((l) => ({ ...l, serviceType: value }));
    pushEvent('leadflow_step_1', { service_type: value });
    goForward(2);
  };

  // ── Step 2 ──

  const handleStep2Select = (value: string) => {
    setLead((l) => ({ ...l, businessType: value }));
    if (value !== 'Other') {
      pushEvent('leadflow_step_2', { business_type: value });
      goForward(3);
    }
  };

  const handleStep2OtherNext = () => {
    const val = lead.businessTypeOther.trim();
    if (!val) {
      setErrors((e) => ({ ...e, businessTypeOther: 'Please describe your business.' }));
      return;
    }
    pushEvent('leadflow_step_2', { business_type: `Other: ${val}` });
    goForward(3);
  };

  // ── Step 3 ──

  const handleStep3Select = (value: string) => {
    setLead((l) => ({ ...l, timeline: value }));
    pushEvent('leadflow_step_3', { timeline: value });
    goForward(4);
  };

  // ── Step 4 validation ──

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadData, string>> = {};
    if (!lead.name.trim()) newErrors.name = 'Please enter your name.';
    const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim());
    const hasPhone = /^[\d\s\-()+]{7,}$/.test(lead.phone.trim());
    if (!hasEmail && !hasPhone) {
      newErrors.email = 'Please enter a valid email or phone number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || status === 'submitting') return;
    if (!validate()) return;

    isSubmittingRef.current = true;
    setErrMsg('');
    setStatus('submitting');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const firstName = lead.name.trim().split(' ')[0] || '';
      const lastName  = lead.name.trim().split(' ').slice(1).join(' ');
      const resolvedBusiness = lead.businessType === 'Other'
        ? (lead.businessTypeOther.trim() || 'Other')
        : lead.businessType;

      const payload = {
        submissionId: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
        name: lead.name.trim(),
        first_name: firstName,
        firstName,
        last_name: lastName,
        lastName,
        email: lead.email.trim(),
        phone: lead.phone.trim(),
        serviceType: lead.serviceType,
        businessType: resolvedBusiness,
        timeline: lead.timeline,
        // legacy field aliases kept for existing GHL mapping
        service: lead.serviceType,
        source: 'Website Lead Flow',
        form_name: 'Lead Flow Form',
        tags: ['lead-flow'],
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
        keepalive: true,
      });

      if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);

      pushEvent('leadflow_submit', {
        service_type: lead.serviceType,
        business_type: resolvedBusiness,
        timeline: lead.timeline,
      });

      partialFiredRef.current = true; // prevent double-fire on unload
      setStatus('success');
    } catch (err) {
      console.error('LeadFlow submit error:', err);
      setErrMsg(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 6000);
    } finally {
      clearTimeout(timeoutId);
      isSubmittingRef.current = false;
    }
  };

  // ─── Render helpers ────────────────────────────────────────────────────────

  const renderStep = () => {
    switch (step) {
      // ── STEP 1 ──────────────────────────────────────────────────────────
      case 1:
        return (
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-extrabold text-ink mb-1">What do you need?</h3>
            <p className="text-sm text-muted mb-3">Pick one — we'll tailor everything from here.</p>
            {STEP1_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                selected={lead.serviceType === opt.value}
                onClick={() => handleStep1Select(opt.value)}
              />
            ))}
          </div>
        );

      // ── STEP 2 ──────────────────────────────────────────────────────────
      case 2:
        return (
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-extrabold text-ink mb-1">What's your business?</h3>
            <p className="text-sm text-muted mb-3">Helps us send the right proposal.</p>
            {STEP2_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                selected={lead.businessType === opt.value}
                onClick={() => handleStep2Select(opt.value)}
              />
            ))}
            {lead.businessType === 'Other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 flex flex-col gap-2"
              >
                <input
                  type="text"
                  autoFocus
                  value={lead.businessTypeOther}
                  onChange={(e) => {
                    setLead((l) => ({ ...l, businessTypeOther: e.target.value }));
                    setErrors((er) => ({ ...er, businessTypeOther: undefined }));
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleStep2OtherNext()}
                  placeholder="Tell us a bit about your business…"
                  className="w-full bg-zinc-50 border border-zinc-200 text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:border-brand-red focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,46,0.1)] transition-all duration-200 text-sm"
                />
                {errors.businessTypeOther && (
                  <p className="text-xs text-brand-red">{errors.businessTypeOther}</p>
                )}
                <button
                  type="button"
                  onClick={handleStep2OtherNext}
                  className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3.5 rounded-full transition-all duration-200 text-sm cursor-pointer"
                >
                  Continue →
                </button>
              </motion.div>
            )}
          </div>
        );

      // ── STEP 3 ──────────────────────────────────────────────────────────
      case 3:
        return (
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-extrabold text-ink mb-1">When do you want to launch?</h3>
            <p className="text-sm text-muted mb-3">No pressure — just helps us prioritise.</p>
            {STEP3_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                selected={lead.timeline === opt.value}
                onClick={() => handleStep3Select(opt.value)}
              />
            ))}
          </div>
        );

      // ── STEP 4 ──────────────────────────────────────────────────────────
      case 4:
        if (status === 'success') {
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center py-8 gap-5"
            >
              <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-ink mb-2">You're all set! 🎉</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
                  We received your request. We'll text you within a few hours with your free quote.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <div className="flex items-center gap-3 bg-zinc-50 rounded-2xl px-4 py-3 border border-zinc-200">
                  <span className="text-base">📋</span>
                  <div className="text-left">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Your request</p>
                    <p className="text-sm font-semibold text-ink">{lead.serviceType} · {lead.timeline}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }

        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-ink mb-1">Last step — how do we reach you?</h3>
              <p className="text-sm text-muted mb-4">We'll send your free quote here.</p>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lf-name" className="text-xs font-bold uppercase tracking-wider text-muted">
                Your Name
              </label>
              <input
                id="lf-name"
                type="text"
                autoComplete="name"
                value={lead.name}
                onChange={(e) => {
                  setLead((l) => ({ ...l, name: e.target.value }));
                  setErrors((er) => ({ ...er, name: undefined }));
                }}
                placeholder="John Doe"
                className={[
                  'w-full bg-zinc-50 border text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:bg-white transition-all duration-200 text-sm',
                  errors.name
                    ? 'border-brand-red focus:border-brand-red focus:shadow-[0_0_20px_rgba(225,29,46,0.1)]'
                    : 'border-zinc-200 focus:border-brand-red focus:shadow-[0_0_20px_rgba(225,29,46,0.1)]',
                ].join(' ')}
              />
              {errors.name && <p className="text-xs text-brand-red">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lf-phone" className="text-xs font-bold uppercase tracking-wider text-muted">
                Phone Number
              </label>
              <input
                id="lf-phone"
                type="tel"
                autoComplete="tel"
                value={lead.phone}
                onChange={(e) => {
                  setLead((l) => ({ ...l, phone: e.target.value }));
                  setErrors((er) => ({ ...er, email: undefined }));
                }}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-zinc-50 border border-zinc-200 text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:border-brand-red focus:bg-white focus:shadow-[0_0_20px_rgba(225,29,46,0.1)] transition-all duration-200 text-sm"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lf-email" className="text-xs font-bold uppercase tracking-wider text-muted">
                Email <span className="text-zinc-400 lowercase font-normal tracking-normal">(or phone above)</span>
              </label>
              <input
                id="lf-email"
                type="email"
                autoComplete="email"
                value={lead.email}
                onChange={(e) => {
                  setLead((l) => ({ ...l, email: e.target.value }));
                  setErrors((er) => ({ ...er, email: undefined }));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                placeholder="john@company.com"
                className={[
                  'w-full bg-zinc-50 border text-ink rounded-xl px-5 py-3.5 focus:outline-none focus:bg-white transition-all duration-200 text-sm',
                  errors.email
                    ? 'border-brand-red focus:border-brand-red focus:shadow-[0_0_20px_rgba(225,29,46,0.1)]'
                    : 'border-zinc-200 focus:border-brand-red focus:shadow-[0_0_20px_rgba(225,29,46,0.1)]',
                ].join(' ')}
              />
              {errors.email && <p className="text-xs text-brand-red">{errors.email}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className={[
                'w-full font-bold py-4 rounded-full text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-1',
                status === 'error'
                  ? 'bg-brand-red text-white shadow-lg'
                  : 'bg-brand-red hover:bg-brand-red-dark text-white shadow-lg shadow-brand-red/10 hover:shadow-brand-red/30 hover:-translate-y-0.5',
                'disabled:opacity-70 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending…
                </>
              ) : status === 'error' ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Try again
                </>
              ) : (
                'Get My Free Quote →'
              )}
            </button>

            {status === 'error' && errMsg && (
              <p className="text-xs text-brand-red text-center leading-relaxed">{errMsg}</p>
            )}

            <p className="text-[11px] text-center text-zinc-400 leading-relaxed">
              🔒 No spam, ever. We'll only reach out about your project.
            </p>
          </form>
        );

      default:
        return null;
    }
  };

  // ─── Outer shell ──────────────────────────────────────────────────────────

  return (
    <div
      className="relative bg-white border border-zinc-200 rounded-[40px] shadow-lg overflow-hidden"
      style={{ minHeight: 520 }}
    >
      {/* Subtle red glow in top-right corner */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-red-light/40 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 p-8 md:p-10">
        {/* Progress */}
        {status !== 'success' && <ProgressBar step={step} />}

        {/* Back button */}
        {step > 1 && status !== 'success' && (
          <motion.button
            type="button"
            onClick={goBack}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            whileHover={{ x: -2 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-muted text-sm font-semibold mb-5 cursor-pointer hover:text-ink transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </motion.button>
        )}

        {/* Step content — slides in/out */}
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
