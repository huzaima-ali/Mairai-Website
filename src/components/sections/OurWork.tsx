"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { CASE_STUDIES } from "@/lib/case-studies";
import { WORK_INTRO } from "@/lib/content";
import { EASE_OUT_EXPO, staggerContainer, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PartnerBar } from "@/components/sections/PartnerBar";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";

const AUTO_ADVANCE_MS = 2000;

export function OurWork() {
  const workStudies = useMemo(() => CASE_STUDIES.filter((study) => study.slug !== "cero"), []);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const goTo = (nextIndex: number, nextDirection = 1) => {
    setDirection(nextDirection);
    setActive((nextIndex + workStudies.length) % workStudies.length);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (paused || userPaused || prefersReducedMotion || workStudies.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setDirection(1);
      setActive((current) => (current + 1) % workStudies.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [paused, userPaused, workStudies.length]);

  return (
    <Section id="work">
      <Container>
        <SectionHeader eyebrow={WORK_INTRO.eyebrow} title={WORK_INTRO.title} body={WORK_INTRO.body} />

        <m.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewportOnce} className="mx-auto mt-8 max-w-4xl lg:mt-10">
          <div
            className="overflow-hidden"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="relative aspect-[16/7] min-h-[190px] sm:min-h-[230px] lg:min-h-[280px] xl:min-h-[320px]">
              <AnimatePresence initial={false} custom={direction}>
                {workStudies[active] ? (
                  <m.div
                    key={workStudies[active].slug}
                    custom={direction}
                    initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
                    transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                    className="absolute inset-0"
                  >
                    <CaseStudyCard study={workStudies[active]} reveal={false} className="h-full" />
                  </m.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {workStudies.length > 1 ? (
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2" aria-label="Choose case study">
                {workStudies.map((study, index) => (
                  <button
                    key={study.slug}
                    type="button"
                    onClick={() => goTo(index)}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      active === index ? "w-9 bg-ink" : "w-2.5 bg-black/20 hover:bg-black/35",
                    )}
                    aria-label={`Show ${study.title}`}
                    aria-current={active === index ? "true" : undefined}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => goTo(active - 1, -1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-foreground/40"
                  aria-label="Show previous case study"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setUserPaused((value) => !value)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-foreground/40"
                  aria-label={userPaused ? "Resume case study carousel" : "Pause case study carousel"}
                >
                  {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1, 1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-foreground/40"
                  aria-label="Show next case study"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : null}
        </m.div>
      </Container>

      <div className="mt-10">
        <PartnerBar />
      </div>
    </Section>
  );
}
