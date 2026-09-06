"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminCopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-black/10 px-2.5 py-1 text-[11px] font-medium text-foreground/70 transition-all duration-200 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] disabled:opacity-60",
        copied && "border-emerald-200 bg-emerald-50 text-emerald-800",
        className,
      )}
    >
      {copied ? <Check className="h-3 w-3" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
      {copied ? "Copied" : label}
    </button>
  );
}
