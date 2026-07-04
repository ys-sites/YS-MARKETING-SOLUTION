import React from 'react';
import { motion } from 'framer-motion';

const WHATSAPP_LINK = 'https://wa.me/message/O4RDTWJDWFEDG1';

export default function WhatsAppButton() {
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed bottom-3 right-5 md:bottom-8 md:right-8 z-[60] flex items-center h-14 w-16 md:h-16 md:w-[72px] md:hover:w-[196px] rounded-full bg-[#25D366] shadow-[0_8px_24px_rgba(37,211,102,0.45)] cursor-pointer overflow-hidden transition-[width] duration-300 ease-out"
    >
      {/* Subtle pulse ring — using pulse instead of ping to avoid the sharp opacity flash */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse opacity-30 md:group-hover:opacity-0 transition-opacity duration-300" />

      {/* Icon — fixed-width slot so it never shifts as the pill expands */}
      <span className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 shrink-0">
        <svg
          viewBox="0 0 32 32"
          className="w-5 h-5 md:w-6 md:h-6 fill-white"
          aria-hidden="true"
        >
          <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.65 4.53 1.78 6.4L4 29l7.78-1.74A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.8a9.75 9.75 0 0 1-4.98-1.36l-.357-.212-4.62 1.033 1.006-4.5-.233-.37A9.76 9.76 0 0 1 6.2 15c0-5.413 4.39-9.8 9.804-9.8 5.412 0 9.8 4.387 9.8 9.8 0 5.413-4.388 9.8-9.8 9.8Zm5.36-7.34c-.293-.147-1.735-.857-2.005-.955-.27-.098-.466-.147-.663.147-.196.293-.76.955-.932 1.152-.171.196-.343.22-.636.073-.293-.147-1.238-.456-2.36-1.456-.872-.778-1.462-1.739-1.633-2.032-.171-.293-.018-.451.129-.598.132-.132.293-.343.44-.514.147-.171.196-.293.293-.489.098-.196.049-.367-.024-.514-.073-.147-.663-1.6-.909-2.19-.24-.575-.483-.497-.663-.506l-.564-.01c-.196 0-.514.073-.784.367-.27.293-1.03 1.006-1.03 2.454 0 1.448 1.055 2.847 1.202 3.043.147.196 2.077 3.17 5.032 4.445.703.303 1.251.484 1.679.62.706.224 1.348.192 1.856.117.566-.085 1.735-.71 1.98-1.394.244-.685.244-1.272.171-1.394-.073-.122-.269-.196-.562-.343Z" />
        </svg>
      </span>

      {/* Label — revealed as the pill expands on hover (desktop only) */}
      <span className="relative hidden md:block whitespace-nowrap pr-6 text-white font-semibold text-base opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-hover:delay-150">
        Message us
      </span>
    </motion.a>
  );
}
