"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type GlobeFocusId = "united-states" | "united-kingdom" | "middle-east" | "pakistan" | null;

type RegionHotspot = {
  id: Exclude<GlobeFocusId, null>;
  label: string;
  eyebrow: string;
  caption: string;
  href?: string;
  color: string;
  activeColor: string;
  lat: [number, number];
  lon: [number, number];
  focus: { lat: number; lon: number };
};

const RADIUS = 1.35;
const IDLE_SPIN = 0.08;
const LAND_COLOR = "#2a2a2a";
const LAND_DIM = "#1a1a1a";
/** Idle framing — full silhouette at ~70–80% of the canvas with breathing room. */
const IDLE_CAMERA_Z = 6.35;
/** Region focus zooms about 12% closer — noticeable, not dramatic / never crops. */
const FOCUS_CAMERA_Z = IDLE_CAMERA_Z * 0.88;
const CAMERA_FOV = 34;

export const REGION_HOTSPOTS: RegionHotspot[] = [
  {
    id: "united-states",
    label: "United States",
    eyebrow: "Active market",
    caption: "AI product and technology partnerships across the US.",
    href: "/regions/united-states",
    color: "#c7253e",
    activeColor: "#e23a52",
    lat: [24, 49.5],
    lon: [-125, -66],
    focus: { lat: 38.5, lon: -97 },
  },
  {
    id: "united-kingdom",
    label: "United Kingdom",
    eyebrow: "Active market",
    caption: "Product engineering partnerships for UK businesses.",
    href: "/regions/united-kingdom",
    color: "#c7253e",
    activeColor: "#e23a52",
    lat: [49.8, 59.2],
    lon: [-8.2, 2.2],
    focus: { lat: 54.2, lon: -2.5 },
  },
  {
    id: "middle-east",
    label: "Middle East",
    eyebrow: "Active market",
    caption: "Delivery across the GCC, including Saudi Arabia and the UAE.",
    href: "/regions/middle-east",
    color: "#c7253e",
    activeColor: "#e23a52",
    lat: [12, 33],
    lon: [34, 59],
    focus: { lat: 24.5, lon: 48 },
  },
  {
    id: "pakistan",
    label: "Pakistan",
    eyebrow: "Delivery studio",
    caption: "Back office and development team based in Pakistan.",
    color: "#1f7a48",
    activeColor: "#28a05c",
    lat: [23.6, 37.2],
    lon: [60.8, 77.2],
    focus: { lat: 30.2, lon: 69.2 },
  },
];

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function inBounds(lat: number, lon: number, latRange: [number, number], lonRange: [number, number]) {
  return lat >= latRange[0] && lat <= latRange[1] && lon >= lonRange[0] && lon <= lonRange[1];
}

function findHotspot(lat: number, lon: number) {
  return REGION_HOTSPOTS.find((region) => inBounds(lat, lon, region.lat, region.lon)) ?? null;
}

type LandPoint = {
  position: THREE.Vector3;
  hotspotId: GlobeFocusId;
};

function sampleLandPoints(image: HTMLImageElement, step = 3): LandPoint[] {
  const canvas = document.createElement("canvas");
  const width = image.width;
  const height = image.height;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  ctx.drawImage(image, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);
  const points: LandPoint[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const index = (y * width + x) * 4;
      const elevation = data[index] ?? 0;
      if (elevation < 22) continue;

      const lon = (x / width) * 360 - 180;
      const lat = 90 - (y / height) * 180;
      const hotspot = findHotspot(lat, lon);
      const radiusJitter = RADIUS + ((elevation / 255) * 0.035 - 0.01);

      points.push({
        position: latLonToVector3(lat, lon, radiusJitter),
        hotspotId: hotspot?.id ?? null,
      });
    }
  }

  return points;
}

function FootprintArcs({ focusId }: { focusId: GlobeFocusId }) {
  const arcs = useMemo(() => {
    const pakistan = REGION_HOTSPOTS.find((item) => item.id === "pakistan")!;
    const start = latLonToVector3(pakistan.focus.lat, pakistan.focus.lon, RADIUS * 1.02);

    return REGION_HOTSPOTS.filter((item) => item.id !== "pakistan").map((market) => {
      const end = latLonToVector3(market.focus.lat, market.focus.lon, RADIUS * 1.02);
      const mid = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(RADIUS * 1.28);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      return {
        id: market.id,
        points: curve.getPoints(48).map((point) => point.toArray() as [number, number, number]),
      };
    });
  }, []);

  return (
    <group>
      {arcs.map(({ id, points }) => {
        const active = !focusId || focusId === id || focusId === "pakistan";
        return (
          <Line
            key={id}
            points={points}
            color="#c7253e"
            transparent
            opacity={active ? 0.32 : 0.09}
            lineWidth={1}
            depthWrite={false}
          />
        );
      })}
    </group>
  );
}

