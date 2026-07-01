"use client";

import { m } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
}

/**
 * The signature header used across the site: a large left-aligned title with
 * a small eyebrow above it, and a supporting paragraph offset to the right.
 */
export function SectionHeader({ eyebrow, title, body }: SectionHeaderProps) {
  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="grid items-end gap-6 lg:grid-cols-2 lg:gap-12"
    >
      <div>
        {eyebrow ? (
          <m.p variants={fadeUp} className="eyebrow mb-4">
            {eyebrow}
          </m.p>
        ) : null}
        <m.h2
          variants={fadeUp}
          className="display text-balance text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.04]"
        >
          {title}
        </m.h2>
      </div>
      {body ? (
        <m.p
          variants={fadeUp}
          className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:pl-8"
        >
          {body}
        </m.p>
      ) : null}
    </m.div>
  );
}
