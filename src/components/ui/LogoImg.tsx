"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface LogoImgProps {
  /** Path under /public, e.g. "/logos/rivian.svg". */
  src: string;
  /** Brand name, used for alt text and the wordmark fallback. */
  name: string;
  className?: string;
  /** Extra classes for the fallback wordmark. */
  wordmarkClassName?: string;
}

/**
 * Renders a brand logo image. If the asset is missing (e.g. before the Figma
 * assets have been downloaded via `scripts/download-figma-assets.mjs`), it
 * gracefully falls back to a styled wordmark so the layout never looks broken.
 */
export function LogoImg({ src, name, className, wordmarkClassName }: LogoImgProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          "select-none whitespace-nowrap text-center text-lg font-medium tracking-tight",
          wordmarkClassName,
        )}
      >
        {name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
