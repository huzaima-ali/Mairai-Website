import type { ServiceSculptureId, VoxelDefinition } from "../types";
import { createAiProductsDefinition } from "./ai-products";
import { createDigitalProductsDefinition } from "./digital-products";
import { createDigitalTwinsDefinition } from "./digital-twins";
import { createEnterpriseDefinition } from "./enterprise";
import { createProductDesignDefinition } from "./product-design";
import { createSpatialDefinition } from "./spatial";

export interface ServiceSculptureMeta {
  id: ServiceSculptureId;
  label: string;
  /** Short object name shown on the voxel panel caption. */
  objectName: string;
  create: (maxVoxels?: number) => VoxelDefinition;
}

export const SERVICE_SCULPTURES: ServiceSculptureMeta[] = [
  {
    id: "ai-products",
    label: "AI Products & Agents",
    objectName: "AI Processor",
    create: createAiProductsDefinition,
  },
  {
    id: "digital-products",
    label: "Digital Products & Platforms",
    objectName: "Laptop & Phone",
    create: createDigitalProductsDefinition,
  },
  {
    id: "digital-twins",
    label: "Digital Twins & Real-Time 3D",
    objectName: "Digital Twin Tower",
    create: createDigitalTwinsDefinition,
  },
  {
    id: "product-design",
    label: "Product Design & Brand Systems",
    objectName: "Design Workspace",
    create: createProductDesignDefinition,
  },
  {
    id: "spatial",
    label: "Spatial & Immersive Experiences",
    objectName: "VR Headset",
    create: createSpatialDefinition,
  },
  {
    id: "enterprise",
    label: "Enterprise Engineering",
    objectName: "Server Racks",
    create: createEnterpriseDefinition,
  },
];

const creators: Record<ServiceSculptureId, (maxVoxels?: number) => VoxelDefinition> = {
  "ai-products": createAiProductsDefinition,
  "digital-products": createDigitalProductsDefinition,
  "digital-twins": createDigitalTwinsDefinition,
  "product-design": createProductDesignDefinition,
  spatial: createSpatialDefinition,
  enterprise: createEnterpriseDefinition,
};

export function createServiceDefinition(
  id: ServiceSculptureId,
  maxVoxels = 520,
): VoxelDefinition {
  return creators[id](maxVoxels);
}

export function getServiceSculptureMeta(id: ServiceSculptureId): ServiceSculptureMeta {
  const meta = SERVICE_SCULPTURES.find((entry) => entry.id === id);
  if (!meta) return SERVICE_SCULPTURES[0]!;
  return meta;
}
