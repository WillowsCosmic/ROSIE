'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface Mote {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function AtelierBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Generate deterministic floating motes of light
  const motes = useMemo<Mote[]>(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2, // 2px to 6px
      x: ((i * 5.5 + Math.sin(i) * 15) % 95) + 2, // Distributed horizontally 2% to 97%
      y: ((i * 7 + Math.cos(i) * 20) % 90) + 5, // Distributed vertically
      duration: 12 + (i % 5) * 2, // 12s - 20s loops
      delay: (i % 4) * 1.5,
      opacity: 0.25 + (i % 3) * 0.15,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* SVG Grain Noise Filter Overlay */}
      <svg className="absolute inset-0 size-full opacity-[0.04]">
        <filter id="atelier-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#atelier-noise)" />
      </svg>

      {/* Edge Vignette */}
      <div className="vignette-overlay" />

      {/* Breathing Hearth Glow (Candlelight background behind hero) */}
      <div className="animate-hearth-glow absolute top-1/2 left-1/3 size-[520px] rounded-full bg-radial from-[#E8A33D]/20 via-[#D97B6C]/10 to-transparent blur-3xl" />

      {/* Secondary Moonlit Sage Glow Accent */}
      <div className="absolute top-1/4 right-1/4 size-[400px] rounded-full bg-radial from-[#8FB8A0]/15 via-transparent to-transparent blur-3xl" />

      {/* Floating Motes of Light */}
      {!shouldReduceMotion &&
        motes.map((mote) => (
          <motion.div
            key={mote.id}
            className="absolute rounded-full bg-[#E8A33D]"
            style={{
              width: mote.size,
              height: mote.size,
              left: `${mote.x}%`,
              top: `${mote.y}%`,
              boxShadow: `0 0 ${mote.size * 2}px #E8A33D`,
            }}
            animate={{
              y: ['0px', '-120px', '-240px'],
              x: ['0px', `${(mote.id % 2 === 0 ? 1 : -1) * 25}px`, '0px'],
              opacity: [0, mote.opacity, mote.opacity * 0.5, 0],
            }}
            transition={{
              duration: mote.duration,
              delay: mote.delay,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1], // enchanted easing
            }}
          />
        ))}
    </div>
  );
}
