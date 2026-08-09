import type { VoxelDefinition, VoxelPoint } from "../types";
import { fillBox, fillLine, finalizeDefinition, pushVoxel, SPACING } from "./utils";

/**
 * Recognizable modern skyscraper with clear floor plates + digital-twin scan layer.
 * Black = physical building · Red = digitization / twin data.
 */
export function createDigitalTwinsDefinition(maxVoxels = 720): VoxelDefinition {
  const voxels: VoxelPoint[] = [];

  const w = 5;
  const d = 4;
  const floors = 7; // explicit storeys
  const floorHeight = 2; // slab + window band
  const h = floors * floorHeight;

  // Plaza + podium
  fillBox(voxels, -7, -2, -5, 7, -2, 5, 0);
  fillBox(voxels, -6, -1, -4, 6, 0, 4, 0);

  for (let floor = 0; floor < floors; floor += 1) {
    const y0 = 1 + floor * floorHeight; // slab
    const y1 = y0 + 1; // window band
    const taper = floor >= floors - 2 ? 1 : 0;

    const xMinPhys = -w + taper;
    const xMaxPhys = 1;
    const zMin = -d + taper;
    const zMax = d - taper;

    // --- Physical floors (full slabs so storeys read clearly) ---
    for (let x = xMinPhys; x <= xMaxPhys; x += 1) {
      for (let z = zMin; z <= zMax; z += 1) {
        pushVoxel(voxels, x * SPACING, y0 * SPACING, z * SPACING, 1);
      }
    }

    // Window band shell with punched openings
    for (let x = xMinPhys; x <= xMaxPhys; x += 1) {
      for (let z = zMin; z <= zMax; z += 1) {
        const shell = x === xMinPhys || x === xMaxPhys || z === zMin || z === zMax;
        if (!shell) continue;

        const frontWindow =
          z === zMax && x > xMinPhys && x < xMaxPhys && x % 2 === 0;
        const sideWindow =
          x === xMinPhys && z > zMin && z < zMax && z % 2 === 0;
        if (frontWindow || sideWindow) continue;

        pushVoxel(voxels, x * SPACING, y1 * SPACING, z * SPACING, 0);
      }
    }

    // Structural columns at corners (continuous vertical read)
    for (const [cx, cz] of [
      [xMinPhys, zMin],
      [xMinPhys, zMax],
      [xMaxPhys, zMin],
      [xMaxPhys, zMax],
    ] as const) {
      pushVoxel(voxels, cx * SPACING, y1 * SPACING, cz * SPACING, 0);
    }

    // --- Digital twin zone (right): red floor outlines + façade reconstruction ---
    const xMinTwin = 2;
    const xMaxTwin = w - taper;
    for (let x = xMinTwin; x <= xMaxTwin; x += 1) {
      for (let z = zMin; z <= zMax; z += 1) {
        const onEdge = x === xMaxTwin || z === zMin || z === zMax || x === xMinTwin;
        // Floor plate outline only
        if (onEdge) {
          pushVoxel(voxels, x * SPACING, y0 * SPACING, z * SPACING, 2);
        }
        // Window-band wire on outer edges
        if (x === xMaxTwin || z === zMax || z === zMin) {
          pushVoxel(voxels, x * SPACING, y1 * SPACING, z * SPACING, 2);
        }
      }
    }

    if (floor % 2 === 0) {
      pushVoxel(voxels, (w + 1) * SPACING, y1 * SPACING, 2 * SPACING, 2);
      pushVoxel(voxels, (w + 2) * SPACING, y0 * SPACING, 0, 2);
    }
  }

  // Roof slab + crown
  for (let x = -w + 1; x <= 1; x += 1) {
    for (let z = -d + 1; z <= d - 1; z += 1) {
      pushVoxel(voxels, x * SPACING, (h + 1) * SPACING, z * SPACING, 0);
    }
  }
  fillBox(voxels, -2, h + 2, -2, 1, h + 3, 2, 0);
  pushVoxel(voxels, 0, (h + 4) * SPACING, 0, 0);

  // Vertical red scanning seam
  for (let y = 1; y <= h + 1; y += 1) {
    for (let z = -d; z <= d; z += 1) {
      if (Math.abs(z) === d && y % 2 === 0) continue;
      pushVoxel(voxels, 1.5 * SPACING, y * SPACING, z * SPACING, 2);
    }
  }

  fillLine(voxels, 3, h, 0, 6, h + 2, 2, 2);

  return finalizeDefinition("digital-twins", "Digital Twins & Real-Time 3D", voxels, maxVoxels);
}

export const DIGITAL_TWINS_DEFINITION = createDigitalTwinsDefinition();
