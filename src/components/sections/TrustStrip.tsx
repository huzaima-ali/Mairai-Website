"use client";

import { TRUST_STRIP } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function TrustStrip() {
  return (
    <Container className="py-10 lg:py-12">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <p className="text-balance text-xl text-foreground sm:text-2xl">{TRUST_STRIP.text}</p>
          <Button href="#engagement" className="shrink-0">
            {TRUST_STRIP.cta}
          </Button>
        </div>
      </Reveal>
    </Container>
  );
}
