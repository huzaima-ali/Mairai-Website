"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:opacity-90 hover:shadow-sm active:opacity-80",
  secondary:
    "border border-black/10 bg-white text-foreground hover:bg-black/[0.04] active:bg-black/[0.07]",
  danger:
    "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 active:bg-rose-100",
  ghost:
    "border border-transparent bg-transparent text-foreground/80 hover:bg-black/[0.04] hover:text-foreground",
};

export function AdminButton({
  children,
  className,
  variant = "secondary",
  loading = false,
  loadingLabel,
  disabled,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  loadingLabel?: string;
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-60",
        "motion-reduce:transition-none motion-reduce:active:scale-100",
        "active:scale-[0.98]",
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden /> : null}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
