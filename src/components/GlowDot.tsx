import React from 'react';

export default function GlowDot({ className = 'bg-brand-red' }: { className?: string }) {
  return (
    <span className="relative flex items-center justify-center shrink-0">
      <span className={`absolute w-2 h-2 rounded-full animate-ping opacity-75 ${className}`} />
      <span className={`relative w-1.5 h-1.5 rounded-full ${className}`} />
    </span>
  );
}
