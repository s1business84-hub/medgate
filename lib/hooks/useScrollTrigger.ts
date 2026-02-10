import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollTriggerConfig {
  trigger?: string | React.RefObject<HTMLElement>;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export function useScrollTrigger(
  animationFn: (trigger: any) => gsap.core.Tween | gsap.core.Timeline,
  config: ScrollTriggerConfig = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = config.trigger || containerRef.current;
    if (!trigger) return;

    const ctx = gsap.context(() => {
      animationFn({
        trigger,
        start: config.start || 'top center',
        end: config.end || 'bottom center',
        scrub: config.scrub !== undefined ? config.scrub : 0.6,
        markers: config.markers || false,
        onEnter: config.onEnter,
        onLeave: config.onLeave,
        onEnterBack: config.onEnterBack,
        onLeaveBack: config.onLeaveBack,
      });
    });

    return () => ctx.revert();
  }, [animationFn, config]);

  return containerRef;
}

export function useParallax(offset: number = 50) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: offset,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        markers: false,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [offset]);

  return ref;
}

export function usePinSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      scrollTrigger: {
        trigger: ref.current,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return ref;
}
