'use client';

import { type MouseEvent, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface WakeRosieButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

export function WakeRosieButton({
  onClick,
  label = 'Wake Rosie',
  disabled = false,
}: WakeRosieButtonProps) {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const flutterEasing = [0.34, 1.56, 0.64, 1];

  return (
    <div className="relative inline-block">
      <motion.button
        ref={buttonRef}
        onClick={onClick}
        disabled={disabled}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group font-display relative overflow-hidden rounded-full border border-[#E8A33D]/40 bg-gradient-to-r from-[#1B1426] via-[#241A33] to-[#121A18] px-10 py-4 text-base font-bold text-[#F4E8D8] shadow-[0_4px_24px_rgba(232,163,61,0.2)] transition-colors duration-300 disabled:opacity-50"
        animate={{
          letterSpacing: isHovered && !shouldReduceMotion ? '0.12em' : '0.10em',
        }}
        transition={{
          duration: 0.35,
          ease: flutterEasing,
        }}
      >
        {/* Cursor-Following Ember Glow Radial Overlay */}
        {isHovered && (
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300"
            style={{
              background: `radial-gradient(140px circle at ${mousePos.x}px ${mousePos.y}px, rgba(232, 163, 61, 0.35), rgba(217, 123, 108, 0.15), transparent 80%)`,
            }}
          />
        )}

        {/* Button Content */}
        <span className="relative z-10 flex items-center justify-center gap-3">
          <svg
            className="size-4 text-[#E8A33D] transition-transform duration-300 group-hover:rotate-12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="small-caps tracking-widest text-[#F4E8D8] uppercase">{label}</span>
        </span>
      </motion.button>

      {/* Floating Spark Particles Drifting Off Edge on Hover */}
      {isHovered && !shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute size-1.5 rounded-full bg-[#E8A33D]"
            initial={{ opacity: 1, x: '20%', y: '10%' }}
            animate={{ opacity: 0, x: '10%', y: '-35px' }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute size-1 rounded-full bg-[#D97B6C]"
            initial={{ opacity: 1, x: '75%', y: '20%' }}
            animate={{ opacity: 0, x: '85%', y: '-40px' }}
            transition={{ duration: 1.0, delay: 0.2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute size-1.5 rounded-full bg-[#F4E8D8]"
            initial={{ opacity: 1, x: '50%', y: '80%' }}
            animate={{ opacity: 0, x: '55%', y: '45px' }}
            transition={{ duration: 0.9, delay: 0.4, repeat: Infinity, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}