function EarthLandVoxels({
  focusId,
  onSelect,
  points,
}: {
  focusId: GlobeFocusId;
  onSelect: (id: GlobeFocusId) => void;
  points: LandPoint[];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    points.forEach((point, index) => {
      const hotspot = point.hotspotId
        ? REGION_HOTSPOTS.find((item) => item.id === point.hotspotId)
        : null;
      const isFocused = Boolean(focusId && point.hotspotId === focusId);
      const isMarket = Boolean(hotspot);
      const dimmed = Boolean(focusId && !isFocused);

      let hex = LAND_COLOR;
      if (isMarket && hotspot) {
        hex = isFocused ? hotspot.activeColor : hotspot.color;
      } else if (dimmed) {
        hex = LAND_DIM;
      }

      const scale = isFocused ? 1.22 : isMarket ? 1.05 : dimmed ? 0.82 : 0.94;
      dummy.position.copy(point.position);
      dummy.lookAt(0, 0, 0);
      dummy.rotateX(Math.PI / 2);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      color.set(hex);
      mesh.setColorAt(index, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [color, dummy, focusId, points]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh || !focusId) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.2) * 0.035;

    points.forEach((point, index) => {
      if (point.hotspotId !== focusId) return;
      dummy.position.copy(point.position);
      dummy.lookAt(0, 0, 0);
      dummy.rotateX(Math.PI / 2);
      dummy.scale.setScalar(1.22 * pulse);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, points.length]}
      frustumCulled={false}
      onClick={(event) => {
        event.stopPropagation();
        const id = points[event.instanceId ?? -1]?.hotspotId ?? null;
        onSelect(id);
      }}
    >
      <boxGeometry args={[0.036, 0.036, 0.036]} />
      <meshStandardMaterial toneMapped={false} roughness={0.62} metalness={0.04} />
    </instancedMesh>
  );
}

function GlobeScene({
  focusId,
  onSelect,
  points,
}: {
  focusId: GlobeFocusId;
  onSelect: (id: GlobeFocusId) => void;
  points: LandPoint[];
}) {
  const rootRef = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const targetQuat = useRef(new THREE.Quaternion());
  const idleQuat = useRef(new THREE.Quaternion());
  const cameraZ = useRef(IDLE_CAMERA_Z);
  const spinAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const spinStep = useMemo(() => new THREE.Quaternion(), []);

  /** Keep framing stable when the canvas aspect changes (resize / breakpoints). */
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    camera.fov = CAMERA_FOV;
    camera.aspect = size.width / Math.max(size.height, 1);
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  useFrame((_, delta) => {
    const group = rootRef.current;
    if (!group) return;

    if (!focusId) {
      spinStep.setFromAxisAngle(spinAxis, delta * IDLE_SPIN);
      idleQuat.current.multiply(spinStep);
      targetQuat.current.copy(idleQuat.current);
      cameraZ.current = THREE.MathUtils.damp(cameraZ.current, IDLE_CAMERA_Z, 2.2, delta);
    } else {
      const hotspot = REGION_HOTSPOTS.find((item) => item.id === focusId);
      if (hotspot) {
        const target = latLonToVector3(hotspot.focus.lat, hotspot.focus.lon, 1).normalize();
        const front = new THREE.Vector3(0, 0, 1);
        targetQuat.current.setFromUnitVectors(target, front);
        idleQuat.current.copy(targetQuat.current);
        cameraZ.current = THREE.MathUtils.damp(cameraZ.current, FOCUS_CAMERA_Z, 2.4, delta);
      }
    }

    group.quaternion.slerp(targetQuat.current, 1 - Math.exp(-delta * 2.35));
    camera.position.z = cameraZ.current;
    camera.lookAt(0, 0.05, 0);
  });

  return (
    <group position={[0, 0.05, 0]}>
      <mesh>
        <sphereGeometry args={[RADIUS * 0.985, 48, 48]} />
        <meshStandardMaterial color="#d9d5d0" transparent opacity={0.42} roughness={1} metalness={0} />
      </mesh>
      <mesh>
        <sphereGeometry args={[RADIUS * 1.05, 48, 48]} />
        <meshBasicMaterial color="#b7b2ac" transparent opacity={0.09} depthWrite={false} />
      </mesh>

      <group ref={rootRef}>
        <EarthLandVoxels focusId={focusId} onSelect={onSelect} points={points} />
        <FootprintArcs focusId={focusId} />
      </group>
    </group>
  );
}

function TopologyEarth({
  focusId,
  onSelect,
}: {
  focusId: GlobeFocusId;
  onSelect: (id: GlobeFocusId) => void;
}) {
  const texture = useLoader(THREE.TextureLoader, "/images/earth-topology.png");
  const points = useMemo(() => {
    const image = texture.image as HTMLImageElement | undefined;
    if (!image?.width) return [];
    return sampleLandPoints(image, 3);
  }, [texture]);

  if (!points.length) return null;

  return (
    <Canvas
      camera={{ position: [0, 0.02, IDLE_CAMERA_Z], fov: CAMERA_FOV, near: 0.1, far: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onPointerMissed={() => onSelect(null)}
      style={{ background: "transparent", width: "100%", height: "100%" }}
      resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
    >
      <ambientLight intensity={0.92} />
      <directionalLight position={[5, 4, 6]} intensity={1.15} />
      <directionalLight position={[-4, -2, -3]} intensity={0.28} />
      <GlobeScene focusId={focusId} onSelect={onSelect} points={points} />
    </Canvas>
  );
}

function GlobeFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent">
      <div className="relative size-40 rounded-full bg-[#ebe8e4]/80">
        <div className="absolute inset-[18%] rounded-full border border-dashed border-black/10" />
        <p className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Loading Earth
        </p>
      </div>
    </div>
  );
}

export function RegionsGlobe({
  focusId,
  onFocusChange,
  className,
}: {
  focusId: GlobeFocusId;
  onFocusChange: (id: GlobeFocusId) => void;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={className}>
      <div className="relative aspect-square w-full max-w-[560px] overflow-visible bg-transparent sm:max-w-none sm:aspect-auto sm:min-h-[420px] lg:min-h-[520px] mx-auto">
        <div className="absolute inset-0 p-4 sm:p-6 lg:p-8">
          {mounted ? (
            <Suspense fallback={<GlobeFallback />}>
              <TopologyEarth focusId={focusId} onSelect={onFocusChange} />
            </Suspense>
          ) : (
            <GlobeFallback />
          )}
        </div>
      </div>
    </div>
  );
}
