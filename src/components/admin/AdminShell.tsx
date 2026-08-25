"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAdminAction } from "@/lib/cms/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", label: "Pages & SEO", icon: Search },
  { href: "/admin/insights", label: "Insights", icon: Newspaper },
  { href: "/admin/careers", label: "Careers", icon: Briefcase },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string | null;
}) {
  const pathname = usePathname();

  async function signOut() {
    await signOutAdminAction();
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-dvh bg-[#f4f3f1] text-foreground">
      <div className="flex min-h-dvh">
        <aside className="hidden w-60 shrink-0 border-r border-black/8 bg-white lg:flex lg:flex-col">
          <div className="border-b border-black/8 px-5 py-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">Mirai</p>
            <p className="mt-1 text-lg font-medium tracking-tight">Site Ops</p>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active ? "bg-accent-soft text-accent" : "text-foreground/75 hover:bg-black/[0.03]",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-black/8 p-4">
            <p className="truncate text-xs text-muted-foreground">{email}</p>
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70 hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-black/8 bg-white/95 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-accent">Mirai Site Ops</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
              <button
                type="button"
                onClick={() => void signOut()}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
            <nav className="flex gap-1 overflow-x-auto px-2 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {NAV.map((item) => {
                const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium",
                      active ? "bg-accent text-white" : "bg-black/[0.04] text-foreground/70",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <main className="flex-1 px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function AdminStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-emerald-50 text-emerald-700",
    draft: "bg-amber-50 text-amber-800",
    unpublished: "bg-zinc-100 text-zinc-600",
    closed: "bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize",
        styles[status] || "bg-zinc-100 text-zinc-600",
      )}
    >
      {status}
    </span>
  );
}
