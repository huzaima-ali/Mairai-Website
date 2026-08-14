import type { VoxelDefinition, VoxelPoint } from "../types";
import { fillBox, finalizeDefinition, pushVoxel, SPACING, stampMiraiLogo } from "./utils";

/**
 * Recognizable laptop + ultra-slim smartphone (1 voxel thick).
 */
export function createDigitalProductsDefinition(maxVoxels = 720): VoxelDefinition {
  const voxels: VoxelPoint[] = [];

  // Laptop slightly left so the slim phone can breathe
  const lx = -1;

  fillBox(voxels, lx - 8, -6, 1, lx + 7, -4, 7, 0);
  fillBox(voxels, lx - 6, -4, 2, lx + 5, -4, 5, 1);
  for (let z = 2; z <= 5; z += 1) {
    for (let x = lx - 5; x <= lx + 4; x += 1) {
      if ((x + z) % 2 === 0) pushVoxel(voxels, x * SPACING, -4 * SPACING, z * SPACING, 0);
    }
  }
  fillBox(voxels, lx - 2, -4, 5, lx + 1, -4, 6, 0);
  for (let x = lx - 5; x <= lx + 4; x += 1) {
    pushVoxel(voxels, x * SPACING, -4 * SPACING, 1 * SPACING, 2);
  }

  for (let y = -3; y <= 7; y += 1) {
    const z = -1 - Math.floor((y + 3) * 0.2);
    for (let x = lx - 7; x <= lx + 6; x += 1) {
      const edge = x === lx - 7 || x === lx + 6 || y === -3 || y === 7;
      if (edge) {
        pushVoxel(voxels, x * SPACING, y * SPACING, z * SPACING, 0);
        pushVoxel(voxels, x * SPACING, y * SPACING, (z - 1) * SPACING, 0);
      }
    }
  }

  const sz = (y: number) => -1 - Math.floor((y + 3) * 0.2) + 1;
  for (let x = lx - 5; x <= lx + 4; x += 1) {
    pushVoxel(voxels, x * SPACING, 6 * SPACING, sz(6) * SPACING, 0);
  }
  fillBox(voxels, lx - 5, 0, sz(2), lx - 3, 4, sz(2), 0);
  fillBox(voxels, lx - 1, 0, sz(1), lx + 4, 2, sz(1), 0);

  fillBox(voxels, lx + 1, 0, sz(1), lx + 4, 1, sz(1), 2);
  fillBox(voxels, lx - 5, 6, sz(6), lx + 1, 6, sz(6), 2);
  fillBox(voxels, lx, 3, sz(3), lx + 4, 5, sz(3), 2);
  fillBox(voxels, lx - 5, 1, sz(2), lx - 2, 4, sz(2), 2);
  for (const [x, h] of [
    [lx + 1, 3],
    [lx + 2, 4],
    [lx + 3, 3],
    [lx + 4, 5],
  ] as const) {
    for (let y = 0; y < h; y += 1) {
      pushVoxel(voxels, x * SPACING, y * SPACING, sz(y) * SPACING, 2);
    }
  }

  stampMiraiLogo(voxels, lx - 4, 5, sz(5), 2);
  fillBox(voxels, lx - 7, -4, 0, lx + 6, -3, 1, 0);

  // Phone - exactly 1 voxel thick, spaced to the right
  const px = 11;
  const pz = 5;
  for (let y = -5; y <= 5; y += 1) {
    for (let x = px - 1; x <= px + 1; x += 1) {
      const edge = x === px - 1 || x === px + 1 || y === -5 || y === 5;
      pushVoxel(voxels, x * SPACING, y * SPACING, pz * SPACING, edge ? 0 : 1);
    }
  }
  // Screen UI on the same single plane
  pushVoxel(voxels, (px - 1) * SPACING, 4 * SPACING, pz * SPACING, 0);
  pushVoxel(voxels, px * SPACING, 4 * SPACING, pz * SPACING, 0);
  pushVoxel(voxels, (px + 1) * SPACING, 4 * SPACING, pz * SPACING, 0);
  fillBox(voxels, px - 1, -2, pz, px + 1, -1, pz, 2);
  stampMiraiLogo(voxels, px, 2, pz, 2, "sm");
  pushVoxel(voxels, px * SPACING, -5 * SPACING, pz * SPACING, 2);

  return finalizeDefinition("digital-products", "Digital Products & Platforms", voxels, maxVoxels);
}

export const DIGITAL_PRODUCTS_DEFINITION = createDigitalProductsDefinition();
