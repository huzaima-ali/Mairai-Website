import type { VoxelDefinition, VoxelPoint } from "../types";
import { fillBox, fillLine, finalizeDefinition, pushVoxel, SPACING } from "./utils";

/**
 * Recognizable AI processor / microchip facing the camera.
 * Black hardware chassis + red intelligence core & circuit paths.
 */
export function createAiProductsDefinition(maxVoxels = 720): VoxelDefinition {
  const voxels: VoxelPoint[] = [];

  // Main square package (clear plate)
  fillBox(voxels, -6, -6, 0, 6, 6, 1, 0);
  // Raised rim
  fillBox(voxels, -6, -6, 2, 6, 6, 2, 0, {
    skip: (x, y) => Math.abs(x) < 5 && Math.abs(y) < 5,
  });

  // Central die pocket (black)
  fillBox(voxels, -3, -3, 2, 3, 3, 3, 0);

  // Red computational core
  fillBox(voxels, -2, -2, 3, 2, 2, 4, 2);
  fillBox(voxels, -1, -1, 4, 1, 1, 5, 2);

  // Surface circuit traces (red) - clear paths to edges
  const traces: Array<[number, number, number, number, number, number]> = [
    [0, 2, 4, 0, 5, 2],
    [0, -2, 4, 0, -5, 2],
    [2, 0, 4, 5, 0, 2],
    [-2, 0, 4, -5, 0, 2],
    [2, 2, 4, 5, 5, 2],
    [-2, 2, 4, -5, 5, 2],
    [2, -2, 4, 5, -5, 2],
    [-2, -2, 4, -5, -5, 2],
  ];
  for (const t of traces) fillLine(voxels, ...t, 2);

  // Secondary trace spurs
  fillLine(voxels, 3, 1, 2, 5, 1, 2, 2);
  fillLine(voxels, -3, -1, 2, -5, -1, 2, 2);
  fillLine(voxels, 1, 3, 2, 1, 5, 2, 2);
  fillLine(voxels, -1, -3, 2, -1, -5, 2, 2);

  // Active I/O pads (red) at mid-edges
  for (const [x, y] of [
    [6, 0],
    [-6, 0],
    [0, 6],
    [0, -6],
    [6, 3],
    [-6, -3],
    [3, 6],
    [-3, -6],
  ] as const) {
    pushVoxel(voxels, x * SPACING, y * SPACING, 2 * SPACING, 2);
  }

  // Pin grid around package - gap between body and pins for readability
  for (let i = -5; i <= 5; i += 2) {
    fillBox(voxels, i, 8, -1, i, 9, 1, 0);
    fillBox(voxels, i, -9, -1, i, -8, 1, 0);
    fillBox(voxels, 8, i, -1, 9, i, 1, 0);
    fillBox(voxels, -9, i, -1, -8, i, 1, 0);
  }

  return finalizeDefinition("ai-products", "AI Products & Agents", voxels, maxVoxels);
}

export const AI_PRODUCTS_DEFINITION = createAiProductsDefinition();
