"use client";

import { ContactShadows } from "@react-three/drei";

interface VoxelLightingProps {
  contactShadow?: boolean;
}

/** Soft studio lighting without remote HDR (keeps the marketing page offline-safe). */
export function VoxelLighting({ contactShadow = true }: VoxelLightingProps) {
  return (
    <>
      <hemisphereLight args={["#f7f3ef", "#cfc8c2", 0.62]} />
      <ambientLight intensity={0.4} color="#f4f1ee" />
      <directionalLight position={[3.5, 5.5, 2.5]} intensity={1.25} color="#ffffff" />
      <directionalLight position={[-3.2, 1.8, -2.4]} intensity={0.42} color="#d8d2cc" />
      <directionalLight position={[0.5, 2.2, -4]} intensity={0.28} color="#efeae4" />
      {contactShadow ? (
        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.2}
          scale={8}
          blur={2.8}
          far={4.5}
          color="#0a0a0a"
        />
      ) : null}
    </>
  );
}
