"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo } from "react";
import {
  createServiceDefinition,
  getServiceSculptureMeta,
  type ServiceSculptureId,
} from "@/components/voxel";

const VoxelScene = dynamic(() => import("@/components/voxel/VoxelSceneMount"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="grid grid-cols-6 gap-1 opacity-30">
        {Array.from({ length: 36 }).map((_, i) => (
          <span
            key={i}
            className="size-2.5 rounded-[2px] bg-ink"
            style={{ opacity: 0.2 + ((i * 17) % 50) / 100 }}
          />
        ))}
      </div>
    </div>
  ),
});

interface ServicesVoxelProps {
  serviceId: ServiceSculptureId;
  fallbackSrc: string;
  fallbackAlt: string;
  className?: string;
  /** Subtle yaw bias while hovering another service (radians). */
  hoverNudge?: number;
  showCaption?: boolean;
}

export function ServicesVoxel({
  serviceId,
  fallbackSrc,
  fallbackAlt,
  className,
  hoverNudge = 0,
  showCaption = true,
}: ServicesVoxelProps) {
  const meta = getServiceSculptureMeta(serviceId);
  const definition = useMemo(() => createServiceDefinition(serviceId, 720), [serviceId]);

  const fallback = (
    <div className="relative h-full w-full overflow-hidden bg-[#f5f3f1]">
      <Image
        src={fallbackSrc}
        alt={fallbackAlt}
        fill
        sizes="(max-width: 1023px) 100vw, 48vw"
        className="object-cover object-center opacity-90"
      />
      <div className="absolute inset-0 bg-[#f5f3f1]/40" />
    </div>
  );

  return (
    <VoxelScene
      definition={definition}
      label={showCaption ? meta.objectName : undefined}
      fallback={fallback}
      hoverNudge={hoverNudge}
      className={className}
      ariaLabel={`${meta.objectName} — interactive 3D illustration for ${meta.label}`}
    />
  );
}
