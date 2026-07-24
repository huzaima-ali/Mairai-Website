"use client";

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
            <div aria-hidden="true" className="flex shrink-0 items-center gap-[15px]">
              <div className="flex items-center gap-[23px]">
                <span className="size-[50px] shrink-0 rounded-[14px] border border-black/[0.08] bg-[#f5f3f1]" />
                <span className="size-[50px] shrink-0 rounded-[14px] border border-black/[0.08] bg-[#f5f3f1]" />
              </div>
              <div className="relative size-[66px] shrink-0">
                <div className="absolute inset-[-1.65%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logos/partner-mark.svg"
                    alt=""
                    className="block size-full max-w-none"
                  />
                </div>
              </div>
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
