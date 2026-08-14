import type { VoxelDefinition, VoxelPoint } from "../types";
import { fillBox, finalizeDefinition, pushVoxel, SPACING, stampMiraiLogo } from "./utils";

/**
 * Recognizable desktop monitor with a product-design workspace UI.
 * Black chassis + red selected / designed elements.
 */
export function createProductDesignDefinition(maxVoxels = 720): VoxelDefinition {
  const voxels: VoxelPoint[] = [];
  const screenZ = (x: number) => -1 - Math.floor((x + 8) * 0.08);

  // Monitor chassis - solid bezel + backplate, open canvas for UI
  for (let y = -5; y <= 6; y += 1) {
    for (let x = -8; x <= 8; x += 1) {
      const z = screenZ(x);
      const edge = x === -8 || x === 8 || y === -5 || y === 6;
      if (edge) {
        pushVoxel(voxels, x * SPACING, y * SPACING, z * SPACING, 0);
        pushVoxel(voxels, x * SPACING, y * SPACING, (z - 1) * SPACING, 0);
      } else if (y > -4 && y < 6 && x > -7 && x < 7) {
        // Sparse dark canvas grid (not a solid fill)
        if ((x + y) % 3 === 0) {
          pushVoxel(voxels, x * SPACING, y * SPACING, (z + 1) * SPACING, 1);
        }
      } else {
        pushVoxel(voxels, x * SPACING, y * SPACING, z * SPACING, 0);
      }
    }
  }

  // Chin, neck, base - restore physical mass
  fillBox(voxels, -3, -5, -2, 3, -5, 1, 0);
  fillBox(voxels, -1, -8, -1, 1, -6, 2, 0);
  fillBox(voxels, -5, -9, -2, 5, -8, 3, 0);
  fillBox(voxels, -8, -5, -2, 8, -5, 0, 0);
  // Rear housing depth
  for (let y = -4; y <= 5; y += 1) {
    for (let x = -7; x <= 7; x += 2) {
      pushVoxel(voxels, x * SPACING, y * SPACING, (screenZ(x) - 2) * SPACING, 0);
    }
  }

  // Workspace chrome
  for (let x = -6; x <= 6; x += 1) {
    pushVoxel(voxels, x * SPACING, 5 * SPACING, (screenZ(x) + 1) * SPACING, 0);
  }
  for (let y = -3; y <= 4; y += 1) {
    pushVoxel(voxels, -6 * SPACING, y * SPACING, (screenZ(-6) + 1) * SPACING, 0);
    pushVoxel(voxels, -5 * SPACING, y * SPACING, (screenZ(-5) + 1) * SPACING, 0);
    // Tool icons column
    if (y % 2 === 0) {
      pushVoxel(voxels, -6 * SPACING, y * SPACING, (screenZ(-6) + 1) * SPACING, 0);
    }
  }

  // Content cards (black)
  for (let x = -3; x <= 1; x += 1) {
    for (let y = 1; y <= 3; y += 1) {
      pushVoxel(voxels, x * SPACING, y * SPACING, (screenZ(x) + 1) * SPACING, 0);
    }
  }
  for (let x = -3; x <= 5; x += 1) {
    for (let y = -2; y <= 0; y += 1) {
      pushVoxel(voxels, x * SPACING, y * SPACING, (screenZ(x) + 1) * SPACING, 0);
    }
  }
  // Right inspector panel
  for (let x = 4; x <= 6; x += 1) {
    for (let y = -3; y <= 4; y += 1) {
      pushVoxel(voxels, x * SPACING, y * SPACING, (screenZ(x) + 1) * SPACING, 0);
    }
  }

  // Red design activity layer - selected component + system accents
  for (let x = -2; x <= 4; x += 1) {
    for (let y = -1; y <= 4; y += 1) {
      pushVoxel(voxels, x * SPACING, y * SPACING, (screenZ(x) + 1) * SPACING, 2);
    }
  }
  // Primary button
  for (let x = -3; x <= 0; x += 1) {
    for (let y = -2; y <= -1; y += 1) {
      pushVoxel(voxels, x * SPACING, y * SPACING, (screenZ(x) + 1) * SPACING, 2);
    }
  }
  // Active sidebar tools
  for (let x = -6; x <= -5; x += 1) {
    for (let y = 0; y <= 4; y += 1) {
      if (y % 2 === 0) {
        pushVoxel(voxels, x * SPACING, y * SPACING, (screenZ(x) + 1) * SPACING, 2);
      }
    }
  }
  // Brand swatch + inspector active fields
  for (let x = 4; x <= 6; x += 1) {
    for (let y = -3; y <= -1; y += 1) {
      pushVoxel(voxels, x * SPACING, y * SPACING, (screenZ(x) + 1) * SPACING, 2);
    }
    pushVoxel(voxels, x * SPACING, 2 * SPACING, (screenZ(x) + 1) * SPACING, 2);
    pushVoxel(voxels, x * SPACING, 3 * SPACING, (screenZ(x) + 1) * SPACING, 2);
  }
  // Header active tab
  for (let x = -5; x <= 0; x += 1) {
    pushVoxel(voxels, x * SPACING, 5 * SPACING, (screenZ(x) + 1) * SPACING, 2);
  }

  // Mirai logo mark in the workspace header / brand area
  stampMiraiLogo(voxels, -4, 3, screenZ(-4) + 1, 2);
  // Selection handles above the canvas
  for (const [x, y] of [
    [-1, 4],
    [3, 4],
    [-1, 0],
    [3, 0],
  ] as const) {
    pushVoxel(voxels, x * SPACING, y * SPACING, (screenZ(x) + 2) * SPACING, 2);
  }

  return finalizeDefinition("product-design", "Product Design & Brand Systems", voxels, maxVoxels);
}

export const PRODUCT_DESIGN_DEFINITION = createProductDesignDefinition();
