"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { QUALITY_PROFILES, SHARED_CAMERA_DISTANCE, resolveQuality } from "./config";
import type { VoxelDebugConfig, VoxelDefinition } from "./types";
import { FlapCaption } from "./FlapCaption";
import { VoxelErrorBoundary } from "./VoxelErrorBoundary";
import { VoxelLighting } from "./VoxelLighting";
import { VoxelSculpture } from "./VoxelSculpture";

interface VoxelSceneProps {
  definition?: VoxelDefinition;
  className?: string;
  debug?: VoxelDebugConfig;
  fallback?: ReactNode;
  /** Optional bottom-right caption (flap animation on change). */
  label?: string;
  /** Accessible name for the visual. */
  ariaLabel?: string;
  /** Subtle orientation bias while hovering another service. */
  hoverNudge?: number;
}

function readIsMobile() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 1023px)").matches ||
    window.matchMedia("(hover: none) and (pointer: coarse)").matches
  );
}

function useIsMobile() {
  // Client-only scene (dynamic import) - initialize correctly to avoid desktop
  // quality/shadows flashing on phones before the effect runs.
  const [isMobile, setIsMobile] = useState(readIsMobile);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1023px)");
    const touchPrimary = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setIsMobile(narrow.matches || touchPrimary.matches);
    update();
    narrow.addEventListener("change", update);
    touchPrimary.addEventListener("change", update);
    return () => {
      narrow.removeEventListener("change", update);
      touchPrimary.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function DefaultFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent">
      <div className="grid grid-cols-6 gap-1 opacity-40">
        {Array.from({ length: 36 }).map((_, i) => (
          <span
            key={i}
            className="size-3 rounded-[2px] bg-ink"
            style={{ opacity: 0.25 + ((i * 17) % 50) / 100 }}
          />
        ))}
      </div>
    </div>
  );
}

export function VoxelScene({
  definition,
  className,
  debug,
  fallback,
  label,
  ariaLabel,
  hoverNudge = 0,
}: VoxelSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const [webglFailed, setWebglFailed] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  const qualityKey = useMemo(
    () => resolveQuality({ isMobile, reducedMotion }),
    [isMobile, reducedMotion],
  );
  const quality = QUALITY_PROFILES[qualityKey];
  const renderActive = inView && pageVisible;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "120px", threshold: 0.01 },
    );
    io.observe(el);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Same camera language on every breakpoint so sculptures keep scale/shape.
  const cameraDistance = debug?.cameraDistance ?? SHARED_CAMERA_DISTANCE;
  const fallbackNode = fallback ?? <DefaultFallback />;
  const caption = label ?? definition?.label;
  const accessibleName =
    ariaLabel ??
    (definition?.label
      ? `Interactive 3D illustration for ${definition.label}`
      : "Interactive 3D service illustration");

  if (webglFailed) {
    return (
      <div
        ref={rootRef}
        className={["relative", className].filter(Boolean).join(" ")}
        role="img"
        aria-label={accessibleName}
      >
        {fallbackNode}
        {caption ? <FlapCaption text={caption} /> : null}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={["relative", className].filter(Boolean).join(" ")}
      role="img"
      aria-label={accessibleName}
    >
      <VoxelErrorBoundary fallback={fallbackNode}>
        <Canvas
          className="h-full w-full touch-pan-y"
          style={{ touchAction: "pan-y", width: "100%", height: "100%" }}
          // Freeze the render loop when scrolled away / tab hidden.
          frameloop={renderActive ? "always" : "never"}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: isMobile ? "low-power" : "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          dpr={quality.dpr}
          camera={{ position: [0, 0.15, cameraDistance], fov: 32, near: 0.1, far: 40 }}
          // Remount if quality band changes so DPR/shadows don't stick in a bad state.
          key={qualityKey}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            const canvas = gl.domElement;
            canvas.style.touchAction = "pan-y";
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            const onContextLost = (event: Event) => {
              event.preventDefault();
              setWebglFailed(true);
            };
            canvas.addEventListener("webglcontextlost", onContextLost, false);
          }}
        >
          <Suspense fallback={null}>
            <VoxelLighting contactShadow={quality.contactShadow && !isMobile} />
            <VoxelSculpture
              definition={definition}
              quality={quality}
              debug={debug}
              reducedMotion={reducedMotion}
              hoverNudge={hoverNudge}
            />
          </Suspense>
        </Canvas>
      </VoxelErrorBoundary>
      {caption ? <FlapCaption text={caption} /> : null}
    </div>
  );
}
