import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const WHATSAPP_LINK = 'https://wa.me/message/O4RDTWJDWFEDG1';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 4C13.0 4 4 13.0 4 24c0 3.6 1.0 7.0 2.7 9.9L4 44l10.4-2.7C17.1 42.9 20.5 44 24 44c11.0 0 20-9.0 20-20S35.0 4 24 4Zm0 36.4c-3.2 0-6.2-.9-8.8-2.4l-.6-.4-7.0 1.6 1.6-6.8-.4-.6C7.1 29.6 6.2 26.9 6.2 24c0-9.8 8-17.8 17.8-17.8S41.8 14.2 41.8 24 33.8 40.4 24 40.4Zm9.8-13.3c-.5-.3-3.1-1.5-3.6-1.7-.5-.2-.8-.3-1.2.3-.4.5-1.4 1.7-1.7 2.1-.3.4-.6.4-1.1.1-3-1.5-5-2.7-7-6.1-.5-.9.5-.8 1.5-2.8.2-.4.1-.7-.1-1l-1.7-4.1c-.4-1.1-.9-.9-1.2-.9h-1c-.4 0-1 .1-1.5.7-.5.6-2 1.9-2 4.7 0 2.7 2 5.4 2.3 5.7.3.4 3.9 6 9.5 8.4 3.5 1.5 4.9 1.6 6.6 1.4 1.1-.1 3.3-1.3 3.8-2.6.5-1.3.5-2.4.3-2.6-.2-.3-.5-.4-1-.7Z"
        fill="white"
      />
    </svg>
  );
}

export default function WhatsAppButton() {
  const [autoOpen, setAutoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    let closeTimeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    const openThenClose = () => {
      setAutoOpen(true);
      closeTimeout = setTimeout(() => setAutoOpen(false), 10000);
    };

    const openTimeout = setTimeout(() => {
      openThenClose();
      interval = setInterval(openThenClose, 45000);
    }, 15000);

    return () => {
      clearTimeout(openTimeout);
      clearTimeout(closeTimeout);
      clearInterval(interval);
    };
  }, [mounted]);

  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      whileTap={{ scale: 0.94 }}
      className={[
        'group fixed bottom-3 right-5 md:bottom-8 md:right-8 z-[60]',
        'flex items-center rounded-full cursor-pointer overflow-hidden',
        // Half-size: h-7 (28px) mobile, h-8 (32px) desktop
        'h-7 md:h-8',
        // Width: collapsed = square, expanded = auto pill — duration-0 = instantaneous
        autoOpen ? 'w-auto' : 'w-7 md:w-8 md:hover:w-auto',
        'transition-[width] duration-0',
      ].join(' ')}
      style={{
        background: 'linear-gradient(135deg, #25D366 0%, #1ebe5e 100%)',
        boxShadow: '0 3px 12px rgba(37, 211, 102, 0.45)',
      }}
    >
      {/* Icon — fixed-size slot, never shifts */}
      <span className="relative flex items-center justify-center w-7 h-7 md:w-8 md:h-8 shrink-0">
        <WhatsAppIcon className="w-4 h-4 md:w-[18px] md:h-[18px] drop-shadow-sm" />
      </span>

      {/* Label — visible only when expanded */}
      <span
        className={[
          'whitespace-nowrap pr-3 text-white font-semibold text-xs',
          'opacity-0 group-hover:opacity-100',
          autoOpen ? 'block opacity-100' : 'hidden md:block',
        ].join(' ')}
      >
        Message us
      </span>
    </motion.a>
  );
}
