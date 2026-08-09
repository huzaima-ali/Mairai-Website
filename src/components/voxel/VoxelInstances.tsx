"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  TRANSITION_DURATION,
  TRANSITION_DURATION_REDUCED,
  VOXEL_COLORS,
} from "./config";
import { dispersedPosition } from "./definitions/utils";
import type { InteractionConfig, QualityProfile, VoxelDefinition } from "./types";
import type { VoxelInteractionState } from "./useVoxelInteraction";

interface VoxelInstancesProps {
  definition: VoxelDefinition;
  interaction: InteractionConfig;
  quality: QualityProfile;
  stateRef: React.MutableRefObject<VoxelInteractionState>;
  voxelSize?: number;
  reducedMotion?: boolean;
}

const _object = new THREE.Object3D();
const _color = new THREE.Color();
const _fromColor = new THREE.Color();
const _toColor = new THREE.Color();
const _dispersed = { x: 0, y: 0, z: 0 };
const TONE_COLORS = [VOXEL_COLORS.dark, VOXEL_COLORS.mid, VOXEL_COLORS.accent] as const;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function VoxelInstances({
  definition,
  interaction,
  quality,
  stateRef,
  voxelSize,
  reducedMotion = false,
}: VoxelInstancesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const size = voxelSize ?? definition.voxelSize;
  const capacity = quality.maxVoxels;
  const definitionIdRef = useRef<string | null>(null);

  const buffers = useMemo(() => {
    const rest = new Float32Array(capacity * 3);
    const current = new Float32Array(capacity * 3);
    const from = new Float32Array(capacity * 3);
    const target = new Float32Array(capacity * 3);
    const disperse = new Float32Array(capacity * 3);
    const scales = new Float32Array(capacity);
    const fromScale = new Float32Array(capacity);
    const targetScale = new Float32Array(capacity);
    const tones = new Uint8Array(capacity);
    const fromTones = new Uint8Array(capacity);
    const targetTones = new Uint8Array(capacity);
    const orbit = new Uint8Array(capacity);
    const orbitRadius = new Float32Array(capacity);
    const orbitSpeed = new Float32Array(capacity);
    const orbitPhase = new Float32Array(capacity);
    const active = new Uint8Array(capacity);

    for (let i = 0; i < capacity; i += 1) {
      dispersedPosition(i, _dispersed);
      const i3 = i * 3;
      disperse[i3] = _dispersed.x;
      disperse[i3 + 1] = _dispersed.y;
      disperse[i3 + 2] = _dispersed.z;
      scales[i] = 0;
      fromScale[i] = 0;
      targetScale[i] = 0;
    }

    return {
      rest,
      current,
      from,
      target,
      disperse,
      scales,
      fromScale,
      targetScale,
      tones,
      fromTones,
      targetTones,
      orbit,
      orbitRadius,
      orbitSpeed,
      orbitPhase,
      active,
    };
  }, [capacity]);

  const morph = useRef({
    active: 0,
    start: 0,
    duration: TRANSITION_DURATION,
    colorBlend: 0,
  });

  useLayoutEffect(() => {
    definitionIdRef.current = null;
  }, [capacity]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const isFirst = definitionIdRef.current === null;
    const same = definitionIdRef.current === definition.id;
    if (same) return;

    const voxels = definition.voxels;
    const count = Math.min(voxels.length, capacity);

    for (let i = 0; i < capacity; i += 1) {
      const i3 = i * 3;
      buffers.from[i3] = buffers.current[i3] ?? 0;
      buffers.from[i3 + 1] = buffers.current[i3 + 1] ?? 0;
      buffers.from[i3 + 2] = buffers.current[i3 + 2] ?? 0;
      buffers.fromScale[i] = buffers.scales[i] ?? 0;
      buffers.fromTones[i] = buffers.tones[i] ?? 0;

      if (i < count) {
        const voxel = voxels[i]!;
        buffers.target[i3] = voxel.x;
        buffers.target[i3 + 1] = voxel.y;
        buffers.target[i3 + 2] = voxel.z;
        buffers.targetScale[i] = 1;
        buffers.targetTones[i] = voxel.tone;
        buffers.orbit[i] = voxel.orbit ? 1 : 0;
        buffers.orbitRadius[i] = voxel.orbitRadius ?? 0;
        buffers.orbitSpeed[i] = voxel.orbitSpeed ?? 0;
        buffers.orbitPhase[i] = voxel.orbitPhase ?? 0;
        buffers.active[i] = 1;
      } else {
        buffers.target[i3] = buffers.disperse[i3] ?? 0;
        buffers.target[i3 + 1] = buffers.disperse[i3 + 1] ?? 0;
        buffers.target[i3 + 2] = buffers.disperse[i3 + 2] ?? 0;
        buffers.targetScale[i] = 0;
        buffers.targetTones[i] = 0;
        buffers.orbit[i] = 0;
        buffers.orbitRadius[i] = 0;
        buffers.orbitSpeed[i] = 0;
        buffers.orbitPhase[i] = 0;
        buffers.active[i] = 0;
      }
    }

    definitionIdRef.current = definition.id;

    if (isFirst || reducedMotion) {
      for (let i = 0; i < capacity; i += 1) {
        const i3 = i * 3;
        buffers.rest[i3] = buffers.target[i3] ?? 0;
        buffers.rest[i3 + 1] = buffers.target[i3 + 1] ?? 0;
        buffers.rest[i3 + 2] = buffers.target[i3 + 2] ?? 0;
        buffers.current[i3] = buffers.rest[i3] ?? 0;
        buffers.current[i3 + 1] = buffers.rest[i3 + 1] ?? 0;
        buffers.current[i3 + 2] = buffers.rest[i3 + 2] ?? 0;
        buffers.scales[i] = buffers.targetScale[i] ?? 0;
        buffers.tones[i] = buffers.targetTones[i] ?? 0;
        _color.set(TONE_COLORS[buffers.tones[i] ?? 0] ?? VOXEL_COLORS.dark);
        mesh.setColorAt(i, _color);
        _object.position.set(
          buffers.current[i3] ?? 0,
          buffers.current[i3 + 1] ?? 0,
          buffers.current[i3 + 2] ?? 0,
        );
        _object.scale.setScalar(size * (buffers.scales[i] ?? 0));
        _object.updateMatrix();
        mesh.setMatrixAt(i, _object.matrix);
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.instanceMatrix.needsUpdate = true;
      morph.current.active = 0;
      stateRef.current.morphing = false;
      return;
    }

    morph.current.active = 1;
    morph.current.start = -1;
    morph.current.duration = reducedMotion ? TRANSITION_DURATION_REDUCED : TRANSITION_DURATION;
    morph.current.colorBlend = 0;
    stateRef.current.morphing = true;
    stateRef.current.pointer.active = 0;
    stateRef.current.pulse.active = 0;
  }, [buffers, capacity, definition, reducedMotion, size, stateRef]);

  useFrame((frame, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dt = Math.min(delta, 0.033);
    const t = frame.clock.elapsedTime;
    const fx = stateRef.current;
    const damp = 1 - Math.exp(-interaction.returnSpeed * dt);

    if (morph.current.active && morph.current.start < 0) {
      morph.current.start = t;
    }

    let morphing = morph.current.active > 0.5;
    let morphU = 0;

    if (morphing) {
      morphU = THREE.MathUtils.clamp((t - morph.current.start) / morph.current.duration, 0, 1);
      if (morphU >= 1) {
        morph.current.active = 0;
        morphing = false;
        fx.morphing = false;
        for (let i = 0; i < capacity; i += 1) {
          const i3 = i * 3;
          buffers.rest[i3] = buffers.target[i3] ?? 0;
          buffers.rest[i3 + 1] = buffers.target[i3 + 1] ?? 0;
          buffers.rest[i3 + 2] = buffers.target[i3 + 2] ?? 0;
          buffers.tones[i] = buffers.targetTones[i] ?? 0;
          _color.set(TONE_COLORS[buffers.tones[i] ?? 0] ?? VOXEL_COLORS.dark);
          mesh.setColorAt(i, _color);
        }
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }
    }

    const allowInteraction = !morphing;
    const colorPhase = morphing ? smoothstep(0.42, 0.72, morphU) : 1;
    if (morphing && Math.abs(colorPhase - morph.current.colorBlend) > 0.04) {
      morph.current.colorBlend = colorPhase;
      for (let i = 0; i < capacity; i += 1) {
        _fromColor.set(TONE_COLORS[buffers.fromTones[i] ?? 0] ?? VOXEL_COLORS.dark);
        _toColor.set(TONE_COLORS[buffers.targetTones[i] ?? 0] ?? VOXEL_COLORS.dark);
        _color.copy(_fromColor).lerp(_toColor, colorPhase);
        mesh.setColorAt(i, _color);
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    for (let i = 0; i < capacity; i += 1) {
      const i3 = i * 3;
      let tx = 0;
      let ty = 0;
      let tz = 0;
      let targetScale = buffers.targetScale[i] ?? 0;

      if (morphing) {
        const fromX = buffers.from[i3] ?? 0;
        const fromY = buffers.from[i3 + 1] ?? 0;
        const fromZ = buffers.from[i3 + 2] ?? 0;
        const toX = buffers.target[i3] ?? 0;
        const toY = buffers.target[i3 + 1] ?? 0;
        const toZ = buffers.target[i3 + 2] ?? 0;
        const dX = buffers.disperse[i3] ?? 0;
        const dY = buffers.disperse[i3 + 1] ?? 0;
        const dZ = buffers.disperse[i3 + 2] ?? 0;

        // Phase 1: loosen outward from sculpture center.
        const loosen = smoothstep(0, 0.22, morphU) * (1 - smoothstep(0.18, 0.4, morphU));
        const len = Math.sqrt(fromX * fromX + fromY * fromY + fromZ * fromZ) || 1;
        const looseX = fromX + (fromX / len) * 0.22 * loosen;
        const looseY = fromY + (fromY / len) * 0.22 * loosen;
        const looseZ = fromZ + (fromZ / len) * 0.22 * loosen;

        // Phase 2: disperse through intermediate cloud.
        const disperseAmt = easeInOutCubic(smoothstep(0.12, 0.48, morphU));
        const midX = looseX + (dX - looseX) * disperseAmt;
        const midY = looseY + (dY - looseY) * disperseAmt;
        const midZ = looseZ + (dZ - looseZ) * disperseAmt;

        // Phase 3–4: assemble into the new sculpture and settle.
        const assemble = easeInOutCubic(smoothstep(0.42, 0.95, morphU));
        tx = midX + (toX - midX) * assemble;
        ty = midY + (toY - midY) * assemble;
        tz = midZ + (toZ - midZ) * assemble;

        const fromS = buffers.fromScale[i] ?? 0;
        const toS = buffers.targetScale[i] ?? 0;
        const midS = Math.max(fromS, toS) * 0.72 + 0.08;
        if (morphU < 0.45) {
          targetScale = fromS + (midS - fromS) * disperseAmt;
        } else {
          targetScale = midS + (toS - midS) * assemble;
        }
      } else {
        tx = buffers.rest[i3] ?? 0;
        ty = buffers.rest[i3 + 1] ?? 0;
        tz = buffers.rest[i3 + 2] ?? 0;
        targetScale = buffers.targetScale[i] ?? 0;

        if (buffers.active[i]) {
          if (buffers.orbit[i]) {
            const radius = buffers.orbitRadius[i] ?? 1;
            const speed = buffers.orbitSpeed[i] ?? 0.2;
            const phase = buffers.orbitPhase[i] ?? 0;
            const angle = phase + t * speed * (quality.enableIdle ? 1 : 0);
            tx = Math.cos(angle) * radius;
            tz = Math.sin(angle) * radius;
            ty = (buffers.rest[i3 + 1] ?? 0) + Math.sin(t * 0.6 + phase) * 0.04;
          } else if (quality.enableIdle) {
            const idle = interaction.idleStrength;
            tx += Math.sin(t * 0.7 + i * 0.13) * idle;
            ty += Math.cos(t * 0.55 + i * 0.09) * idle * 1.2;
            tz += Math.sin(t * 0.45 + i * 0.17) * idle;
          }

          if (allowInteraction && quality.enableRepel && fx.pointer.active > 0.5) {
            const dx = tx - fx.pointer.x;
            const dy = ty - fx.pointer.y;
            const dz = tz - fx.pointer.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
            if (dist < interaction.interactionRadius) {
              const falloff = 1 - dist / interaction.interactionRadius;
              const isRed = (buffers.tones[i] ?? 0) === 2;
              // Red = active digital layer: slightly stronger displacement + tiny scale lift.
              const redBoost = isRed ? 1.16 : 1;
              const force =
                falloff *
                falloff *
                interaction.interactionStrength *
                interaction.maxDisplacement *
                redBoost;
              const inv = force / dist;
              tx += dx * inv;
              ty += dy * inv * 1.05;
              tz += dz * inv;
              if (isRed) {
                targetScale = Math.max(targetScale, 1 + falloff * 0.08);
              }
            }
          }

          if (allowInteraction && quality.enablePulse && fx.pulse.active > 0.5) {
            const elapsed = t - fx.pulse.start;
            const duration = interaction.pulseDuration;
            if (elapsed >= 0 && elapsed <= duration) {
              const dx = (buffers.rest[i3] ?? 0) - fx.pulse.x;
              const dy = (buffers.rest[i3 + 1] ?? 0) - fx.pulse.y;
              const dz = (buffers.rest[i3 + 2] ?? 0) - fx.pulse.z;
              const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
              const wave = elapsed * 2.8;
              const band = Math.abs(dist - wave);
              if (band < 0.55) {
                const envelope = Math.sin((1 - elapsed / duration) * Math.PI);
                const influence = (1 - band / 0.55) * envelope;
                const push = influence * interaction.pulseStrength;
                const inv = dist > 0.0001 ? push / dist : 0;
                tx += dx * inv;
                ty += dy * inv;
                tz += dz * inv;
                targetScale = 1 + influence * interaction.pulseScale;
              }
            } else if (elapsed > duration) {
              fx.pulse.active = 0;
            }
          }
        }
      }

      const morphDamp = morphing ? 1 - Math.exp(-14 * dt) : damp;
      const cx = buffers.current[i3] ?? tx;
      const cy = buffers.current[i3 + 1] ?? ty;
      const cz = buffers.current[i3 + 2] ?? tz;
      const nx = cx + (tx - cx) * morphDamp;
      const ny = cy + (ty - cy) * morphDamp;
      const nz = cz + (tz - cz) * morphDamp;
      buffers.current[i3] = nx;
      buffers.current[i3 + 1] = ny;
      buffers.current[i3 + 2] = nz;

      const prevScale = buffers.scales[i] ?? 0;
      const nextScale = prevScale + (targetScale - prevScale) * morphDamp;
      buffers.scales[i] = nextScale;

      _object.position.set(nx, ny, nz);
      _object.scale.setScalar(size * Math.max(nextScale, 0));
      _object.updateMatrix();
      mesh.setMatrixAt(i, _object.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, capacity]}
      castShadow={false}
      receiveShadow={false}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" roughness={0.58} metalness={0.06} />
    </instancedMesh>
  );
}
