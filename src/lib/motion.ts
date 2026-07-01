import type { Variants } from "framer-motion";

/**
 * Centralized motion system for Mirai Studios.
 * All animation variants live here so motion stays consistent and DRY.
 * Components consume these via the <Reveal /> primitive or directly.
 */

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT_SOFT: [number, number, number, number] = [0.65, 0.05, 0.36, 1];

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
} as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT_EXPO },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT_EXPO },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT_EXPO },
  },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT_EXPO },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT_EXPO },
  },
};

export const blurReveal: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = fadeUp;

export const heroReveal: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO, delay: 0.12 * i },
  }),
};

export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.06, filter: "blur(6px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE_OUT_EXPO },
  },
};

export const accordionContent: Variants = {
  collapsed: { height: 0, opacity: 0 },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.4, ease: EASE_IN_OUT_SOFT },
      opacity: { duration: 0.3, ease: EASE_OUT_EXPO, delay: 0.05 },
    },
  },
};

export const cardHover = {
  rest: { y: 0, transition: { duration: 0.3, ease: EASE_OUT_EXPO } },
  hover: { y: -6, transition: { duration: 0.3, ease: EASE_OUT_EXPO } },
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2, ease: EASE_OUT_EXPO } },
  tap: { scale: 0.96, transition: { duration: 0.12 } },
};

export const drawer: Variants = {
  closed: { x: "100%", transition: { duration: 0.4, ease: EASE_IN_OUT_SOFT } },
  open: { x: 0, transition: { duration: 0.45, ease: EASE_OUT_EXPO } },
};

export const overlay: Variants = {
  closed: { opacity: 0, transition: { duration: 0.3 } },
  open: { opacity: 1, transition: { duration: 0.3 } },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, filter: "blur(6px)", transition: { duration: 0.35, ease: EASE_OUT_EXPO } },
};

/** Default viewport config for scroll-triggered reveals (fires once). */
export const viewportOnce = { once: true, amount: 0.25 } as const;
