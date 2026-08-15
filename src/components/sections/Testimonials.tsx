"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS, TESTIMONIALS_INTRO, type Testimonial } from "@/lib/content";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CarouselNavigator } from "@/components/ui/CarouselNavigator";
import { LogoImg } from "@/components/ui/LogoImg";

const AUTO_ADVANCE_MS = 2000;

function Stars() {
  return (
    <div className="flex items-center gap-[2px]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-black text-black sm:size-5" strokeWidth={0} />
      ))}
    </div>
  );
}

function QuoteCard({ t, className }: { t: Testimonial; className?: string }) {
  return (
    <figure
      className={cn(
        "flex h-full w-full flex-col justify-between overflow-hidden rounded-[22px] border border-black/[0.08] bg-[#f5f3f1] p-6 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.35)] sm:p-7",
        className,
      )}
    >
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
  const logoSize =
    {
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
  const testimonials = useMemo(() => TESTIMONIALS, []);

  const goTo = (nextIndex: number) => {
    setActive((nextIndex + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (paused || prefersReducedMotion || testimonials.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [paused, testimonials.length]);

  const current = testimonials[active];
  const behindOne = testimonials[(active + 1) % testimonials.length];
  const behindTwo = testimonials[(active + 2) % testimonials.length];

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
            className="relative h-[470px] sm:h-[400px] lg:h-[380px]"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {/* Stacked deck cards behind the active quote */}
            {behindTwo && testimonials.length > 2 ? (
              <div
                aria-hidden
                className="absolute inset-x-5 bottom-2 top-8 rounded-[22px] border border-black/[0.06] bg-[#ebe8e4] shadow-soft sm:inset-x-8"
                style={{ transform: "translateY(18px) scale(0.94) rotate(-1.5deg)" }}
              />
            ) : null}
            {behindOne && testimonials.length > 1 ? (
              <div
                aria-hidden
                className="absolute inset-x-3 bottom-1 top-4 rounded-[22px] border border-black/[0.07] bg-[#f0eeeb] shadow-soft sm:inset-x-5"
                style={{ transform: "translateY(10px) scale(0.97) rotate(1.25deg)" }}
              />
            ) : null}

            <AnimatePresence initial={false}>
              {current ? (
                <m.div
                  key={current.id}
                  initial={{ opacity: 0, y: 22, rotate: -0.6, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, rotate: 0.8, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                  className="absolute inset-0 z-10"
                >
                  <QuoteCard t={current} />
                </m.div>
              ) : null}
            </AnimatePresence>
          </div>

          {testimonials.length > 1 ? (
            <div className="mt-5 flex justify-center">
              <CarouselNavigator
                totalSlides={testimonials.length}
                autoDelay={AUTO_ADVANCE_MS}
                currentIndex={active}
                onIndexChange={goTo}
                isPlaying={!paused}
                previousLabel="Show previous testimonial"
                nextLabel="Show next testimonial"
              />
            </div>
          ) : null}
        </m.div>

        <div className="mt-10 hidden justify-center lg:flex">
          <Button href="#engagement" size="lg">
            {TESTIMONIALS_INTRO.cta}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
