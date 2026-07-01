"use client";

import { m, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { fadeUp, viewportOnce } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  /** Delay before the animation starts, in seconds. */
  delay?: number;
}

/**
 * Scroll-triggered reveal primitive built on Framer Motion + IntersectionObserver.
 * Fires once and respects reduced motion (via the global MotionConfig), so every
 * section reveals consistently without duplicating animation config.
 */
export function Reveal({ children, variants = fadeUp, className, delay }: RevealProps) {
  return (
    <m.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={delay !== undefined ? { delay } : undefined}
    >
      {children}
    </m.div>
  );
}
