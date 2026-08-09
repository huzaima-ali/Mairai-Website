import type { VoxelDefinition, VoxelPoint } from "../types";
import { finalizeDefinition, hash3, pushVoxel, SPACING } from "./utils";

/**
 * VR headset — three-quarter angle showing front lenses + side/back strap.
 */
export function createSpatialDefinition(maxVoxels = 720): VoxelDefinition {
  const voxels: VoxelPoint[] = [];

  // Stronger yaw so the rear strap reads, while the front stays visible.
  const yaw = 0.92; // ~53°
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);

  const put = (x: number, y: number, z: number, tone: VoxelPoint["tone"] = 0) => {
    const lz = -z;
    const rx = x * cos + lz * sin;
    const rz = -x * sin + lz * cos;
    pushVoxel(voxels, rx * SPACING, y * SPACING, rz * SPACING, tone);
  };

  // Front visor shell (local z = 0 is the front face)
  for (let x = -7; x <= 7; x += 1) {
    for (let y = -3; y <= 4; y += 1) {
      const nx = x / 7.4;
      const ny = (y - 0.15) / 3.7;
      if (nx * nx + ny * ny > 1) continue;

      put(x, y, 0, 0);
      put(x, y, 1, 0);

      const radial = nx * nx + ny * ny;
      if (radial > 0.45) {
        put(x, y, 2, 0);
        put(x, y, 3, 0);
      }
    }
  }

  for (let x = -6; x <= 6; x += 1) {
    put(x, 4, 0, 0);
    put(x, 4, 1, 0);
    put(x, 3, 0, 0);
  }

  for (let x = -5; x <= 5; x += 1) {
    put(x, -3, 0, 0);
    put(x, -3, 1, 0);
    put(x, -2, 1, 0);
  }

  // Side arms + visible rear loop
  for (let z = 2; z <= 9; z += 1) {
    const flare = z > 5 ? 1 : 0;
    for (let y = -1; y <= 2; y += 1) {
      put(-7 - flare, y, z, 0);
      put(7 + flare, y, z, 0);
    }
  }

  // Rear strap bridge — keep dense enough to read from the three-quarter
  for (let x = -6; x <= 6; x += 1) {
    put(x, 0, 9, 0);
    put(x, 1, 9, 0);
    if (Math.abs(x) > 3) put(x, 2, 9, 0);
  }

  for (let z = 2; z <= 8; z += 1) {
    put(0, 4, z, 0);
    put(-1, 4, z, 0);
    put(1, 4, z, 0);
  }

  // Red lenses on the front
  for (const cx of [-2, 2]) {
    for (let x = -2; x <= 2; x += 1) {
      for (let y = -2; y <= 2; y += 1) {
        if (x * x + y * y > 4.5) continue;
        put(cx + x, y, 0, 2);
        if (x * x + y * y <= 2) put(cx + x, y, -1, 2);
      }
    }
  }

  for (let a = 0; a < 20; a += 1) {
    const ang = (a / 20) * Math.PI * 2;
    put(Math.round(Math.cos(ang) * 5.2), Math.round(Math.sin(ang) * 2.4), 0, 2);
  }

  // A few spatial voxels in front of the lenses
  for (let i = 0; i < 18; i += 1) {
    const h = hash3(i, 3, 7);
    const side = i % 2 === 0 ? -1 : 1;
    put(side * (0.5 + h * 2), (hash3(i, 1, 4) - 0.5) * 2.8, -1 - Math.floor(h * 3), 2);
  }

  return finalizeDefinition("spatial", "Spatial & Immersive Experiences", voxels, maxVoxels);
}

export const SPATIAL_DEFINITION = createSpatialDefinition();
