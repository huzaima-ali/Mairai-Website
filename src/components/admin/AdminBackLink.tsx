"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminBackLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const router = useRouter();

  function goBack(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (typeof window !== "undefined") {
      const referrer = document.referrer;
      try {
        if (referrer) {
          const url = new URL(referrer);
          if (
            url.origin === window.location.origin &&
            url.pathname.startsWith("/admin") &&
            url.pathname !== window.location.pathname &&
            window.history.length > 1
          ) {
            router.back();
            return;
          }
        }
      } catch {
        // fall through to href
      }
    }
    router.push(href);
  }

  return (
    <a
      href={href}
      onClick={goBack}
      className={cn(
        "pill mb-1 inline-flex min-h-11 border border-border bg-white text-foreground transition-all duration-200 hover:border-foreground/40 hover:bg-black/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      {label}
    </a>
  );
}
