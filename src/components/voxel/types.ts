export type VoxelQuality = "desktop" | "mobile" | "reducedMotion";

export type ServiceSculptureId =
  | "ai-products"
  | "digital-products"
  | "digital-twins"
  | "product-design"
  | "spatial"
  | "enterprise";

export interface VoxelPoint {
  x: number;
  y: number;
  z: number;
  /** 0 = dark, 1 = mid, 2 = accent */
  tone: 0 | 1 | 2;
  /** Detached orbiting voxel */
  orbit?: boolean;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitPhase?: number;
  orbitAxis?: "y" | "xz";
}

export interface VoxelDefinition {
  id: string;
  label: string;
  voxels: VoxelPoint[];
  /** World-unit size of each cube */
  voxelSize: number;
  /** Suggested camera distance */
  cameraDistance: number;
}

export interface InteractionConfig {
  interactionRadius: number;
  interactionStrength: number;
  returnSpeed: number;
  maxDisplacement: number;
  parallaxAmount: number;
  dragSensitivity: number;
  dragLimitX: number;
  dragLimitY: number;
  pulseStrength: number;
  pulseScale: number;
  pulseDuration: number;
  idleStrength: number;
  idleDrift: number;
}

export interface QualityProfile {
  dpr: [number, number];
  maxVoxels: number;
  shadows: boolean;
  contactShadow: boolean;
  enableRepel: boolean;
  enableIdle: boolean;
  enablePulse: boolean;
  enableDrag: boolean;
  enableParallax: boolean;
}

export interface VoxelDebugConfig {
  voxelSize?: number;
  interactionRadius?: number;
  interactionStrength?: number;
  returnSpeed?: number;
  maxDisplacement?: number;
  parallaxAmount?: number;
  pulseStrength?: number;
  idleStrength?: number;
  cameraDistance?: number;
}
