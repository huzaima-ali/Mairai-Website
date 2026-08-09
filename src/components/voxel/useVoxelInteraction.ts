"use client";

import { useMemo, useRef } from "react";
import type { InteractionConfig } from "./types";
import { DEFAULT_INTERACTION } from "./config";

export interface VoxelInteractionState {
  /** Pointer in local sculpture space; w > 0 means active */
  pointer: { x: number; y: number; z: number; active: number };
  /** Accumulated drag rotation (radians) */
  drag: { x: number; y: number; active: number };
  /** Parallax target from pointer NDC */
  parallax: { x: number; y: number };
  /** Pulse wave */
  pulse: { x: number; y: number; z: number; start: number; active: number };
  dragging: boolean;
  /** True while morphing between service sculptures */
  morphing: boolean;
}

export function createInteractionState(): VoxelInteractionState {
  return {
    pointer: { x: 0, y: 0, z: 0, active: 0 },
    drag: { x: 0, y: 0, active: 0 },
    parallax: { x: 0, y: 0 },
    pulse: { x: 0, y: 0, z: 0, start: 0, active: 0 },
    dragging: false,
    morphing: false,
  };
}

export function useVoxelInteraction(overrides?: Partial<InteractionConfig>) {
  const config = useMemo(
    () => ({
      ...DEFAULT_INTERACTION,
      ...overrides,
    }),
    [overrides],
  );

  const state = useRef(createInteractionState());
  const dragOrigin = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });

  return {
    config,
    state,
    dragOrigin,
  };
}
