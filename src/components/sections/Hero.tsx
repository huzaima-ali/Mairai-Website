"use client";

import { m } from "framer-motion";
import { HERO } from "@/lib/content";
import { heroReveal, staggerContainer } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

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
    </section>
  );
}
