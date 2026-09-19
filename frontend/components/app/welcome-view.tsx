'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { HandDrawnStar, HandDrawnVine } from '@/components/app/hand-drawn-flourish';
import { RosieSoulOrb } from '@/components/app/rosie-soul-orb';
import { WakeRosieButton } from '@/components/app/wake-rosie-button';

interface WelcomeViewProps {
  startButtonText?: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  const shouldReduceMotion = useReducedMotion();

  const enchantedEasing = [0.22, 1, 0.36, 1];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
      filter: shouldReduceMotion ? 'blur(0px)' : 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        ease: enchantedEasing,
      },
    },
  };

  return (
    <div
      ref={ref}
      className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-16"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="paper-surface relative mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 p-8 md:grid-cols-12 md:p-14"
      >
        {/* Asymmetric Composition Left: Rosie's Soul Orb */}
        <motion.div
          variants={itemVariants}
          className="relative flex flex-col items-center justify-center md:col-span-5"
        >
          <div className="relative">
            <RosieSoulOrb state="disconnected" size={290} />
            <HandDrawnStar className="absolute -top-3 -right-2 size-6 text-[#E8A33D]" />
          </div>
          <span className="small-caps font-display mt-3 text-xs font-semibold tracking-widest text-[#8FB8A0] uppercase">
            ✦ Hearth Spirit Core
          </span>
        </motion.div>

        {/* Asymmetric Composition Right: Storybook Text & CTA */}
        <motion.div
          variants={itemVariants}
          className="relative flex flex-col items-start text-left md:col-span-7"
        >
          {/* Connecting Hand-Drawn Vine Flourish */}
          <HandDrawnVine className="mb-2 h-10 w-64 text-[#E8A33D]" />

          <motion.div variants={itemVariants} className="mb-2 flex items-center gap-2">
            <span className="small-caps font-display text-xs font-bold tracking-widest text-[#E8A33D] uppercase">
              The Enchanted Atelier
            </span>
            <span className="text-[#D97B6C]">•</span>
            <span className="font-body text-xs font-medium text-[#8FB8A0]">
              Librarian of Impossible Things
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display mb-4 text-4xl font-bold tracking-tight text-[#F4E8D8] sm:text-5xl lg:text-6xl"
            style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            Rosie&apos;s been waiting.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-body mb-8 max-w-lg text-base leading-relaxed text-[#F0E6DA]/90 md:text-lg"
          >
            Tell her what you&apos;re working on. Part hearth-spirit, part ancient assistant, she
            will wander the web, fetch impossible answers, and keep your hearth warm.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <WakeRosieButton label="Wake Rosie" onClick={onStartCall} />
            <span className="font-body text-xs text-[#8FB8A0]/80">
              ✦ Voice input &amp; live web navigation
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
