import type { VoxelDefinition, VoxelPoint } from "../types";
import { fillBox, fillLine, finalizeDefinition, pushVoxel, SPACING } from "./utils";

/**
 * Recognizable server-rack infrastructure.
 * Black racks · red active data / status paths.
 */
export function createEnterpriseDefinition(maxVoxels = 720): VoxelDefinition {
  const voxels: VoxelPoint[] = [];

  const buildRack = (ox: number, height = 12) => {
    fillBox(voxels, ox - 2, -6, -2, ox + 2, height - 6, 2, 0, { hollow: true });
    fillBox(voxels, ox - 2, -6, 2, ox - 2, height - 6, 2, 0);
    fillBox(voxels, ox + 2, -6, 2, ox + 2, height - 6, 2, 0);
    fillBox(voxels, ox - 2, -6, -2, ox + 2, height - 6, -2, 0);

    for (let m = 0; m < 6; m += 1) {
      const y0 = -5 + m * 2;
      const y1 = y0 + 1;
      fillBox(voxels, ox - 1, y0, -1, ox + 1, y1, 1, 0);
      for (let x = -1; x <= 1; x += 1) {
        pushVoxel(voxels, (ox + x) * SPACING, (y0 + 1) * SPACING, 2 * SPACING, 1);
      }
    }
  };

  buildRack(-7);
  buildRack(0);
  buildRack(7, 10);

  fillBox(voxels, -10, -7, -3, 10, -6, 3, 0);
  fillBox(voxels, -7, 6, -1, 0, 6, 1, 0);
  fillBox(voxels, 0, 5, -1, 7, 5, 1, 0);
  fillBox(voxels, -8, -7, 3, 8, -7, 4, 0);

  // Status light rows (red) - active modules
  for (const ox of [-7, 0, 7]) {
    for (let m = 0; m < 6; m += 1) {
      const y = -5 + m * 2;
      // Every module gets a small status LED; alternate stronger activity
      pushVoxel(voxels, (ox - 1) * SPACING, y * SPACING, 2 * SPACING, 2);
      if (m % 2 === 0) {
        pushVoxel(voxels, ox * SPACING, y * SPACING, 2 * SPACING, 2);
      }
    }
  }

  // Horizontal data planes through racks
  for (const y of [-3, 1, 3]) {
    fillLine(voxels, -8, y, 1, 8, y, 1, 2);
  }

  // Inter-rack data cables (red)
  fillLine(voxels, -5, 2, 2, -2, 2, 2, 2);
  fillLine(voxels, 2, 1, 2, 5, 1, 2, 2);
  fillLine(voxels, -3, 2, 2, -3, 6, 0, 2);
  fillLine(voxels, 3, 1, 2, 3, 5, 0, 2);
  fillLine(voxels, -3, 6, 0, 3, 5, 0, 2);

  // Active processing blocks
  fillBox(voxels, -1, 2, 0, 1, 3, 1, 2);
  fillBox(voxels, -8, -2, 0, -6, -1, 1, 2);
  fillBox(voxels, 6, 0, 0, 8, 1, 1, 2);

  // Underfloor trunk
  fillLine(voxels, -6, -7, 4, 6, -7, 4, 2);
  for (const x of [-6, 0, 6]) {
    fillLine(voxels, x, -7, 4, x, -6, 2, 2);
  }

  return finalizeDefinition("enterprise", "Enterprise Engineering", voxels, maxVoxels);
}

export const ENTERPRISE_DEFINITION = createEnterpriseDefinition();
