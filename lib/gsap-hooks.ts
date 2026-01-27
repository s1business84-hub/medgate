/**
 * React Hook for GSAP Animations
 * Simplifies using GSAP in React components
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook to apply GSAP animation on mount
 * Usage: const ref = useGSAPAnimation(fadeIn, { duration: 0.5 });
 */
export const useGSAPAnimation = (
  animationFn: (element: Element, options: any) => gsap.core.Tween | gsap.core.Timeline,
  options: any = {}
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      animationFn(element, options);
    }

    return () => {
      if (element) {
        gsap.killTweensOf(element);
      }
    };
  }, [animationFn, options]);

  return ref;
};

/**
 * Hook for scroll-triggered animations
 */
export const useGSAPScrollAnimation = (
  animationFn: (element: Element) => gsap.core.Tween | gsap.core.Timeline | void
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      animationFn(element);
    }

    return () => {
      if (element) {
        gsap.killTweensOf(element);
      }
    };
  }, [animationFn]);

  return ref;
};

/**
 * Hook for hover animations
 * Usage: const ref = useGSAPHover(scaleIn, scaleOut);
 */
export const useGSAPHover = (
  onEnter: (element: Element) => gsap.core.Tween,
  onLeave: (element: Element) => gsap.core.Tween
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => onEnter(element);
    const handleMouseLeave = () => onLeave(element);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(element);
    };
  }, [onEnter, onLeave]);

  return ref;
};

/**
 * Hook for stagger animations on multiple children
 */
export const useGSAPStagger = (
  animationFn: (elements: Element[]) => gsap.core.Timeline,
  selector?: string
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const elements = selector
        ? Array.from(container.querySelectorAll(selector))
        : Array.from(container.children);

      if (elements.length > 0) {
        animationFn(elements);
      }
    }

    return () => {
      if (container) {
        gsap.killTweensOf(container.children);
      }
    };
  }, [animationFn, selector]);

  return ref;
};

/**
 * Hook for timeline-based animations
 */
export const useGSAPTimeline = (
  setupFn: (timeline: gsap.core.Timeline) => void,
  deps: any[] = []
) => {
  const ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (ref.current) {
      timelineRef.current = gsap.timeline();
      setupFn(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
};
