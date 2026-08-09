"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { InteractionConfig, QualityProfile } from "./types";
import type { VoxelInteractionState } from "./useVoxelInteraction";

interface VoxelInteractionControllerProps {
  config: InteractionConfig;
  quality: QualityProfile;
  stateRef: React.MutableRefObject<VoxelInteractionState>;
  dragOrigin: React.MutableRefObject<{ x: number; y: number; rotX: number; rotY: number }>;
  groupRef: React.RefObject<THREE.Group | null>;
}

const _ndc = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();
const _plane = new THREE.Plane();
const _hit = new THREE.Vector3();
const _local = new THREE.Vector3();
const _origin = new THREE.Vector3(0, 0, 0);
const _normal = new THREE.Vector3();

/**
 * Bridges DOM pointer events into mutable interaction state consumed by the render loop.
 * Avoids React state updates on every move.
 * Touch: allows vertical page scroll unless the gesture is clearly a model drag.
 */
export function VoxelInteractionController({
  config,
  quality,
  stateRef,
  dragOrigin,
  groupRef,
}: VoxelInteractionControllerProps) {
  const { gl, camera, clock } = useThree();
  const scratch = useRef({
    downX: 0,
    downY: 0,
    pointerId: -1,
    pending: false,
    dragArmed: false,
    isTouch: false,
  });

  useEffect(() => {
    const el = gl.domElement;
    const state = stateRef.current;
    el.style.touchAction = "pan-y";

    const projectPointer = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      _ndc.set(x, y);
      _raycaster.setFromCamera(_ndc, camera);

      camera.getWorldDirection(_normal);
      _plane.setFromNormalAndCoplanarPoint(_normal, _origin);

      if (_raycaster.ray.intersectPlane(_plane, _hit)) {
        const group = groupRef.current;
        if (group) {
          _local.copy(_hit);
          group.worldToLocal(_local);
          state.pointer.x = _local.x;
          state.pointer.y = _local.y;
          state.pointer.z = _local.z;
        } else {
          state.pointer.x = _hit.x;
          state.pointer.y = _hit.y;
          state.pointer.z = _hit.z;
        }
      }

      if (quality.enableParallax && !state.dragging && !state.morphing) {
        state.parallax.x = x * config.parallaxAmount;
        state.parallax.y = y * config.parallaxAmount;
      }
    };

    const armDrag = (clientX: number, clientY: number, pointerId: number) => {
      if (!quality.enableDrag || state.morphing) return;
      scratch.current.dragArmed = true;
      state.dragging = true;
      state.drag.active = 1;
      dragOrigin.current = {
        x: clientX,
        y: clientY,
        rotX: state.drag.x,
        rotY: state.drag.y,
      };
      try {
        el.setPointerCapture(pointerId);
      } catch {
        // ignore
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      // Mouse / pen: continuous repel while over the canvas
      if (!scratch.current.isTouch) {
        projectPointer(event.clientX, event.clientY);
        if (quality.enableRepel && !state.morphing) {
          state.pointer.active = 1;
        }
      }

      if (!scratch.current.pending && !scratch.current.dragArmed) return;

      const dx = event.clientX - scratch.current.downX;
      const dy = event.clientY - scratch.current.downY;
      const dist = Math.hypot(dx, dy);

      if (scratch.current.pending && !scratch.current.dragArmed) {
        if (dist < 10) return;

        // Touch: vertical-dominant movement = page scroll, do not capture.
        if (scratch.current.isTouch && Math.abs(dy) > Math.abs(dx) * 1.15) {
          scratch.current.pending = false;
          return;
        }

        armDrag(scratch.current.downX, scratch.current.downY, event.pointerId);
      }

      if (state.dragging && quality.enableDrag && !state.morphing) {
        if (scratch.current.isTouch) {
          projectPointer(event.clientX, event.clientY);
        }
        const dragDx = event.clientX - dragOrigin.current.x;
        const dragDy = event.clientY - dragOrigin.current.y;
        state.drag.y = THREE.MathUtils.clamp(
          dragOrigin.current.rotY + dragDx * config.dragSensitivity,
          -config.dragLimitY,
          config.dragLimitY,
        );
        state.drag.x = THREE.MathUtils.clamp(
          dragOrigin.current.rotX + dragDy * config.dragSensitivity,
          -config.dragLimitX,
          config.dragLimitX,
        );
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      projectPointer(event.clientX, event.clientY);
      scratch.current.downX = event.clientX;
      scratch.current.downY = event.clientY;
      scratch.current.pointerId = event.pointerId;
      scratch.current.pending = true;
      scratch.current.dragArmed = false;
      scratch.current.isTouch = event.pointerType === "touch";

      if (!quality.enableDrag || state.morphing) return;

      // Mouse can start drag immediately; touch waits for gesture intent.
      if (!scratch.current.isTouch) {
        armDrag(event.clientX, event.clientY, event.pointerId);
      }
    };

    const endPointer = (event: PointerEvent) => {
      const dx = event.clientX - scratch.current.downX;
      const dy = event.clientY - scratch.current.downY;
      const moved = Math.hypot(dx, dy) > 6;
      const wasDragging = scratch.current.dragArmed;

      state.dragging = false;
      state.drag.active = 0;
      scratch.current.pending = false;
      scratch.current.dragArmed = false;

      try {
        el.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }

      if (quality.enablePulse && !moved && !wasDragging && !state.morphing) {
        projectPointer(event.clientX, event.clientY);
        state.pulse.x = state.pointer.x;
        state.pulse.y = state.pointer.y;
        state.pulse.z = state.pointer.z;
        state.pulse.start = clock.elapsedTime;
        state.pulse.active = 1;
      }
    };

    const onPointerLeave = () => {
      state.pointer.active = 0;
      if (!state.dragging) {
        state.parallax.x = 0;
        state.parallax.y = 0;
      }
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", endPointer);
    el.addEventListener("pointerleave", onPointerLeave);
    el.addEventListener("pointercancel", endPointer);

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", endPointer);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("pointercancel", endPointer);
    };
  }, [camera, clock, config, dragOrigin, gl, groupRef, quality, stateRef]);

  return null;
}
