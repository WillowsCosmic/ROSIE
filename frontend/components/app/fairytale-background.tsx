'use client';

import React, { useMemo } from 'react';

export function FairytaleBackground() {
  // Generate random particles for magical stardust
  const particles = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      top: `${(i * 17) % 100}%`,
      left: `${(i * 29) % 100}%`,
      size: `${((i % 4) + 1) * 3}px`,
      duration: `${6 + (i % 8)}s`,
      delay: `${(i % 5) * 1.2}s`,
      color: i % 3 === 0 ? '#ff00b7' : i % 3 === 1 ? '#e056fd' : '#f9ca24',
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Fairytale Nebula Background Gradients */}
      <div className="absolute -top-40 -left-40 size-[600px] rounded-full bg-gradient-to-br from-pink-600/15 via-purple-600/10 to-transparent blur-3xl" />
      <div className="absolute top-1/3 -right-40 size-[700px] rounded-full bg-gradient-to-bl from-purple-800/20 via-pink-500/10 to-transparent blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 size-[650px] rounded-full bg-gradient-to-tr from-fuchsia-600/15 via-indigo-600/10 to-transparent blur-3xl" />

      {/* Center Aura Ambient Bloom */}
      <div className="absolute top-1/2 left-1/2 size-[450px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[#ff00b7]/10 blur-[120px]" />

      {/* Floating Stardust Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="animate-float absolute rounded-full opacity-70"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Constellation Sparkle overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ff00b7_1px,transparent_1px)] [background-size:64px_64px] opacity-15" />
    </div>
  );
}
