"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface UseCountUpOptions {
  /** Target value to count to. */
  to: number;
  /** Animation duration in milliseconds. */
  duration?: number;
  /** Start counting only once the element enters the viewport. */
  startOnInView?: boolean;
}

/**
 * Animates a number from 0 to `to` using requestAnimationFrame with an
 * ease-out curve. Respects prefers-reduced-motion by snapping to the target.
 */
export function useCountUp({ to, duration = 2000, startOnInView = true }: UseCountUpOptions) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const shouldStart = startOnInView ? isInView : true;
    if (!shouldStart) return;

    if (prefersReducedMotion) {
      setValue(to);
      return;
    }

    let raf = 0;
    let start: number | null = null;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(easeOutCubic(progress) * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, prefersReducedMotion, startOnInView, to, duration]);

  return { ref, value, done: value >= to };
}
