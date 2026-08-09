import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voxel Sculpture Lab",
  robots: { index: false, follow: false },
};

export default function VoxelDevLayout({ children }: { children: React.ReactNode }) {
  return children;
}
