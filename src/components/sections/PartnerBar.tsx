"use client";

import { PARTNER_BAR, PARTNER_LOGOS } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { LogoImg } from "@/components/ui/LogoImg";

export function PartnerBar() {
  return (
    <Container className="py-8">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex shrink-0 items-center gap-3" aria-label="Partner logos">
              {PARTNER_LOGOS.map((logo) => (
                <span
                  key={logo.name}
                  className="grid size-[56px] shrink-0 place-items-center rounded-[14px] border border-black/[0.08] bg-[#f5f3f1] p-2 sm:size-[66px]"
                >
                  <LogoImg
                    src={`/logos/${logo.file}`}
                    name={logo.name}
                    className="block max-h-full max-w-full object-contain"
                    wordmarkClassName="text-center text-[10px] leading-tight text-foreground/50"
                  />
                </span>
              ))}
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
