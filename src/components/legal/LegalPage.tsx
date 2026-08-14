import { ArrowLeft } from "lucide-react";
import { LEGAL_LAST_UPDATED, type LegalDocument } from "@/lib/legal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

interface LegalPageProps {
  document: LegalDocument;
}

export function LegalPage({ document }: LegalPageProps) {
  return (
    <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <Container>
        <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="pill mb-8 inline-flex border border-border bg-background text-foreground hover:border-foreground/40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Mirai Studios
        </a>

        <header className="border-b border-border pb-8">
          <h1 className="display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05]">{document.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">Last Updated: {LEGAL_LAST_UPDATED}</p>
        </header>

        <div className="mt-10 flex flex-col gap-10">
          {document.intro.map((paragraph) => (
            <p key={paragraph} className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {paragraph}
            </p>
          ))}

          {document.sections.map((section) => (
            <section key={section.heading} className="scroll-mt-28">
              <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug tracking-snug">
                {section.heading}
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets?.length ? (
                  <ul className="list-disc space-y-2 pl-5 marker:text-foreground/35">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
        </div>
      </Container>
    </Section>
  );
}
