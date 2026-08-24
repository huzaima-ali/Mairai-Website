"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/content";
import { getProductNavItems } from "@/lib/case-studies";
import { cn } from "@/lib/utils";
import { drawer, overlay, staggerContainer, fadeUp } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [productsOpen, setProductsOpen] = useState(false);
  const products = getProductNavItems();

  useEffect(() => {
    if (!open) {
      setProductsOpen(false);
      return;
    }
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
              <a href="/" aria-label="Mirai Studios home" onClick={onClose}>
                <Logo />
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <m.ul variants={staggerContainer} initial="hidden" animate="show" className="mt-10 flex flex-col gap-1 overflow-y-auto">
              {NAV_LINKS.map((link) =>
                link.dropdown === "products" ? (
                  <m.li key={link.href} variants={fadeUp} className="rounded-2xl">
                    <div className="flex items-stretch">
                      <a
                        href={link.href}
                        onClick={onClose}
                        className="flex flex-1 items-center rounded-l-2xl px-4 py-3.5 text-lg text-foreground transition-colors hover:bg-surface"
                      >
                        {link.label}
                      </a>
                      <button
                        type="button"
                        aria-expanded={productsOpen}
                        aria-label="Toggle product list"
                        onClick={() => setProductsOpen((current) => !current)}
                        className="grid w-12 place-items-center rounded-r-2xl text-foreground transition-colors hover:bg-surface"
                      >
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 transition-transform duration-200",
                            productsOpen && "rotate-180",
                          )}
                        />
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {productsOpen ? (
                        <m.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <li className="pb-2 pl-2 pr-1 pt-1">
                            {products.map((product) => (
                              <a
                                key={product.slug}
                                href={product.href}
                                onClick={onClose}
                                className="block rounded-xl px-4 py-3 transition-colors hover:bg-surface"
                              >
                                <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                  {product.type}
                                </span>
                                <span className="mt-1 block text-base font-medium text-foreground">
                                  {product.name}
                                </span>
                              </a>
                            ))}
                          </li>
                        </m.ul>
                      ) : null}
                    </AnimatePresence>
                  </m.li>
                ) : (
                  <m.li key={link.href} variants={fadeUp}>
                    <a
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center rounded-2xl px-4 py-3.5 text-lg text-foreground transition-colors hover:bg-surface"
                    >
                      {link.label}
                    </a>
                  </m.li>
                ),
              )}
            </m.ul>

            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Button href="/#contact" className="w-full" onClick={onClose}>
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
