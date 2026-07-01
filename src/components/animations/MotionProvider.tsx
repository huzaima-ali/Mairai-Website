"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";

/**
 * Loads only the DOM animation feature bundle (LazyMotion) to keep the
 * client bundle small, and applies a sensible reduced-motion default.
 * Use the `m` component from framer-motion inside this provider.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
