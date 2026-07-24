import { NAV_LINKS, SITE } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div aria-hidden className="dot-grid absolute inset-0 text-foreground/[0.06]" />
      <Container className="relative py-16 lg:py-20">
        <Logo />
        <p className="mt-8 max-w-2xl whitespace-pre-line text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-[1.05] tracking-tightest text-foreground">
          {SITE.tagline}
        </p>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {SITE.email}
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
