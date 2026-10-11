"use client";

import { m } from "framer-motion";
import { HERO } from "@/lib/content";
import { heroReveal, staggerContainer } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AsciiVoxelArt } from "@/components/hero/AsciiVoxelArt";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-y-0 right-0 w-full max-lg:opacity-40 lg:left-[42%] lg:w-auto lg:opacity-100"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, transparent 6%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0.75) 38%, #000 58%)",
            maskImage:
              "linear-gradient(90deg, transparent 0%, transparent 6%, rgba(0,0,0,0.35) 22%, rgba(0,0,0,0.75) 38%, #000 58%)",
          }}
        >
          <div className="pointer-events-auto h-full w-full">
            <AsciiVoxelArt src="/images/mirai-mark-ascii.png" className="h-full w-full" />
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--background)) 0%, hsl(var(--background)) 34%, hsl(var(--background) / 0.88) 48%, hsl(var(--background) / 0.45) 62%, hsl(var(--background) / 0.12) 78%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/85 to-transparent"
        />
      </div>

      <Container className="relative z-10">
        <m.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12"
        >
          <div className="max-w-xl">
            <m.p custom={0} variants={heroReveal} className="eyebrow mb-5">
              {HERO.eyebrow}
            </m.p>
            <m.h1
              custom={1}
              variants={heroReveal}
              className="display text-[clamp(2.85rem,7vw,5rem)] leading-[0.94]"
            >
              {HERO.headlineLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </m.h1>

            <m.p
              custom={2}
              variants={heroReveal}
              className="mt-7 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {HERO.body}
            </m.p>

            <m.div custom={3} variants={heroReveal} className="mt-10 flex flex-wrap items-center gap-3 sm:mt-12">
              <Button href={HERO.primaryHref}>{HERO.primaryCta}</Button>
              <Button href={HERO.secondaryHref} variant="outline">
                {HERO.secondaryCta}
              </Button>
            </m.div>
          </div>

          <div className="hidden min-h-[22rem] lg:block" aria-hidden />
        </m.div>
      </Container>
    </section>
  );
}
