"use client";

import { useState } from "react";
import { Menu, Sun } from "lucide-react";
import { NAV_LINKS } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/use-scrolled";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";

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
        <nav className="mx-auto flex h-[72px] w-full max-w-content items-center justify-between px-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-6">
            <a href="#top" aria-label="Mirai Studios home" className="transition-transform duration-300 hover:scale-[1.01]">
              <Logo />
            </a>
            <span aria-hidden className="hidden h-6 w-px bg-border lg:block" />
            <ul className="hidden items-center gap-7 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group relative text-[15px] text-foreground/80 transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 ease-out-expo group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <Button href="#contact" className="hidden h-11 px-6 text-sm sm:inline-flex">
              Contact Us
            </Button>
            <button
              type="button"
              aria-label="Toggle theme"
              className="hidden h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-surface sm:grid"
            >
              <Sun className="h-[18px] w-[18px]" />
            </button>
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
