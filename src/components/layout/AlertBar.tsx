import { ChevronRight, Flame } from "lucide-react";
import { ANNOUNCEMENT } from "@/lib/content";

/** Top announcement bar — dark, centered, with an ember accent. */
export function AlertBar() {
  return (
    <div className="relative h-11 overflow-hidden bg-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 28px, rgba(255,255,255,0.6) 28px 30px)",
        }}
      />
      <div className="relative flex h-full items-center justify-center gap-3 px-4 text-[13px]">
        <Flame className="h-3.5 w-3.5 text-[#ff6a2c]" />
        <span className="truncate">{ANNOUNCEMENT.text}</span>
        <span aria-hidden className="hidden h-3.5 w-px bg-white/25 sm:block" />
        <a
          href={ANNOUNCEMENT.href}
          className="group hidden items-center gap-1 font-medium text-[#ff6a2c] transition-colors hover:text-[#ff8a4c] sm:inline-flex"
        >
          {ANNOUNCEMENT.cta}
          <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
