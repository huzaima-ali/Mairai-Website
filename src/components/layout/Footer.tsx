import { SITE } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "Reddit", href: "https://www.reddit.com" },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div aria-hidden className="dot-grid absolute inset-0 text-foreground/[0.06]" />
      <Container className="relative py-16 lg:py-20">
        <Logo />
        <p className="mt-8 max-w-2xl whitespace-pre-line text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-[1.05] tracking-tightest text-foreground">
          {SITE.tagline}
        </p>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 lg:flex-row lg:items-center">
          <nav
            aria-label="Social media"
            className="flex flex-col items-start gap-2 text-sm font-normal leading-5 sm:flex-row sm:gap-8"
          >
            <span className="shrink-0 text-foreground/[0.42]">Socials</span>
            <div className="flex flex-wrap items-start gap-x-7 gap-y-2">
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

          <p className="shrink-0 whitespace-nowrap text-right text-sm font-normal leading-5 text-foreground">
            <span className="text-foreground/[0.42]">©</span> {new Date().getFullYear()} {SITE.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
