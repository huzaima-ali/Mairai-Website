import { cn } from "@/lib/utils";

export function AdminStickyPanel({
  children,
  actions,
  className,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-black/8 bg-white",
        "max-h-[min(70vh,calc(100dvh-8rem))] lg:sticky lg:top-6 lg:max-h-[calc(100dvh-5.5rem)]",
        className,
      )}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-5">
        <div className="flex min-w-0 flex-col gap-4 break-words [overflow-wrap:anywhere]">{children}</div>
      </div>
      {actions ? (
        <div className="shrink-0 space-y-2 border-t border-black/8 bg-white p-4">{actions}</div>
      ) : null}
    </aside>
  );
}
