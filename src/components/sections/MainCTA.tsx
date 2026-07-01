"use client";

import { MAIN_CTA } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function MainCTA() {
  return (
    <Section className="py-16 lg:py-20">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              <h2 className="display text-[clamp(2rem,4.5vw,3.25rem)] leading-tight">{MAIN_CTA.title}</h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground sm:text-lg">{MAIN_CTA.body}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Button href="#contact" variant="outline">
                {MAIN_CTA.secondary}
              </Button>
              <Button href="#contact">{MAIN_CTA.primary}</Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
