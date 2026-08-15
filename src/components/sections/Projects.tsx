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
      className="grid items-stretch gap-5 sm:gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-8 xl:gap-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Mobile: horizontal chip row · Desktop: compact vertical list */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
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
                "relative flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-3 text-left transition-colors duration-300 sm:gap-3 sm:px-5 sm:py-3.5",
                isActive
                  ? "border-white bg-white text-accent shadow-soft"
                  : "border-white/20 bg-transparent text-white/65 hover:border-white/40 hover:text-white",
              )}
            >
              <Icon
                className={cn("h-4 w-4 shrink-0", isActive ? "text-accent" : "text-white/45")}
                aria-hidden
              />
              <span className="whitespace-nowrap text-sm font-medium tracking-snug sm:text-base">
                {productLabel(product)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative mx-auto aspect-[4/5] w-full max-w-none sm:aspect-[16/11] lg:aspect-[16/10] lg:max-w-none">
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
                x: isActive ? 0 : isPrev ? -40 : isNext ? 40 : 0,
                scale: isActive ? 1 : isPrev || isNext ? 0.92 : 0.82,
                opacity: isActive ? 1 : isPrev || isNext ? 0.35 : 0,
                rotate: isPrev ? -1.5 : isNext ? 1.5 : 0,
                zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                pointerEvents: isActive ? "auto" : "none",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 25, mass: 0.8 }}
              className="absolute inset-0 overflow-hidden rounded-[1.5rem] border-[5px] border-[#0a0a0a] bg-[#121212] shadow-card sm:rounded-[2rem] sm:border-[6px] lg:rounded-[2.25rem] lg:border-8"
            >
              <CaseStudyVisual
                image={product.cardImage}
                className="absolute inset-0 rounded-none border-0"
                imgClassName={cn(
                  "transition-all duration-700",
                  isActive ? "grayscale-0 blur-0" : "scale-[1.02] brightness-75 grayscale blur-[2px]",
                )}
              />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/15 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black via-black/85 to-transparent"
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
                    className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 pt-20 sm:p-7 sm:pt-24 lg:p-8 lg:pt-28"
                  >
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/70 sm:text-[11px]">
                      {String(index + 1).padStart(2, "0")} · {product.eyebrow}
                    </p>
                    <h3 className="mt-1.5 max-w-xl text-balance text-lg font-medium leading-snug tracking-snug text-white drop-shadow-sm sm:mt-2 sm:text-xl lg:text-2xl">
                      {product.cardTitle}
                    </h3>
                    <p className="mt-1.5 line-clamp-3 max-w-lg text-pretty text-sm leading-relaxed text-white/90 sm:mt-2 sm:line-clamp-none sm:text-base">
                      {product.summary}
                    </p>
                  </m.div>
                ) : null}
              </AnimatePresence>

              {isActive ? (
                <div className="pointer-events-auto absolute left-3 right-3 top-3 flex flex-wrap items-center justify-between gap-2 sm:left-5 sm:right-5 sm:top-5 lg:left-6 lg:right-6 lg:top-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                    Live product
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.demoUrl ? (
                      <a
                        href={product.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-ink shadow-soft transition-opacity hover:opacity-90 sm:px-3.5 sm:py-2 sm:text-sm"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {product.demoLabel ?? "Try demo"}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                    <a
                      href={getCaseStudyUrl(product.slug)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60 sm:px-3.5 sm:py-2 sm:text-sm"
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
        <div className="mb-6 max-w-2xl sm:mb-8 lg:mb-10">
          <p className="eyebrow">Our products</p>
          <h2 className="display mt-3 text-[clamp(2rem,3.5vw,3.25rem)] leading-[1.05]">
            Products we build and ship
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Explore live demos, then dive into the full case studies.
          </p>
        </div>

        <div className="overflow-hidden rounded-[24px] bg-ink px-4 py-6 sm:rounded-[28px] sm:px-6 sm:py-8 lg:rounded-[36px] lg:px-8 lg:py-10">
          <ProductFeatureCarousel products={featuredProjects} />
        </div>
      </Container>
    </Section>
  );
}
