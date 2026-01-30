export const motionTokens = {
  duration: {
    fast: 0.12,
    ui: 0.18,
    page: 0.26,
    modal: 0.22,
  },
  ease: {
    standard: [0.2, 0, 0, 1] as const,
    emphasis: [0.16, 1, 0.3, 1] as const,
  },
  distance: {
    y: 12,
  },
};
