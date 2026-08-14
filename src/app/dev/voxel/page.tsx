"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  SERVICE_SCULPTURES,
  SHARED_CAMERA_DISTANCE,
  SHARED_VOXEL_SIZE,
  createServiceDefinition,
} from "@/components/voxel";
import type { ServiceSculptureId, VoxelDebugConfig } from "@/components/voxel";

const VoxelScene = dynamic(() => import("@/components/voxel/VoxelSceneMount"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
      Loading voxel scene…
    </div>
  ),
});

const IS_DEV = process.env.NODE_ENV === "development";

const DEFAULT_DEBUG: Required<VoxelDebugConfig> = {
  voxelSize: SHARED_VOXEL_SIZE,
  interactionRadius: 1.2,
  interactionStrength: 0.72,
  returnSpeed: 7.2,
  maxDisplacement: 0.32,
  parallaxAmount: 0.07,
  pulseStrength: 0.22,
  idleStrength: 0.012,
  cameraDistance: SHARED_CAMERA_DISTANCE,
};

export default function VoxelPrototypePage() {
  const [activeService, setActiveService] = useState<ServiceSculptureId>("ai-products");
  const [debug, setDebug] = useState(DEFAULT_DEBUG);

  const definition = useMemo(
    () => createServiceDefinition(activeService, 720),
    [activeService],
  );

  const activeMeta =
    SERVICE_SCULPTURES.find((entry) => entry.id === activeService) ?? SERVICE_SCULPTURES[0]!;

  return (
    <div className="min-h-dvh bg-[#ebe8e4] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Prototype / isolated</p>
            <h1 className="display text-3xl tracking-snug sm:text-4xl">Voxel Sculpture Lab</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              One persistent scene, six service definitions. Active:{" "}
              <span className="text-foreground">{activeMeta.label}</span>. Wired into the homepage
              Services section.
            </p>
          </div>
          <ul className="text-xs leading-relaxed text-muted-foreground sm:text-right">
            <li>Switch services to morph</li>
            <li>Move pointer to repel voxels</li>
            <li>Drag to rotate · click / tap to pulse</li>
          </ul>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {SERVICE_SCULPTURES.map((service, index) => {
            const active = service.id === activeService;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveService(service.id)}
                className={[
                  "shrink-0 rounded-full border px-3.5 py-2 text-left text-xs transition-colors",
                  active
                    ? "border-[#c7253e]/bg-[#c7253e] text-white"
                    : "border-black/[0.08] bg-white/70 text-foreground hover:bg-white",
                ].join(" ")}
              >
                <span className="mr-2 tabular-nums opacity-70">0{index + 1}</span>
                {service.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-black/[0.08] bg-[#f5f3f1] shadow-soft sm:aspect-[16/10] lg:min-h-[560px]">
            <VoxelScene
              definition={definition}
              label={activeMeta.objectName}
              debug={IS_DEV ? debug : undefined}
              className="absolute inset-0 h-full w-full"
            />
          </div>

          {IS_DEV ? (
            <aside className="rounded-[24px] border border-black/[0.08] bg-white/70 p-5">
              <h2 className="text-sm font-medium text-foreground">Debug controls</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Development only. Hidden in production builds.
              </p>
              <div className="mt-5 flex flex-col gap-4">
                {(
                  [
                    ["voxelSize", 0.1, 0.28, 0.005],
                    ["interactionRadius", 0.4, 2.5, 0.05],
                    ["interactionStrength", 0.2, 1.5, 0.05],
                    ["returnSpeed", 2, 12, 0.1],
                    ["maxDisplacement", 0.1, 1, 0.02],
                    ["parallaxAmount", 0, 0.2, 0.01],
                    ["pulseStrength", 0.05, 0.6, 0.01],
                    ["idleStrength", 0, 0.05, 0.001],
                    ["cameraDistance", 3, 7, 0.05],
                  ] as const
                ).map(([key, min, max, step]) => (
                  <label key={key} className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center justify-between gap-3">
                      <span>{key}</span>
                      <span className="tabular-nums text-foreground">{debug[key].toFixed(3)}</span>
                    </span>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={debug[key]}
                      onChange={(event) =>
                        setDebug((current) => ({
                          ...current,
                          [key]: Number(event.target.value),
                        }))
                      }
                      className="w-full accent-[#c7253e]"
                    />
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setDebug(DEFAULT_DEBUG)}
                  className="mt-2 rounded-full border border-black/[0.08] px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-black/[0.03]"
                >
                  Reset defaults
                </button>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
