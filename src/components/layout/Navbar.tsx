"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/content";
import { getProductNavItems } from "@/lib/case-studies";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/use-scrolled";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";

function ProductsDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLLIElement>(null);
  const menuId = useId();
  const products = getProductNavItems();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href="/#products"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen(false)}
        className="group relative inline-flex items-center gap-1 text-[15px] text-foreground/80 transition-colors duration-200 hover:text-foreground"
      >
        Our Products
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
        <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 ease-out-expo group-hover:w-full" />
      </a>

      <div
        id={menuId}
        role="menu"
        aria-label="Our products"
        className={cn(
          "absolute left-0 top-full z-50 pt-3 transition-[opacity,transform,visibility] duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none",
        )}
      >
        <div className="min-w-[17.5rem] overflow-hidden rounded-2xl border border-border bg-background/95 p-2 shadow-soft backdrop-blur-xl">
          {products.map((product) => (
            <a
              key={product.slug}
              href={product.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3.5 py-3 transition-colors hover:bg-surface"
            >
              <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {product.type}
              </span>
              <span className="mt-1 block text-[15px] font-medium text-foreground">
                {product.name}
              </span>
            </a>
          ))}
          <div className="mt-1 border-t border-border px-3.5 py-2.5">
            <a
              href="/#products"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              View all products
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Navbar() {
  const scrolled = useScrolled(8);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300",
          scrolled
            ? "border-b border-border bg-background/80 shadow-soft backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-background",
        )}
      >
        <nav className="page-container flex h-[72px] items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" aria-label="Mirai Studios home" className="transition-transform duration-300 hover:scale-[1.01]">
              <Logo />
            </a>
            <span aria-hidden className="hidden h-6 w-px bg-border lg:block" />
            <ul className="hidden items-center gap-7 lg:flex">
              {NAV_LINKS.map((link) =>
                link.dropdown === "products" ? (
                  <ProductsDropdown key={link.href} />
                ) : (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group relative text-[15px] text-foreground/80 transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 ease-out-expo group-hover:w-full" />
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <Button href="/#contact" className="hidden h-11 px-6 text-sm sm:inline-flex">
              Contact Us
            </Button>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-surface lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
