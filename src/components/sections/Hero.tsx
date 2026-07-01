"use client";

import { m } from "framer-motion";
import { HERO, STATS } from "@/lib/content";
import { heroReveal, imageReveal, staggerContainer } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { StatValue } from "@/components/ui/StatValue";

export function Hero() {
  return (
    <section id="top" className="pt-14 sm:pt-16 lg:pt-20">
      <Container>
        <m.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <m.h1
            custom={0}
            variants={heroReveal}
            className="display max-w-xl text-balance text-[clamp(2.75rem,6.5vw,4.5rem)] leading-[0.98]"
          >
            {HERO.headline}
          </m.h1>
          <m.p
            custom={1}
            variants={heroReveal}
            className="self-end text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:max-w-lg lg:justify-self-end"
          >
            {HERO.body}
          </m.p>
        </m.div>

        <m.div custom={2} variants={heroReveal} initial="hidden" animate="show" className="mt-8">
          <Button href="#contact">{HERO.cta}</Button>
        </m.div>
      </Container>

      <Container className="mt-12 lg:mt-16">
        <m.div
          variants={imageReveal}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Atmospheric red stage */}
          <div
            className="relative min-h-[480px] sm:min-h-[560px] lg:min-h-[620px]"
            style={{
              background:
                "radial-gradient(130% 120% at 28% 18%, #8a121d 0%, #520a12 42%, #1c0407 72%, #0a0203 100%)",
            }}
          >
            <div aria-hidden className="dot-grid absolute inset-0 text-white/[0.14]" />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "radial-gradient(60% 50% at 70% 35%, rgba(0,0,0,0.45), transparent 70%)" }}
            />

            {/* Glass stat cards */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 lg:p-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.1] sm:p-6"
                  >
                    <StatValue stat={stat} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </m.div>
      </Container>
    </section>
  );
}
