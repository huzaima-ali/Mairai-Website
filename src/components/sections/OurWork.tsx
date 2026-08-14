"use client";

import { useEffect, useMemo, useState } from "react";
import { m } from "framer-motion";
import { CASE_STUDIES } from "@/lib/case-studies";
import { WORK_INTRO } from "@/lib/content";
import { staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CarouselNavigator } from "@/components/ui/CarouselNavigator";
import { PartnerBar } from "@/components/sections/PartnerBar";
import { StackedCaseCarousel } from "@/components/case-studies/StackedCaseCarousel";

const AUTO_ADVANCE_MS = 2000;

export function OurWork() {
  const workStudies = useMemo(
    () => CASE_STUDIES.filter((study) => study.slug !== "cero" && study.slug !== "mira-pulse"),
    [],
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (nextIndex: number) => {
    if (!workStudies.length) return;
    setActive((nextIndex + workStudies.length) % workStudies.length);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (paused || prefersReducedMotion || workStudies.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % workStudies.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [paused, workStudies.length]);

  return (
    <Section id="work" className="overflow-x-clip pb-8 sm:pb-10 lg:pb-12">
      <Container>
        <SectionHeader eyebrow={WORK_INTRO.eyebrow} title={WORK_INTRO.title} body={WORK_INTRO.body} />
      </Container>

      {/*
        Full-bleed stage so stacked cards size to the viewport and can peek
        past the page gutters again. Section overflow-x-clip (plus html/body)
        keeps that from creating horizontal page scroll.
      */}
      <m.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto mt-4 w-full max-w-6xl lg:mt-5"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <StackedCaseCarousel studies={workStudies} active={active} onIndexChange={goTo} />

        {workStudies.length > 1 ? (
          <div className="mt-4 flex justify-center sm:mt-5">
            <CarouselNavigator
              totalSlides={workStudies.length}
              autoDelay={AUTO_ADVANCE_MS}
              currentIndex={active}
              onIndexChange={goTo}
              isPlaying={!paused}
              previousLabel="Show previous case study"
              nextLabel="Show next case study"
            />
          </div>
        ) : null}
      </m.div>

      <div className="mt-6 sm:mt-8">
        <PartnerBar />
      </div>
    </Section>
  );
}
