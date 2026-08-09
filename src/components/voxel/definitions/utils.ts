import type { VoxelDefinition, VoxelPoint } from "../types";
import { SHARED_CAMERA_DISTANCE, SHARED_SPACING, SHARED_VOXEL_SIZE } from "../config";

/** Deterministic pseudo-noise for designed holes (stable across mounts). */
export function hash3(x: number, y: number, z: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

export function pushVoxel(
  voxels: VoxelPoint[],
  x: number,
  y: number,
  z: number,
  tone: VoxelPoint["tone"] = 0,
  extras?: Partial<VoxelPoint>,
) {
  voxels.push({ x, y, z, tone, ...extras });
}

export const SPACING = SHARED_SPACING;

/** Max half-extent after fit — keeps all sculptures comparable in frame. */
const FIT_EXTENT = 1.2;

/**
 * Compact Mirai mark — hexagonal badge silhouette in red voxels.
 * Drawn on an XY plane at the given origin (grid units).
 */
export function stampMiraiLogo(
  voxels: VoxelPoint[],
  ox: number,
  oy: number,
  oz: number,
  tone: VoxelPoint["tone"] = 2,
  size: "md" | "sm" = "md",
) {
  const cells: Array<[number, number]> =
    size === "sm"
      ? [
          [0, 1],
          [-1, 0],
          [0, 0],
          [1, 0],
          [0, -1],
        ]
      : [
          [0, 2],
          [-1, 1],
          [0, 1],
          [1, 1],
          [-2, 0],
          [-1, 0],
          [0, 0],
          [1, 0],
          [2, 0],
          [-2, -1],
          [-1, -1],
          [0, -1],
          [1, -1],
          [2, -1],
          [-1, -2],
          [0, -2],
          [1, -2],
          [0, -3],
        ];
  for (const [x, y] of cells) {
    pushVoxel(voxels, (ox + x) * SPACING, (oy + y) * SPACING, oz * SPACING, tone);
  }
}

export function fillBox(
  voxels: VoxelPoint[],
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  tone: VoxelPoint["tone"] = 0,
  opts?: { hollow?: boolean; skip?: (x: number, y: number, z: number) => boolean },
) {
  const minX = Math.min(x0, x1);
  const maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1);
  const maxY = Math.max(y0, y1);
  const minZ = Math.min(z0, z1);
  const maxZ = Math.max(z0, z1);

  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      for (let z = minZ; z <= maxZ; z += 1) {
        if (opts?.hollow) {
          const edge =
            x === minX ||
            x === maxX ||
            y === minY ||
            y === maxY ||
            z === minZ ||
            z === maxZ;
          if (!edge) continue;
        }
        if (opts?.skip?.(x, y, z)) continue;
        pushVoxel(voxels, x * SPACING, y * SPACING, z * SPACING, tone);
      }
    }
  }
}

/** Axis-aligned filled rectangle on a constant axis plane. */
export function fillRect(
  voxels: VoxelPoint[],
  axis: "x" | "y" | "z",
  plane: number,
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  tone: VoxelPoint["tone"] = 0,
  thickness = 0,
) {
  const minU = Math.min(u0, u1);
  const maxU = Math.max(u0, u1);
  const minV = Math.min(v0, v1);
  const maxV = Math.max(v0, v1);

  for (let u = minU; u <= maxU; u += 1) {
    for (let v = minV; v <= maxV; v += 1) {
      for (let t = 0; t <= thickness; t += 1) {
        if (axis === "z") pushVoxel(voxels, u * SPACING, v * SPACING, (plane + t) * SPACING, tone);
        else if (axis === "y") pushVoxel(voxels, u * SPACING, (plane + t) * SPACING, v * SPACING, tone);
        else pushVoxel(voxels, (plane + t) * SPACING, u * SPACING, v * SPACING, tone);
      }
    }
  }
}

export function fillLine(
  voxels: VoxelPoint[],
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  tone: VoxelPoint["tone"] = 0,
) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dz = z1 - z0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz), 1);
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = Math.round(x0 + dx * t);
    const y = Math.round(y0 + dy * t);
    const z = Math.round(z0 + dz * t);
    pushVoxel(voxels, x * SPACING, y * SPACING, z * SPACING, tone);
  }
}

