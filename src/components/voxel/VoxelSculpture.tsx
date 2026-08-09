"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { DEFAULT_INTERACTION } from "./config";
import { createAiProductsDefinition } from "./definitions/ai-products";
import type { InteractionConfig, QualityProfile, VoxelDebugConfig, VoxelDefinition } from "./types";
import { VoxelInstances } from "./VoxelInstances";
import { VoxelInteractionController } from "./VoxelInteractionController";
import { useVoxelInteraction } from "./useVoxelInteraction";

interface VoxelSculptureProps {
  definition?: VoxelDefinition;
  quality: QualityProfile;
  debug?: VoxelDebugConfig;
  interaction?: "repel";
  reducedMotion?: boolean;
  /** Subtle extra yaw while hovering an inactive service (does not morph). */
  hoverNudge?: number;
}

export function VoxelSculpture({
  definition: definitionProp,
  quality,
  debug,
  interaction: _interactionMode = "repel",
  reducedMotion = false,
  hoverNudge = 0,
}: VoxelSculptureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hoverNudgeRef = useRef(hoverNudge);
  hoverNudgeRef.current = hoverNudge;
  const definition = useMemo(() => {
    if (definitionProp) {
      if (definitionProp.voxels.length <= quality.maxVoxels) return definitionProp;
      return {
        ...definitionProp,
        voxels: definitionProp.voxels.slice(0, quality.maxVoxels),
      };
    }
    return createAiProductsDefinition(quality.maxVoxels);
  }, [definitionProp, quality.maxVoxels]);

  const interactionOverrides = useMemo<Partial<InteractionConfig>>(() => {
    if (!debug) return {};
    const next: Partial<InteractionConfig> = {};
    if (debug.interactionRadius != null) next.interactionRadius = debug.interactionRadius;
    if (debug.interactionStrength != null) next.interactionStrength = debug.interactionStrength;
    if (debug.returnSpeed != null) next.returnSpeed = debug.returnSpeed;
    if (debug.maxDisplacement != null) next.maxDisplacement = debug.maxDisplacement;
    if (debug.parallaxAmount != null) next.parallaxAmount = debug.parallaxAmount;
    if (debug.pulseStrength != null) next.pulseStrength = debug.pulseStrength;
    if (debug.idleStrength != null) next.idleStrength = debug.idleStrength;
    return next;
  }, [debug]);

  const { config, state, dragOrigin } = useVoxelInteraction(interactionOverrides);
  const mergedConfig = useMemo(
    () => ({
      ...DEFAULT_INTERACTION,
      ...config,
    }),
    [config],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.033);
    const s = state.current;

    if (!s.dragging) {
      const recover = 1 - Math.exp(-2.8 * dt);
      s.drag.x += (0 - s.drag.x) * recover;
      s.drag.y += (0 - s.drag.y) * recover;
    }

    const idleYaw =
      quality.enableIdle && !s.morphing
        ? Math.sin(performance.now() * 0.00015) * mergedConfig.idleDrift
        : 0;

    const nudge = s.morphing ? 0 : hoverNudgeRef.current;
    const targetRotX =
      s.drag.x + (quality.enableParallax && !s.morphing ? -s.parallax.y : 0) + nudge * 0.35;
    const targetRotY =
      s.drag.y +
      idleYaw +
      (quality.enableParallax && !s.morphing ? s.parallax.x : 0) +
      nudge;

    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetRotX, 6, dt);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetRotY, 6, dt);
  });

  return (
    <group ref={groupRef}>
      <VoxelInteractionController
        config={mergedConfig}
        quality={quality}
        stateRef={state}
        dragOrigin={dragOrigin}
        groupRef={groupRef}
      />
      <VoxelInstances
        definition={definition}
        interaction={mergedConfig}
        quality={quality}
        stateRef={state}
        voxelSize={debug?.voxelSize ?? definition.voxelSize}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}
