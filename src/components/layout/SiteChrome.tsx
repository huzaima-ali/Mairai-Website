"use client";

import { usePathname } from "next/navigation";
import { AlertBar } from "@/components/layout/AlertBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminApp = pathname?.startsWith("/admin") && !pathname?.startsWith("/admin/preview");

  if (isAdminApp) {
    return <>{children}</>;
  }

  return (
    <>
      <AlertBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
