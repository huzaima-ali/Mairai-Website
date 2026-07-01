import { cn } from "@/lib/utils";

/**
 * Mirai Studios mark — an isometric crimson cube glyph + wordmark.
 */
export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden className="shrink-0">
        <path d="M14 0L28 8V24L14 32L0 24V8L14 0Z" fill="#c7253e" />
        <path d="M14 0L28 8L14 16L0 8L14 0Z" fill="#e0556a" />
        <path d="M14 16L28 8V24L14 32V16Z" fill="#9e1b30" />
        <path d="M14 16L0 8V24L14 32V16Z" fill="#b71f37" />
      </svg>
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
