import type { InteractionConfig, QualityProfile, VoxelQuality } from "./types";

/** Mirai brand tokens used by the voxel system. */
export const VOXEL_COLORS = {
  /** Primary physical structure */
  dark: "#171717",
  /** Subtle near-black structural depth (still reads as black) */
  mid: "#232323",
  /** Active digital / intelligence layer */
  accent: "#c7253e",
  accentSoft: "#8f1a2d",
} as const;

/** Shared sculpture geometry language - all six services use these. */
export const SHARED_VOXEL_SIZE = 0.13;
export const SHARED_SPACING = 0.15;
export const SHARED_CAMERA_DISTANCE = 5.1;

/** Morph between service sculptures (seconds). */
export const TRANSITION_DURATION = 0.82;
export const TRANSITION_DURATION_REDUCED = 0.01;

export const DEFAULT_INTERACTION: InteractionConfig = {
  interactionRadius: 1.2,
  interactionStrength: 0.72,
  returnSpeed: 7.2,
  maxDisplacement: 0.32,
  parallaxAmount: 0.07,
  dragSensitivity: 0.0055,
  dragLimitX: 0.55,
  dragLimitY: 0.35,
  pulseStrength: 0.22,
  pulseScale: 0.1,
  pulseDuration: 0.72,
  idleStrength: 0.012,
  idleDrift: 0.06,
};

export const QUALITY_PROFILES: Record<VoxelQuality, QualityProfile> = {
  desktop: {
    dpr: [1, 1.5],
    maxVoxels: 720,
    shadows: false,
    // Contact shadows look nice but are costly while scrolling the marketing page.
    contactShadow: false,
    enableRepel: true,
    enableIdle: true,
    enablePulse: true,
    enableDrag: true,
    enableParallax: true,
  },
  mobile: {
    // Same voxel budget as desktop - shape fidelity must match across breakpoints.
    // Performance comes from DPR / lights / interaction, not dropping blocks.
    dpr: [1, 1.15],
    maxVoxels: 720,
    shadows: false,
    contactShadow: false,
    enableRepel: false,
    enableIdle: true,
    enablePulse: true,
    enableDrag: true,
    enableParallax: false,
  },
  reducedMotion: {
    dpr: [1, 1.15],
    maxVoxels: 720,
    shadows: false,
    contactShadow: false,
    enableRepel: false,
    enableIdle: false,
    enablePulse: false,
    enableDrag: true,
    enableParallax: false,
  },
};

export function resolveQuality(opts: {
  isMobile: boolean;
  reducedMotion: boolean;
}): VoxelQuality {
  if (opts.reducedMotion) return "reducedMotion";
  if (opts.isMobile) return "mobile";
  return "desktop";
}
