import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageBackLink } from "@/components/ui/PageBackLink";

/** Lightweight index pages for services / regions hubs. */
export function HubIndexPage({
  eyebrow,
  title,
  intro,
  links,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  links: Array<{ href: string; label: string; description: string }>;
}) {
  return (
    <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <Container>
        <div className="max-w-3xl">
          <PageBackLink />
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">{title}</h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>

          <ul className="mt-10 flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-foreground/25"
                >
                  <span className="block text-lg font-medium text-foreground">{link.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{link.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
