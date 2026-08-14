"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, Building2, Sparkles } from "lucide-react";
import {
  getCaseStudyUrl,
  getFeaturedCaseStudies,
  type CaseStudy,
} from "@/lib/case-studies";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CaseStudyVisual } from "@/components/case-studies/CaseStudyVisual";

const AUTO_PLAY_INTERVAL = 5000;

const PRODUCT_ICONS: Record<string, typeof Sparkles> = {
  cero: Sparkles,
  "mira-pulse": Building2,
};

function productLabel(product: CaseStudy) {
  if (product.slug === "cero") return "Cero";
  if (product.slug === "mira-pulse") return "MiraPulse";
  return product.cardTitle;
}

function ProductFeatureCarousel({ products }: { products: CaseStudy[] }) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const length = products.length;

  const currentIndex = length ? ((step % length) + length) % length : 0;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const goTo = (index: number) => {
    if (!length) return;
    const diff = (index - currentIndex + length) % length;
    if (diff > 0) setStep((s) => s + diff);
    else if (diff < 0) setStep((s) => s + (length + diff));
  };

  useEffect(() => {
    if (paused || length <= 1) return;
    const timer = window.setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => window.clearInterval(timer);
  }, [paused, length, nextStep]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    let normalized = diff;
    if (diff > length / 2) normalized -= length;
    if (diff < -length / 2) normalized += length;
    if (normalized === 0) return "active";
    if (normalized === -1) return "prev";
    if (normalized === 1) return "next";
    return "hidden";
  };

  if (!length) return null;

  const active = products[currentIndex]!;

  return (
    <div
      className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:gap-10 xl:gap-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex w-full max-w-md flex-col justify-center gap-3">
        {products.map((product, index) => {
          const isActive = index === currentIndex;
          const Icon = PRODUCT_ICONS[product.slug] ?? Sparkles;

          return (
            <button
              key={product.slug}
              type="button"
              onClick={() => goTo(index)}
              aria-pressed={isActive}
              className={cn(
                "relative flex w-fit items-center gap-3 rounded-full border px-5 py-3.5 text-left transition-colors duration-300 sm:gap-4 sm:px-7 sm:py-4",
                isActive
                  ? "border-white bg-white text-accent shadow-soft"
                  : "border-white/20 bg-transparent text-white/65 hover:border-white/40 hover:text-white",
              )}
            >
              <Icon
                className={cn("h-4 w-4 shrink-0", isActive ? "text-accent" : "text-white/45")}
                aria-hidden
              />
              <span className="text-sm font-medium tracking-snug sm:text-base">{productLabel(product)}</span>
            </button>
          );
        })}
      </div>

      <div className="relative mx-auto aspect-[16/11] w-full max-w-3xl sm:aspect-[16/10]">
        {products.map((product, index) => {
          const status = getCardStatus(index);
          const isActive = status === "active";
          const isPrev = status === "prev";
          const isNext = status === "next";

          return (
            <m.div
              key={product.slug}
              initial={false}
              animate={{
                x: isActive ? 0 : isPrev ? -72 : isNext ? 72 : 0,
                scale: isActive ? 1 : isPrev || isNext ? 0.88 : 0.72,
                opacity: isActive ? 1 : isPrev || isNext ? 0.45 : 0,
                rotate: isPrev ? -2.5 : isNext ? 2.5 : 0,
                zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                pointerEvents: isActive ? "auto" : "none",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 25, mass: 0.8 }}
              className="absolute inset-0 overflow-hidden rounded-[1.75rem] border-[6px] border-[#121212] bg-[#121212] shadow-card sm:rounded-[2.25rem] sm:border-8"
            >
              <CaseStudyVisual
                image={product.cardImage}
                className="absolute inset-0 rounded-none border-0"
                imgClassName={cn(
                  "transition-all duration-700",
                  isActive ? "grayscale-0 blur-0" : "scale-[1.02] brightness-75 grayscale blur-[2px]",
                )}
              />

              {/* Readability scrims - top for CTAs, bottom for copy */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/15 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black via-black/80 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/35 to-transparent"
              />

              <AnimatePresence>
                {isActive ? (
                  <m.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 pt-24 sm:p-8 sm:pt-28"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
                      {String(index + 1).padStart(2, "0")} · {product.eyebrow}
                    </p>
                    <h3 className="mt-2 max-w-xl text-balance text-xl font-medium leading-snug tracking-snug text-white drop-shadow-sm sm:text-2xl">
                      {product.cardTitle}
                    </h3>
                    <p className="mt-2 max-w-lg text-pretty text-sm leading-relaxed text-white/90 sm:text-base">
                      {product.summary}
                    </p>
                  </m.div>
                ) : null}
              </AnimatePresence>

              {isActive ? (
                <div className="pointer-events-auto absolute left-4 right-4 top-4 flex flex-wrap items-center justify-between gap-2 sm:left-6 sm:right-6 sm:top-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                    Live product
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.demoUrl ? (
                      <a
                        href={product.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-medium text-ink shadow-soft transition-opacity hover:opacity-90 sm:text-sm"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {product.demoLabel ?? "Try demo"}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                    <a
                      href={getCaseStudyUrl(product.slug)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60 sm:text-sm"
                    >
                      Case study
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ) : null}
            </m.div>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {active.cardTitle}
      </p>
    </div>
  );
}

export function Projects() {
  const featuredProjects = getFeaturedCaseStudies();

  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="mb-8 max-w-2xl lg:mb-10">
          <p className="eyebrow">Our products</p>
          <h2 className="display mt-3 text-[clamp(2rem,3.5vw,3.25rem)] leading-[1.05]">
            Products we build and ship
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Explore live demos, then dive into the full case studies.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] bg-ink px-5 py-8 sm:px-8 sm:py-10 lg:rounded-[36px] lg:px-10 lg:py-12">
          <ProductFeatureCarousel products={featuredProjects} />
        </div>
      </Container>
    </Section>
  );
}
