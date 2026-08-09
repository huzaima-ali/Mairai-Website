"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { getCaseStudyUrl, type CaseStudy } from "@/lib/case-studies";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";

interface StackedCaseCarouselProps {
  studies: CaseStudy[];
  active: number;
  onIndexChange: (index: number) => void;
  className?: string;
}

const MAX_VISIBLE = 5;
const SPREAD_DEG = 20;
const OVERLAP = 0.36;
const CARD_ASPECT = 16 / 10;

function signedOffset(index: number, active: number, length: number) {
  const raw = index - active;
  if (length <= 1) return raw;
  const alt = raw > 0 ? raw - length : raw + length;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function StackedCaseCarousel({
  studies,
  active,
  onIndexChange,
  className,
}: StackedCaseCarouselProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [stageWidth, setStageWidth] = useState(860);
  const length = studies.length;
  const maxOffset = Math.floor(MAX_VISIBLE / 2);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const update = () => setStageWidth(node.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const cardWidth = Math.min(680, Math.max(280, stageWidth * 0.86));
  const cardHeight = cardWidth / CARD_ASPECT;
  const spacing = cardWidth * (1 - OVERLAP);
  const stageHeight = Math.ceil(cardHeight + 48);

  const onPointerDown = (clientX: number) => {
    pointerStartX.current = clientX;
    setDragging(false);
  };

  const onPointerMove = (clientX: number) => {
    if (pointerStartX.current == null) return;
    if (Math.abs(clientX - pointerStartX.current) > 12) setDragging(true);
  };

  const onPointerUp = (clientX: number) => {
    if (pointerStartX.current == null) return;
    const delta = clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(delta) > 56) {
      onIndexChange(delta > 0 ? active - 1 : active + 1);
    }

    window.setTimeout(() => setDragging(false), 0);
  };

  if (!length) return null;

  return (
    <div
      ref={stageRef}
      className={cn("relative mx-auto w-full max-w-6xl select-none overflow-hidden", className)}
      onPointerDown={(e) => onPointerDown(e.clientX)}
      onPointerMove={(e) => onPointerMove(e.clientX)}
      onPointerUp={(e) => onPointerUp(e.clientX)}
      onPointerCancel={() => {
        pointerStartX.current = null;
        setDragging(false);
      }}
    >
      <div className="relative mx-auto w-full" style={{ height: stageHeight }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {studies.map((study, index) => {
            const offset = signedOffset(index, active, length);
            const abs = Math.abs(offset);
            if (abs > maxOffset) return null;

            const isActive = offset === 0;
            const rotate = reduceMotion ? 0 : offset * (SPREAD_DEG / Math.max(1, maxOffset));
            const x = offset * spacing * 0.82;
            const y = abs * 10 + (isActive ? -6 : 4);
            const scale = isActive ? 1.03 : Math.max(0.84, 0.94 - abs * 0.04);
            const opacity = isActive ? 1 : Math.max(0.55, 1 - abs * 0.14);

            return (
              <m.div
                key={study.slug}
                className={cn(
                  "absolute",
                  isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                )}
                style={{ width: cardWidth, zIndex: 40 - abs }}
                initial={false}
                animate={{ x, y, rotate, scale, opacity }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT_EXPO }}
                onClick={() => {
                  if (dragging) return;
                  if (!isActive) {
                    onIndexChange(index);
                    return;
                  }
                  window.location.href = getCaseStudyUrl(study.slug);
                }}
              >
                <div
                  className={cn(
                    "overflow-hidden rounded-[24px] border border-black/[0.08] bg-[#0a0a0a] shadow-card",
                    !isActive && "brightness-[0.93]",
                  )}
                >
                  <div className="pointer-events-none relative" style={{ aspectRatio: `${CARD_ASPECT}` }}>
                    <CaseStudyCard
                      study={study}
                      reveal={false}
                      centerTitle
                      interactive={false}
                      className="absolute inset-0 h-full rounded-[24px] shadow-none"
                    />
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
