// Shared animation constants for the Liquid Glass portfolio

export const springInteraction = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
};

export const springGentle = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
};

export const springModal = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  restDelta: 0.001,
};

export const liquidTransitions = {
  default: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  fast: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  slow: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  spring: springInteraction,
};

export const staggerDelays = {
  tight: 0.03,
  default: 0.05,
  relaxed: 0.1,
  staggered: 0.12,
};

export const exitRatio = 0.65;

export function pageTransitionEnter(delay = 0) {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
      duration: liquidTransitions.slow.duration,
      ease: liquidTransitions.default.ease,
      delay,
    },
  };
}
