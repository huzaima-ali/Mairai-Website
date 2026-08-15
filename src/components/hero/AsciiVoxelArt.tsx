"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Canvas2D Mirai-mark voxel field.
 * Performance-first: pauses offscreen/hidden, ~24fps, light post stack.
 */

export interface AsciiVoxelConfig {
  renderMode: "voxel";
  bgMode: "solid" | "none" | "image" | "blur";
  bgColor: string;
  bgOpacity: number;
  cellSize: number;
  coverage: number;
  invert: boolean;
  brightness: number;
  contrast: number;
  edgeEmphasis: number;
  density: number;
  tint: string;
  tintOpacity: number;
  saturation: number;
  grayscale: number;
  animated: boolean;
  animStyle: "flicker" | "wave" | "pulse" | "shimmer" | "ripple";
  animSpeed: number;
  animIntensity: number;
  /** Target frames per second while visible. */
  targetFps: number;
  pfx: {
    vignette: number;
    scanLines: number;
    chromatic: number;
    bloom: number;
    filmGrain: number;
    glitch: number;
  };
}

export const MIRAI_ASCII_CONFIG: AsciiVoxelConfig = {
  renderMode: "voxel",
  bgMode: "solid",
  bgColor: "#ffffff",
  bgOpacity: 100,
  cellSize: 18,
  coverage: 100,
  invert: false,
  brightness: 8,
  contrast: 130,
  edgeEmphasis: 50,
  density: 8,
  tint: "#c7253e",
  tintOpacity: 36,
  saturation: 110,
  grayscale: 0,
  animated: true,
  animStyle: "flicker",
  animSpeed: 90,
  animIntensity: 62,
  targetFps: 24,
  pfx: {
    vignette: 22,
    scanLines: 12,
    chromatic: 0, // disabled - expensive full-frame copies
    bloom: 0, // disabled - CSS blur filter was a major lag source
    filmGrain: 10,
    glitch: 6,
  },
};

interface AsciiVoxelArtProps {
  src: string;
  className?: string;
  config?: Partial<AsciiVoxelConfig>;
}

