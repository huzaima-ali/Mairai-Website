import { SITE } from "@/lib/content";
import { COMPANY, LEGAL_NAV_LINKS } from "@/lib/legal";
import { SOCIAL_PROFILES } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: SOCIAL_PROFILES[0] },
  { label: "Instagram", href: SOCIAL_PROFILES[1] },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div aria-hidden className="dot-grid absolute inset-0 text-foreground/[0.06]" />
      <Container className="relative pb-16 pt-12 lg:pb-20 lg:pt-14">
        <a href="/" aria-label="Mirai Studios home" className="inline-flex transition-opacity hover:opacity-80">
          <Logo />
        </a>
        <p className="mt-8 max-w-2xl whitespace-pre-line text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-[1.05] tracking-tightest text-foreground">
          {SITE.tagline}
        </p>

        <div className="mt-12 grid gap-10 border-t border-border pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium text-foreground">{COMPANY.legalName}</p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-foreground/60">
                {COMPANY.jurisdictionLine}
              </p>
              <a
                href={`mailto:${COMPANY.email}`}
                className="mt-3 inline-block text-sm text-foreground transition-opacity hover:opacity-60"
              >
                {COMPANY.email}
              </a>
            </div>

            <nav aria-label="Company" className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
              <a href="/partners" className="text-sm text-foreground transition-opacity hover:opacity-60">
                Partner With Us
              </a>
              <a href="/services" className="text-sm text-foreground transition-opacity hover:opacity-60">
                Services
              </a>
              <a href="/insights" className="text-sm text-foreground transition-opacity hover:opacity-60">
                Insights
              </a>
              <a href="/careers" className="text-sm text-foreground transition-opacity hover:opacity-60">
                Careers
              </a>
            </nav>
          </div>

          <div className="flex flex-col gap-6 lg:items-end">
            <nav
              aria-label="Social media"
              className="flex flex-col items-start gap-2 text-sm font-normal leading-5 sm:flex-row sm:items-center sm:gap-8 lg:justify-end"
            >
              <span className="shrink-0 text-foreground/[0.42]">Socials</span>
              <div className="flex flex-wrap items-start gap-x-7 gap-y-2 lg:justify-end">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground transition-opacity duration-200 hover:opacity-60"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="flex flex-col gap-3 lg:items-end">
              <p className="text-sm leading-relaxed text-foreground lg:text-right">
                <span className="text-foreground/[0.42]">©</span> {year} {COMPANY.legalName}. All rights reserved.
              </p>
              <nav
                aria-label="Legal"
                className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2 lg:justify-end"
              >
                {LEGAL_NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-foreground/60 transition-opacity hover:opacity-100"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
