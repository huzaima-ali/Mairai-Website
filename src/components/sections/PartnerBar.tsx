"use client";

import { Send } from "lucide-react";
import { PARTNER_BAR } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function PartnerBar() {
  return (
    <Container className="py-8">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <span className="h-12 w-12 rounded-2xl border border-border bg-surface" />
              <span className="h-12 w-12 rounded-2xl border border-border bg-surface" />
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white shadow-pill">
                <Send className="h-5 w-5 -rotate-12" />
              </span>
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">{PARTNER_BAR.title}</p>
              <p className="text-sm text-muted-foreground">{PARTNER_BAR.subtitle}</p>
            </div>
          </div>
          <Button href="#contact" variant="outline" className="shrink-0">
            {PARTNER_BAR.cta}
          </Button>
        </div>
      </Reveal>
    </Container>
  );
}
