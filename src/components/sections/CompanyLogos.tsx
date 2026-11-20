"use client";

import { type CSSProperties } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { LogoImg } from "@/components/ui/LogoImg";
import { CLIENT_ROWS, type ClientLogo } from "@/lib/content";
import { cn } from "@/lib/utils";

function Logo({ name, file, showName = false, onDark = false }: ClientLogo) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-center gap-2.5 px-2">
      <div
        className={cn(
          "flex items-center justify-center",
          showName ? "h-7 w-7 shrink-0" : "h-8 w-auto",
          onDark && "mix-blend-screen",
        )}
      >
        <LogoImg
          src={`/logos/${file}`}
          name={name}
          className={cn(
            "object-contain object-center",
            showName ? "h-7 w-7" : "h-8 w-auto max-h-8",
          )}
          wordmarkClassName="text-foreground/45"
        />
      </div>
      {showName ? (
        <span className="whitespace-nowrap text-[17px] font-medium tracking-tight text-foreground/55">
          {name}
        </span>
      ) : null}
    </div>
  );
}

function LogoTrack({ logos, hidden = false }: { logos: ClientLogo[]; hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-14 pr-14 lg:gap-16 lg:pr-16"
      aria-hidden={hidden || undefined}
    >
      {logos.map((logo, index) => (
        <Logo key={`${logo.name}-${index}`} {...logo} />
      ))}
    </div>
  );
}

export function CompanyLogos() {
  const all = CLIENT_ROWS.flat();
  const track = [...all, ...all];

  return (
    <Container className="py-6 lg:py-8">
      <Reveal>
        <div className="mask-fade-x overflow-hidden">
          <div
            className="flex w-max animate-marquee items-center"
            style={{ "--marquee-duration": "42s" } as CSSProperties}
          >
            <LogoTrack logos={track} />
            <LogoTrack logos={track} hidden />
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
