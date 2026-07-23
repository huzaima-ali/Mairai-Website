"use client";

import { type CSSProperties } from "react";
import { CLIENT_ROWS } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { LogoImg } from "@/components/ui/LogoImg";
import { Reveal } from "@/components/animations/Reveal";

function Logo({ name, file }: { name: string; file: string }) {
  const compound =
    name === "enorta" ? (
      <span className="flex items-center gap-2 text-[#717171]">
        <LogoImg src={`/logos/${file}`} name="" className="size-7 object-contain grayscale" wordmarkClassName="hidden" />
        <span className="text-[28px] leading-none tracking-tight">enorta</span>
      </span>
    ) : name === "Cero" ? (
      <span className="flex items-center gap-2 text-[#717171]">
        <LogoImg src={`/logos/${file}`} name="" className="size-6 object-contain grayscale" wordmarkClassName="hidden" />
        <span className="text-[32px] font-medium leading-none">
          Cero
          <sup className="text-[10px]">©</sup>
        </span>
      </span>
    ) : (
      <LogoImg
        src={`/logos/${file}`}
        name={name}
        className="max-h-[34px] w-auto max-w-[160px] object-contain grayscale"
        wordmarkClassName="text-foreground/40"
      />
    );

  return <div className="flex h-[60px] w-full max-w-[206px] items-center justify-center">{compound}</div>;
}

export function CompanyLogos() {
  const all = CLIENT_ROWS.flat();

  return (
    <Container className="py-12 lg:py-16">
      <Reveal className="hidden flex-col gap-y-12 opacity-60 transition-opacity duration-500 hover:opacity-100 lg:flex">
        {CLIENT_ROWS.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-x-8">
            {row.map((logo) => (
              <Logo key={logo.name} name={logo.name} file={logo.file} />
            ))}
          </div>
        ))}
      </Reveal>

      <Reveal className="lg:hidden">
        <div className="mask-fade-x overflow-hidden opacity-70">
          <div
            className="flex w-max animate-marquee items-center gap-12"
            style={{ "--marquee-duration": "32s" } as CSSProperties}
          >
            {[...all, ...all].map((logo, i) => (
              <div key={`${logo.name}-${i}`} className="flex h-[48px] w-[160px] shrink-0 items-center justify-center">
                <Logo name={logo.name} file={logo.file} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
