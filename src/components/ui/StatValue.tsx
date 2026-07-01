"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { formatNumber, cn } from "@/lib/utils";
import type { Stat } from "@/lib/content";

/**
 * Animated statistic: large white number with muted prefix/suffix, counting
 * up when scrolled into view. Used on the hero + contact red panels.
 */
export function StatValue({ stat, className }: { stat: Stat; className?: string }) {
  const { ref, value } = useCountUp({ to: stat.value });

  return (
    <div className={className}>
      <div className="flex items-baseline tracking-snug">
        {stat.prefix ? <span className="text-3xl font-normal text-white/55">{stat.prefix}</span> : null}
        <span ref={ref} className="text-5xl font-normal text-white sm:text-[3.25rem]" aria-label={`${stat.prefix ?? ""}${stat.value}${stat.suffix}`}>
          <span aria-hidden>{formatNumber(value)}</span>
        </span>
        <span className="text-3xl font-normal text-white/55">{stat.suffix}</span>
      </div>
      <p className="mt-2 text-sm text-white/65 sm:text-base">{stat.label}</p>
    </div>
  );
}

/** Compact dark-on-light variant (not currently used but available). */
export function StatValueDark({ stat, className }: { stat: Stat; className?: string }) {
  const { ref, value } = useCountUp({ to: stat.value });
  return (
    <div className={cn(className)}>
      <div className="flex items-baseline tracking-snug">
        {stat.prefix ? <span className="text-2xl text-muted-foreground">{stat.prefix}</span> : null}
        <span ref={ref} className="text-4xl font-normal text-foreground">
          <span aria-hidden>{formatNumber(value)}</span>
        </span>
        <span className="text-2xl text-muted-foreground">{stat.suffix}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
    </div>
  );
}
