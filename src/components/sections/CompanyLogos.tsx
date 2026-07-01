"use client";

import { type CSSProperties } from "react";
import { CLIENT_ROWS } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { LogoImg } from "@/components/ui/LogoImg";
import { Reveal } from "@/components/animations/Reveal";

function Logo({ name, file }: { name: string; file: string }) {
  return (
    <div className="flex h-[60px] w-full items-center justify-center">
      <LogoImg
        src={`/logos/${file}`}
        name={name}
        className="max-h-[34px] w-auto max-w-[160px] object-contain grayscale"
        wordmarkClassName="text-foreground/40"
      />
    </div>
  );
}

export function CompanyLogos() {
  const all = CLIENT_ROWS.flat();

  return (
    <Container className="py-12 lg:py-16">
      {/* Desktop: 3 rows of 6, evenly distributed (matches Figma) */}
      <Reveal className="hidden flex-col gap-y-12 opacity-60 transition-opacity duration-500 hover:opacity-100 lg:flex">
        {CLIENT_ROWS.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-x-8">
            {row.map((logo) => (
              <Logo key={logo.name} name={logo.name} file={logo.file} />
            ))}
          </div>
        ))}
      </Reveal>

      {/* Mobile/tablet: continuous marquee */}
      <Reveal className="lg:hidden">
        <div className="mask-fade-x overflow-hidden opacity-70">
          <div
            className="flex w-max animate-marquee items-center gap-12"
            style={{ "--marquee-duration": "32s" } as CSSProperties}
          >
            {[...all, ...all].map((logo, i) => (
              <div key={`${logo.name}-${i}`} className="flex h-[48px] w-[150px] shrink-0 items-center justify-center">
                <LogoImg
                  src={`/logos/${logo.file}`}
                  name={logo.name}
                  className="max-h-[30px] w-auto max-w-[140px] object-contain grayscale"
                  wordmarkClassName="text-foreground/40"
                />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
