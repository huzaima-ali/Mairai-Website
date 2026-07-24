import { cn } from "@/lib/utils";

/**
 * Mirai Studios mark — Figma logo icon + wordmark.
 */
export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/mirai-studios-mark.svg"
        alt=""
        width={28}
        height={32}
        aria-hidden
        className="h-8 w-[28px] shrink-0"
      />
      <span
        className={cn(
          "text-[17px] font-medium leading-none tracking-snug",
          dark ? "text-white" : "text-foreground",
        )}
      >
        Mirai Studios
        <sup className="ml-0.5 text-[8px] text-muted-foreground">®</sup>
      </span>
    </span>
  );
}
