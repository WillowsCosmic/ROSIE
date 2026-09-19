'use client';

import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'motion/react';
import { useAgent, useSessionContext } from '@livekit/components-react';
import { AgentSessionView_01 } from '@/components/agents-ui/blocks/agent-session-view-01';
import { AtelierBackground } from '@/components/app/atelier-background';
import { WelcomeView } from '@/components/app/welcome-view';

const MotionWelcomeView = motion.create(WelcomeView);
const MotionSessionView = motion.create(AgentSessionView_01);

const enchantedEasing = [0.22, 1, 0.36, 1];

const VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    hidden: {
      opacity: 0,
      scale: 0.98,
      filter: 'blur(6px)',
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.6,
    ease: enchantedEasing,
  },
};

interface ViewControllerProps {
  isVideoInputSupported: boolean;
}

export function ViewController({ isVideoInputSupported }: ViewControllerProps) {
  const { isConnected, start } = useSessionContext();
  const agent = useAgent();
  const { resolvedTheme } = useTheme();

  return (
    <>
      <AtelierBackground />
      <AnimatePresence mode="wait">
        {/* Welcome view */}
        {!isConnected && (
          <MotionWelcomeView
            key="welcome"
            {...VIEW_MOTION_PROPS}
            startButtonText="Wake Rosie"
            onStartCall={start}
          />
        )}
        {/* Session view */}
        {isConnected && (
          <MotionSessionView
            key="session-view"
            {...VIEW_MOTION_PROPS}
            preConnectMessage={
              agent.isConnected
                ? "Rosie's listening carefully..."
                : 'Awakening Rosie from her hearth...'
            }
            supportsChatInput={true}
            supportsVideoInput={isVideoInputSupported}
            supportsScreenShare={isVideoInputSupported}
            isPreConnectBufferEnabled={true}
            audioVisualizerType="aura"
            audioVisualizerColor="#E8A33D"
            themeMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
            className="fixed inset-0 z-20"
          />
        )}
      </AnimatePresence>
    </>
  );
}
