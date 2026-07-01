"use client";

import { useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/content";
import { drawer, overlay, staggerContainer, fadeUp } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <m.button
            type="button"
            aria-label="Close menu"
            variants={overlay}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
          />
          <m.nav
            variants={drawer}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute right-0 top-0 flex h-full w-[min(86vw,22rem)] flex-col border-l border-border bg-background p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <m.ul variants={staggerContainer} initial="hidden" animate="show" className="mt-10 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <m.li key={link.href} variants={fadeUp}>
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center rounded-2xl px-4 py-3.5 text-lg text-foreground transition-colors hover:bg-surface"
                  >
                    {link.label}
                  </a>
                </m.li>
              ))}
            </m.ul>

            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Button href="#contact" className="w-full" onClick={onClose}>
                Contact Us
              </Button>
              <a
                href={`mailto:${SITE.email}`}
                className="text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {SITE.email}
              </a>
            </div>
          </m.nav>
        </m.div>
      )}
    </AnimatePresence>
  );
}
