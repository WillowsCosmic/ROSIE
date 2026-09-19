'use client';

import { useEffect, useRef } from 'react';
import { type AgentState } from '@livekit/components-react';

interface RosieSoulOrbProps {
  state?: AgentState;
  volume?: number;
  className?: string;
  size?: number;
}

export function RosieSoulOrb({
  state = 'disconnected',
  volume = 0,
  className = '',
  size = 280,
}: RosieSoulOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const smoothedVolumeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let isTabVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      time += 0.02;

      // Smooth amplitude interpolation (spring smoothing)
      smoothedVolumeRef.current += (volume - smoothedVolumeRef.current) * 0.12;
      const vol = smoothedVolumeRef.current;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Determine palette based on state
      let mainColor = '#E8A33D'; // Ember Amber
      let subColor = '#D97B6C'; // Rose-Copper
      let coreGlow = 'rgba(232, 163, 61, 0.4)';

      if (state === 'thinking') {
        // Rare Enchanted Violet strictly for thinking
        mainColor = '#A78BFA';
        subColor = '#C4B5FD';
        coreGlow = 'rgba(167, 139, 250, 0.5)';
      } else if (state === 'listening') {
        mainColor = '#D97B6C';
        subColor = '#8FB8A0';
        coreGlow = 'rgba(217, 123, 108, 0.45)';
      } else if (state === 'speaking') {
        mainColor = '#E8A33D';
        subColor = '#F4E8D8';
        coreGlow = `rgba(232, 163, 61, ${0.4 + vol * 0.5})`;
      }

      // Base Core Radial Glow
      const baseRadius = (size / 4) * (1 + vol * 0.4);
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        baseRadius * 1.8
      );
      gradient.addColorStop(0, coreGlow);
      gradient.addColorStop(0.6, mainColor + '33');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Hand-drawn concentric filaments and wobbling rings
      const numRings = 5;
      for (let r = 0; r < numRings; r++) {
        const ringRadius = baseRadius + r * 14 + Math.sin(time + r) * 4;
        const numPoints = 36;

        ctx.beginPath();
        ctx.strokeStyle = r % 2 === 0 ? mainColor : subColor;
        ctx.globalAlpha = 0.5 - r * 0.08 + vol * 0.3;
        ctx.lineWidth = 1.2 + Math.sin(time * 2 + r) * 0.5;

        for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const wobble =
            Math.sin(angle * 6 + time * (1 + r * 0.5)) * (3 + vol * 15) +
            Math.cos(angle * 3 - time) * 2;
          const currentRadius = ringRadius + wobble;
          const x = centerX + Math.cos(angle) * currentRadius;
          const y = centerY + Math.sin(angle) * currentRadius;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Orbiting Sparkles / Filaments
      ctx.globalAlpha = 0.8;
      const numSparks = 8;
      for (let s = 0; s < numSparks; s++) {
        const sparkAngle = time * (0.8 + s * 0.1) + (s * Math.PI) / 4;
        const sparkDist = baseRadius * 1.4 + Math.sin(time * 3 + s) * 12;
        const sx = centerX + Math.cos(sparkAngle) * sparkDist;
        const sy = centerY + Math.sin(sparkAngle) * sparkDist;

        ctx.fillStyle = s % 2 === 0 ? '#F4E8D8' : mainColor;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.8 + Math.sin(time * 4 + s) * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state, volume, size]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={size * 1.6}
        height={size * 1.6}
        style={{ width: size, height: size }}
        className="pointer-events-none drop-shadow-[0_0_25px_rgba(232,163,61,0.3)]"
      />
    </div>
  );
}