type Cell = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  l: number;
};

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = Number.parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function lum(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function applyContrast(v: number, contrastPct: number) {
  const c = contrastPct / 100;
  return clamp((v - 0.5) * c + 0.5);
}

export function AsciiVoxelArt({ src, className, config: configOverrides }: AsciiVoxelArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cfg: AsciiVoxelConfig = { ...MIRAI_ASCII_CONFIG, ...configOverrides };
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const source = document.createElement("canvas");
    const sourceCtx = source.getContext("2d", { willReadFrequently: true });
    if (!sourceCtx) return;

    const img = new Image();
    img.decoding = "async";

    let disposed = false;
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let ready = false;
    let visible = true;
    let pageVisible = document.visibilityState === "visible";
    let start = performance.now();
    let lastFrame = 0;
    let cached: { cells: Cell[]; cell: number } | null = null;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tint = hexToRgb(cfg.tint);
    const frameInterval = 1000 / Math.max(12, cfg.targetFps);
    const isNarrow = () => window.matchMedia("(max-width: 1023px)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Cap DPR hard - hero effect does not need retina fill-rate.
      dpr = Math.min(window.devicePixelRatio || 1, isNarrow() ? 1 : 1.25);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cached = null;
    };

    const sampleCells = () => {
      const cell = isNarrow() ? Math.max(cfg.cellSize, 20) : cfg.cellSize;
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);
      const sampleW = Math.max(48, cols * 2);
      const sampleH = Math.max(48, rows * 2);
      source.width = sampleW;
      source.height = sampleH;
      sourceCtx.fillStyle = "#0a0a0a";
      sourceCtx.fillRect(0, 0, sampleW, sampleH);

      const pad = 0.1;
      const availW = sampleW * (1 - pad * 2);
      const availH = sampleH * (1 - pad * 2);
      const scale = Math.min(availW / img.width, availH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      sourceCtx.imageSmoothingEnabled = true;
      sourceCtx.drawImage(img, (sampleW - dw) / 2, (sampleH - dh) / 2, dw, dh);

      const data = sourceCtx.getImageData(0, 0, sampleW, sampleH).data;
      const cells: Cell[] = [];
      const tintA = cfg.tintOpacity / 100;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const sx = Math.min(sampleW - 1, Math.floor(((col + 0.5) / cols) * sampleW));
          const sy = Math.min(sampleH - 1, Math.floor(((row + 0.5) / rows) * sampleH));
          // 2x2 average - cheaper than full cell scan
          let rSum = 0;
          let gSum = 0;
          let bSum = 0;
          let count = 0;
          for (let oy = 0; oy < 2; oy += 1) {
            for (let ox = 0; ox < 2; ox += 1) {
              const x = Math.min(sampleW - 1, sx + ox);
              const y = Math.min(sampleH - 1, sy + oy);
              const i = (y * sampleW + x) * 4;
              rSum += data[i] ?? 0;
              gSum += data[i + 1] ?? 0;
              bSum += data[i + 2] ?? 0;
              count += 1;
            }
          }
          let r = rSum / count;
          let g = gSum / count;
          let b = bSum / count;
          const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          if (cfg.saturation !== 100) {
            const s = cfg.saturation / 100;
            r = gray + (r - gray) * s;
            g = gray + (g - gray) * s;
            b = gray + (b - gray) * s;
          }
          let l = applyContrast(lum(r, g, b) + cfg.brightness / 200, cfg.contrast);
          if (cfg.invert) l = 1 - l;
          if (l < 0.08) continue;

          // Bake tint once into cached cell colors
          r = r * (1 - tintA) + Math.min(255, r * 0.55 + tint.r * 0.7) * tintA;
          g = g * (1 - tintA) + Math.min(255, g * 0.55 + tint.g * 0.7) * tintA;
          b = b * (1 - tintA) + Math.min(255, b * 0.55 + tint.b * 0.7) * tintA;

          cells.push({ x: col * cell, y: row * cell, r, g, b, l });
        }
      }
      return { cells, cell };
    };

    const drawVoxel = (
      x: number,
      y: number,
      size: number,
      r: number,
      g: number,
      b: number,
      depth: number,
      alpha: number,
    ) => {
      const s = size * (0.74 + depth * 0.2);
      const gap = Math.max(1, size * 0.08);
      const face = Math.max(2, s - gap);
      const ox = x + (size - s) / 2;
      const oy = y + (size - s) / 2 - depth * size * 0.1;

      ctx.globalAlpha = alpha;
      // Front face only on most frames is enough; add cheap top lip
      ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
      ctx.fillRect(ox, oy + face * 0.16, face, face * 0.84);
      ctx.fillStyle = `rgb(${Math.min(255, (r | 0) + 32)},${Math.min(255, (g | 0) + 24)},${Math.min(255, (b | 0) + 24)})`;
      ctx.fillRect(ox, oy, face, Math.max(2, face * 0.18));
      ctx.globalAlpha = 1;
    };

    const paint = (now: number) => {
      if (!ready || w < 2 || h < 2) return;
      if (!cached) cached = sampleCells();

      const { cells, cell } = cached;
      const t = (now - start) / 1000;
      const speed = Math.max(0.35, cfg.animSpeed / 100);
      const intensity = cfg.animIntensity / 100;
      const ptr = pointerRef.current;
      const motionOn = cfg.animated && !reducedMotion;

      // Soften pointer influence over time (no sticky hover cost)
      if (ptr.active > 0) {
        ptr.active *= 0.92;
        if (ptr.active < 0.02) ptr.active = 0;
      }

      ctx.fillStyle = cfg.bgColor;
      ctx.globalAlpha = cfg.bgOpacity / 100;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      const globalPulse = motionOn ? (Math.sin(t * speed * 2.2) * 0.5 + 0.5) * intensity : 0;
      const coverage = cfg.coverage / 100;

      for (let i = 0; i < cells.length; i += 1) {
        const c = cells[i]!;
        if ((((i * 1103515245 + 12345) >>> 0) / 0xffffffff) > coverage) continue;

        let anim = 0;
        let alpha = 1;
        let lift = 0;
        let bright = 0;

        if (motionOn) {
          const flicker = Math.sin(t * (6.5 + speed * 8) + i * 1.85) * 0.5 + 0.5;
          const spark = ((i * 13 + ((t * speed * 16) | 0)) % 43) === 0 ? 1 : 0;
          anim = flicker * intensity;
          bright = (flicker * 0.5 + spark * 0.7 + globalPulse * 0.3) * intensity;
          alpha = 0.62 + flicker * 0.38 * intensity + spark * 0.2;
          lift = (flicker - 0.5) * intensity * cell * 0.28;
        }

        if (ptr.active > 0.01) {
          const dx = c.x / w - ptr.x;
          const dy = c.y / h - ptr.y;
          const falloff = Math.exp(-Math.hypot(dx, dy) * 5.5) * ptr.active;
          anim += falloff * 0.7;
          bright += falloff * 0.55;
          lift += falloff * cell * 0.45;
          alpha = Math.min(1, alpha + falloff * 0.3);
        }

        const boost = 1 + bright * 0.5;
        const r = Math.min(255, c.r * boost + bright * 36);
        const g = Math.min(255, c.g * boost + bright * 16);
        const b = Math.min(255, c.b * boost + bright * 16);
        const depth = clamp(c.l + anim * 0.5 + cfg.density / 200 + globalPulse * 0.1);
        if (depth < 0.05) continue;

        drawVoxel(c.x, c.y + lift, cell, r, g, b, depth, alpha);
      }

      // Light post only - no full-canvas blur / chromatic copies
      if (cfg.pfx.scanLines > 0) {
        const drift = motionOn ? (t * speed * 24) % 4 : 0;
        ctx.globalAlpha = (cfg.pfx.scanLines / 100) * 0.16;
        ctx.fillStyle = "#000";
        for (let y = drift; y < h; y += 4) ctx.fillRect(0, y, w, 1);
        ctx.globalAlpha = 1;
      }

      if (cfg.pfx.filmGrain > 0 && motionOn) {
        ctx.globalAlpha = (cfg.pfx.filmGrain / 100) * 0.06;
        // Far fewer grains than before
        for (let n = 0; n < 28; n += 1) {
          ctx.fillStyle = n & 1 ? "#fff" : "#000";
          ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);
        }
        ctx.globalAlpha = 1;
      }

      if (cfg.pfx.glitch > 0 && motionOn && Math.random() < (cfg.pfx.glitch / 100) * 0.04 * speed) {
        const sliceH = 3 + Math.random() * 12;
        const sy = Math.random() * h;
        const dx = (Math.random() - 0.5) * 16 * (cfg.pfx.glitch / 100);
        ctx.drawImage(canvas, 0, sy * dpr, canvas.width, sliceH * dpr, dx, sy, w, sliceH);
      }

      if (cfg.pfx.vignette > 0) {
        const g = ctx.createRadialGradient(w * 0.5, h * 0.45, h * 0.18, w * 0.5, h * 0.5, h * 0.82);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, `rgba(10,10,10,${(cfg.pfx.vignette / 100) * 0.4})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const tick = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);

      const shouldRun = visible && pageVisible && ready;
      if (!shouldRun) return;

      // Static single paint when reduced motion
      if (reducedMotion || !cfg.animated) {
        if (lastFrame === 0) {
          paint(now);
          lastFrame = now;
        }
        return;
      }

      if (now - lastFrame < frameInterval) return;
      lastFrame = now;
      paint(now);
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = (event.clientX - rect.left) / Math.max(1, rect.width);
      pointerRef.current.y = (event.clientY - rect.top) / Math.max(1, rect.height);
      pointerRef.current.active = 1;
    };
    const onLeave = () => {
      pointerRef.current.active = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) lastFrame = 0; // paint ASAP when re-entering
      },
      { rootMargin: "80px", threshold: 0.01 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      if (pageVisible) lastFrame = 0;
    };

    const ro = new ResizeObserver(() => resize());

    img.onload = () => {
      if (disposed) return;
      ready = true;
      resize();
      start = performance.now();
      lastFrame = 0;
    };
    img.onerror = () => {
      ready = false;
    };
    img.src = src;

    ro.observe(canvas);
    canvas.addEventListener("pointermove", onPointer, { passive: true });
    canvas.addEventListener("pointerenter", onPointer, { passive: true });
    canvas.addEventListener("pointerleave", onLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerenter", onPointer);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [src, configOverrides]);

  return <canvas ref={canvasRef} className={cn("h-full w-full touch-pan-y", className)} aria-hidden />;
}
