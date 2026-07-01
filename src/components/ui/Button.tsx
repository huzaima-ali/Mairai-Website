"use client";

import { forwardRef } from "react";
import { m, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonHover } from "@/lib/motion";

type Variant = "primary" | "outline" | "light";
type Size = "md" | "lg";

const base =
  "pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Black pill — the primary button across the design (#010101).
  primary: "bg-ink text-white hover:shadow-pill",
  // Outlined pill on light backgrounds.
  outline: "border border-border bg-background text-foreground hover:border-foreground/40",
  // White pill used inside dark cards.
  light: "bg-white text-ink hover:shadow-pill",
};

const sizes: Record<Size, string> = {
  md: "h-[52px]",
  lg: "h-[56px] text-base",
};

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
}

type ButtonAsButton = ButtonBaseProps & Omit<HTMLMotionProps<"button">, "ref"> & { href?: undefined };
type ButtonAsLink = ButtonBaseProps & Omit<HTMLMotionProps<"a">, "ref"> & { href: string };
export type ButtonProps = ButtonAsButton | ButtonAsLink;

const MOTION = {
  variants: buttonHover,
  initial: "rest",
  whileHover: "hover",
  whileTap: "tap",
} as const;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);

    if (typeof (props as ButtonAsLink).href === "string") {
      const linkProps = props as Omit<HTMLMotionProps<"a">, "ref">;
      return (
        <m.a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} {...MOTION} {...linkProps}>
          {children}
        </m.a>
      );
    }

    const buttonProps = props as Omit<HTMLMotionProps<"button">, "ref">;
    return (
      <m.button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...MOTION} {...buttonProps}>
        {children}
      </m.button>
    );
  },
);

Button.displayName = "Button";
