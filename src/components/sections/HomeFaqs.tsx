import { ChevronDown } from "lucide-react";
import { HOME_FAQS } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function HomeFaqs() {
  return (
    <Section className="py-10 sm:py-12 lg:py-16" aria-labelledby="home-faqs">
      <Container>
        <div className="max-w-3xl">
          <p className="eyebrow">Questions</p>
          <h2 id="home-faqs" className="display mt-3 text-[clamp(1.85rem,3.2vw,2.95rem)] leading-[1.06]">
            Common questions
          </h2>
        </div>
        <div className="mt-8 grid gap-3 lg:grid-cols-2 lg:gap-4">
          {HOME_FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-border bg-surface px-5 py-2 open:pb-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-lg font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/[0.08] bg-white text-foreground transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none">
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="pb-1 pr-14 text-sm leading-relaxed text-muted-foreground sm:text-base">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
