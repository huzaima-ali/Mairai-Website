"use client";

import { useEffect, useState } from "react";

interface FlapCaptionProps {
  text: string;
  className?: string;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&";

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "A";
}

/**
 * Simple split-flap style caption - each character scrambles then settles.
 * Plain text (no mechanical tiles), bottom-right of the voxel panel.
 */
export function FlapCaption({ text, className }: FlapCaptionProps) {
  const [chars, setChars] = useState<string[]>(() => text.split(""));

  useEffect(() => {
    const target = text.toUpperCase();
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || target.length === 0) {
      setChars(target.split(""));
      return;
    }

    const length = target.length;
    const display = Array.from({ length }, (_, i) =>
      target[i] === " " ? " " : randomGlyph(),
    );
    setChars([...display]);

    const timers: number[] = [];
    const intervals: number[] = [];

    for (let i = 0; i < length; i += 1) {
      const finalChar = target[i] ?? " ";
      if (finalChar === " ") {
        display[i] = " ";
        continue;
      }

      const startDelay = 40 + i * 42;
      const flips = 5 + (i % 3);

      const startId = window.setTimeout(() => {
        let step = 0;
        const flipId = window.setInterval(() => {
          step += 1;
          if (step >= flips) {
            display[i] = finalChar;
            setChars([...display]);
            window.clearInterval(flipId);
            return;
          }
          display[i] = randomGlyph();
          setChars([...display]);
        }, 38);
        intervals.push(flipId);
      }, startDelay);

      timers.push(startId);
    }

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      intervals.forEach((id) => window.clearInterval(id));
    };
  }, [text]);

  return (
    <p
      className={[
        "pointer-events-none absolute bottom-4 right-5 z-10 max-w-[85%] text-right font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/75 sm:bottom-5 sm:right-6 sm:text-xs",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={text}
      aria-live="polite"
    >
      {chars.map((char, index) => (
        <span key={index} className="inline-block min-w-[0.55ch]">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
  );
}
