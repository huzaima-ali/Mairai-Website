"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Star } from "lucide-react";
import { TESTIMONIALS, TESTIMONIALS_INTRO, type Testimonial } from "@/lib/content";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { LogoImg } from "@/components/ui/LogoImg";

function Stars() {
  return (
    <div className="flex items-center gap-[2px]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="size-4 fill-black text-black sm:size-5"
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

function QuoteCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full w-full flex-col justify-between overflow-hidden rounded-[22px] border border-black/[0.08] bg-[#f5f3f1] p-6 sm:p-7">
      <div className="flex min-h-0 flex-col gap-5">
        <Stars />
        <blockquote className="overflow-hidden text-pretty text-lg leading-7 tracking-[-0.01em] text-black sm:text-2xl sm:leading-8">
          {t.quote}
        </blockquote>
      </div>

      <figcaption className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-base font-medium text-black">{t.name}</span>
          <span className="text-sm leading-relaxed text-black/45">{t.role}</span>
        </div>
        <BrandMark t={t} />
      </figcaption>
    </figure>
  );
}

function BrandMark({ t }: { t: Testimonial }) {
  const logoSize = {
    cero: "h-7 w-7",
    enorta: "h-7 w-7",
    lillyai: "h-7 w-[80px]",
    thyssenkrupp: "h-7 max-w-32",
  }[t.id] ?? "h-7 max-w-32";

  return (
    <span className="flex h-8 w-36 shrink-0 items-center justify-start sm:justify-end">
      <LogoImg
        src={`/logos/${t.logo.file}`}
        name={t.logo.name}
        className={cn("w-auto object-contain opacity-45 grayscale", logoSize)}
        wordmarkClassName="text-left text-lg leading-none text-black/30 sm:text-right"
      />
    </span>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const testimonials = useMemo(() => TESTIMONIALS, []);

  const goTo = (nextIndex: number) => {
    setActive((nextIndex + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (paused || userPaused || prefersReducedMotion || testimonials.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [paused, testimonials.length, userPaused]);

  const current = testimonials[active];

  return (
    <Section id="testimonials">
      <Container>
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="display mx-auto max-w-3xl text-balance text-center text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.08]"
        >
          {TESTIMONIALS_INTRO.title}
        </m.h2>

        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto mt-8 max-w-3xl lg:mt-10"
        >
          <div
            className="relative h-[430px] sm:h-[360px] lg:h-[340px]"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <AnimatePresence initial={false}>
              {current ? (
                <m.div
                  key={current.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                  className="absolute inset-0"
                >
                  <QuoteCard t={current} />
                </m.div>
              ) : null}
            </AnimatePresence>
          </div>

          {testimonials.length > 1 ? (
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2" aria-label="Choose testimonial">
                {testimonials.map((t, index) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => goTo(index)}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      active === index ? "w-9 bg-ink" : "w-2.5 bg-black/20 hover:bg-black/35",
                    )}
                    aria-label={`Show testimonial ${index + 1} of ${testimonials.length}`}
                    aria-current={active === index ? "true" : undefined}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-foreground/40"
                  aria-label="Show previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setUserPaused((value) => !value)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-foreground/40"
                  aria-label={userPaused ? "Resume testimonial carousel" : "Pause testimonial carousel"}
                >
                  {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-foreground/40"
                  aria-label="Show next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : null}
        </m.div>

        <div className="mt-10 flex justify-center">
          <Button href="#engagement" size="lg">
            {TESTIMONIALS_INTRO.cta}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