function centerAndFit(voxels: VoxelPoint[]): VoxelPoint[] {
  if (voxels.length === 0) return voxels;

  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  for (const v of voxels) {
    minX = Math.min(minX, v.x);
    minY = Math.min(minY, v.y);
    minZ = Math.min(minZ, v.z);
    maxX = Math.max(maxX, v.x);
    maxY = Math.max(maxY, v.y);
    maxZ = Math.max(maxZ, v.z);
  }

  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  const cz = (minZ + maxZ) * 0.5;
  const extent = Math.max(maxX - minX, maxY - minY, maxZ - minZ) * 0.5 || 1;
  const scale = FIT_EXTENT / extent;

  return voxels.map((v) => {
    const x = (v.x - cx) * scale;
    const y = (v.y - cy) * scale;
    const z = (v.z - cz) * scale;
    if (!v.orbit) return { ...v, x, y, z };
    return {
      ...v,
      x,
      y,
      z,
      orbitRadius: Math.sqrt(x * x + z * z) || v.orbitRadius,
    };
  });
}

/**
 * Prefer keeping intentional red accents and silhouette/surface voxels
 * when quality budgets force a trim.
 */
function prioritizeAndTrim(voxels: VoxelPoint[], maxVoxels: number): VoxelPoint[] {
  const red = voxels.filter((v) => v.tone === 2);
  const black = voxels.filter((v) => v.tone !== 2);

  // Cap red near ~22% so no sculpture reads as majority-red.
  const budget = Math.min(voxels.length, maxVoxels);
  const maxRed = Math.max(8, Math.floor(budget * 0.22));
  const keptRed =
    red.length <= maxRed
      ? red
      : red
          .map((v, index) => ({
            v,
            score: hash3(index, v.x * 10, v.y * 10),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, maxRed)
          .map((entry) => entry.v);

  const remaining = budget - keptRed.length;
  if (black.length <= remaining && keptRed.length === red.length) {
    return voxels.length <= maxVoxels ? voxels : [...keptRed, ...black].slice(0, maxVoxels);
  }

  const keptBlack = black
    .map((v, index) => {
      const score =
        Math.abs(v.x) +
        Math.abs(v.y) +
        Math.abs(v.z) +
        (v.tone === 1 ? 4 : 0) +
        hash3(index, v.x, v.z) * 2;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(0, remaining))
    .map((entry) => entry.v);

  return [...keptRed, ...keptBlack];
}

/** Stable pairing order for morph transitions between sculptures. */
export function sortVoxelsForMorph(voxels: VoxelPoint[]): VoxelPoint[] {
  return [...voxels].sort((a, b) => {
    const da = a.x * a.x + a.y * a.y + a.z * a.z;
    const db = b.x * b.x + b.y * b.y + b.z * b.z;
    return da - db || a.y - b.y || a.x - b.x || a.z - b.z;
  });
}

/** Collapse stacked cells; higher tone wins (red over black). */
function dedupeVoxels(voxels: VoxelPoint[]): VoxelPoint[] {
  const map = new Map<string, VoxelPoint>();
  for (const voxel of voxels) {
    const key = `${voxel.x.toFixed(3)}|${voxel.y.toFixed(3)}|${voxel.z.toFixed(3)}`;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, voxel);
      continue;
    }
    const preferNext =
      voxel.tone > prev.tone ||
      (!!voxel.orbit && !prev.orbit) ||
      (voxel.tone === prev.tone && !!voxel.orbit);
    if (preferNext) map.set(key, voxel);
  }
  return [...map.values()];
}

export function finalizeDefinition(
  id: string,
  label: string,
  voxels: VoxelPoint[],
  maxVoxels: number,
): VoxelDefinition {
  const unique = dedupeVoxels(voxels);
  const fitted = centerAndFit(unique);
  const trimmed = prioritizeAndTrim(fitted, maxVoxels);
  return {
    id,
    label,
    voxels: sortVoxelsForMorph(trimmed),
    voxelSize: SHARED_VOXEL_SIZE,
    cameraDistance: SHARED_CAMERA_DISTANCE,
  };
}

/** Shared dispersed cloud point used during service morphs. */
export function dispersedPosition(index: number, out: { x: number; y: number; z: number }) {
  const a = hash3(index, 1.7, 3.1) * Math.PI * 2;
  const b = hash3(index, 4.2, 0.9) * Math.PI;
  const r = 0.85 + hash3(index, 8.8, 2.2) * 0.85;
  out.x = Math.sin(b) * Math.cos(a) * r;
  out.y = Math.cos(b) * r * 0.72;
  out.z = Math.sin(b) * Math.sin(a) * r;
}
