"use client";

import { type CSSProperties } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { LogoImg } from "@/components/ui/LogoImg";
import { CLIENT_ROWS } from "@/lib/content";
import { cn } from "@/lib/utils";

const LOGO_DIMENSIONS: Record<string, string> = {
  "Coca-Cola": "h-[60px] w-[206px]",
  "Lilly AI": "h-[48px] w-[138px]",
  Rivian: "h-[32px] w-[160px]",
  PwC: "h-[48px] w-[100px]",
  Google: "h-[42px] w-[133px]",
  enorta: "h-[28px] w-[128px]",
  Cero: "h-[24px] w-[109px]",
  salesforce: "h-[60px] w-[86px]",
  "Epidemic Sound": "h-[19px] w-[160px]",
  LaunchDarkly: "h-[25px] w-[160px]",
  "Tim Hortons": "h-[32px] w-[160px]",
  Flipboard: "h-[32px] w-[159px]",
};

const PRECOMPOSITED_LOGOS = new Set(["enorta", "Cero", "Epidemic Sound"]);

function Logo({
  name,
  file,
  blend = false,
}: {
  name: string;
  file: string;
  blend?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-[60px] w-[206px] shrink-0 items-center justify-center",
        !PRECOMPOSITED_LOGOS.has(name) && "opacity-[0.56]",
        blend && "mix-blend-luminosity",
      )}
    >
      <div className={LOGO_DIMENSIONS[name]}>
        <LogoImg
          src={`/logos/${file}`}
          name={name}
          className="block size-full"
          wordmarkClassName="text-foreground/40"
        />
      </div>
    </div>
  );
}

export function CompanyLogos() {
  const all = CLIENT_ROWS.flatMap((row, rowIndex) =>
    row.map((logo) => ({ ...logo, blend: rowIndex === 0 || rowIndex === 2 })),
  );

  return (
    <Container className="py-12 lg:py-16">
      <Reveal className="hidden w-full lg:block">
        <div className="flex w-full flex-col gap-y-20">
          {CLIENT_ROWS.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={cn(
                "flex h-[60px] w-full items-center justify-between",
                (rowIndex === 0 || rowIndex === 2) && "mix-blend-luminosity",
              )}
            >
              {row.map((logo) => (
                <Logo key={logo.name} name={logo.name} file={logo.file} />
              ))}
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="lg:hidden">
        <div className="mask-fade-x overflow-hidden">
          <div
            className="flex w-max animate-marquee items-center gap-12"
            style={{ "--marquee-duration": "32s" } as CSSProperties}
          >
            {[...all, ...all].map((logo, index) => (
              <Logo
                key={`${logo.name}-${index}`}
                name={logo.name}
                file={logo.file}
                blend={logo.blend}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
