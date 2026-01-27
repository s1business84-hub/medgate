/**
 * GSAP Animation Utilities
 * Common animations for UI elements
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Fade in animation
 */
export const fadeIn = (element: Element | string, duration = 0.6, delay = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration, delay, ease: 'power2.out' }
  );
};

/**
 * Fade out animation
 */
export const fadeOut = (element: Element | string, duration = 0.6, delay = 0) => {
  return gsap.to(element, { opacity: 0, duration, delay, ease: 'power2.out' });
};

/**
 * Slide in from left
 */
export const slideInFromLeft = (element: Element | string, duration = 0.6, delay = 0) => {
  return gsap.fromTo(
    element,
    { x: -100, opacity: 0 },
    { x: 0, opacity: 1, duration, delay, ease: 'power2.out' }
  );
};

/**
 * Slide in from right
 */
export const slideInFromRight = (element: Element | string, duration = 0.6, delay = 0) => {
  return gsap.fromTo(
    element,
    { x: 100, opacity: 0 },
    { x: 0, opacity: 1, duration, delay, ease: 'power2.out' }
  );
};

/**
 * Slide in from top
 */
export const slideInFromTop = (element: Element | string, duration = 0.6, delay = 0) => {
  return gsap.fromTo(
    element,
    { y: -100, opacity: 0 },
    { y: 0, opacity: 1, duration, delay, ease: 'power2.out' }
  );
};

/**
 * Slide in from bottom
 */
export const slideInFromBottom = (element: Element | string, duration = 0.6, delay = 0) => {
  return gsap.fromTo(
    element,
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration, delay, ease: 'power2.out' }
  );
};

/**
 * Scale in animation
 */
export const scaleIn = (element: Element | string, duration = 0.6, delay = 0) => {
  return gsap.fromTo(
    element,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration, delay, ease: 'back.out' }
  );
};

/**
 * Pulse animation
 */
export const pulse = (element: Element | string, duration = 0.5, scale = 1.05) => {
  return gsap.to(element, {
    scale: scale,
    yoyo: true,
    repeat: -1,
    duration,
    ease: 'sine.inOut',
  });
};

/**
 * Bounce animation
 */
export const bounce = (element: Element | string, distance = 20, duration = 0.5) => {
  return gsap.to(element, {
    y: -distance,
    duration: duration / 2,
    yoyo: true,
    repeat: -1,
    ease: 'power1.inOut',
  });
};

/**
 * Rotate animation
 */
export const rotate = (element: Element | string, angle = 360, duration = 2) => {
  return gsap.to(element, {
    rotation: angle,
    duration,
    repeat: -1,
    ease: 'none',
  });
};

/**
 * Shake animation
 */
export const shake = (element: Element | string, intensity = 10, duration = 0.5) => {
  return gsap.to(element, {
    x: intensity,
    yoyo: true,
    repeat: 5,
    duration: duration / 6,
    ease: 'power1.inOut',
  });
};

/**
 * Glow animation (requires appropriate element with filter)
 */
export const glow = (element: Element | string, duration = 1) => {
  return gsap.to(element, {
    filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.6))',
    duration,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });
};

/**
 * Stagger multiple elements
 */
export const staggerFadeIn = (
  elements: Element[] | string,
  duration = 0.6,
  staggerDelay = 0.1
) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger: staggerDelay,
      ease: 'power2.out',
    }
  );
};

/**
 * Number counter animation
 */
export const countUp = (
  element: Element | string,
  end: number,
  duration = 1,
  decimals = 0
) => {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: end,
    duration,
    onUpdate: function () {
      const el = typeof element === 'string' ? document.querySelector(element) : element;
      if (el) {
        el.textContent = obj.value.toFixed(decimals);
      }
    },
    ease: 'power2.out',
  });
};

/**
 * Progress bar animation
 */
export const animateProgress = (
  element: Element | string,
  targetPercent: number,
  duration = 1
) => {
  return gsap.to(element, {
    width: `${targetPercent}%`,
    duration,
    ease: 'power2.out',
  });
};

/**
 * Scroll trigger animation - fade in on scroll
 */
export const fadeInOnScroll = (element: Element | string) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        markers: false,
      },
      ease: 'power2.out',
    }
  );
};

/**
 * Scroll trigger animation - slide in on scroll
 */
export const slideInOnScroll = (
  element: Element | string,
  direction: 'left' | 'right' | 'up' | 'down' = 'up'
) => {
  const fromValues = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: 100, opacity: 0 },
    down: { y: -100, opacity: 0 },
  };

  return gsap.fromTo(
    element,
    fromValues[direction],
    {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        markers: false,
      },
      ease: 'power2.out',
    }
  );
};

/**
 * Parallax scroll effect
 */
export const parallax = (element: Element | string, speed = 0.5) => {
  gsap.to(element, {
    y: () => window.innerHeight * speed,
    scrollTrigger: {
      trigger: element,
      scrub: 1,
      markers: false,
    },
    ease: 'none',
  });
};

/**
 * Timeline for sequential animations
 */
export const createTimeline = (config?: any) => {
  return gsap.timeline(config);
};

/**
 * Kill all animations on element
 */
export const killAnimations = (element: Element | string) => {
  gsap.killTweensOf(element);
};

/**
 * Kill all GSAP animations globally (clears global timeline)
 */
export const killAllAnimations = () => {
  gsap.globalTimeline.clear();
};
