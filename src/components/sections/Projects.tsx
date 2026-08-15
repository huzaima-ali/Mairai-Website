"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import {
  getCaseStudyUrl,
  getFeaturedCaseStudies,
  type CaseStudy,
} from "@/lib/case-studies";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CarouselNavigator } from "@/components/ui/CarouselNavigator";
import { CaseStudyVisual } from "@/components/case-studies/CaseStudyVisual";

const AUTO_ADVANCE_MS = 4000;

function productShortName(product: CaseStudy) {
  if (product.slug === "cero") return "Cero";
  if (product.slug === "mira-pulse") return "MiraPulse";
  return product.cardTitle;
}

function ProductCard({
  product,
  index,
  className,
}: {
  product: CaseStudy;
  index: number;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-[#111] shadow-[0_18px_50px_-28px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[16/10]">
        <CaseStudyVisual
          image={product.cardImage}
          className="absolute inset-0 rounded-none border-0"
          imgClassName="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/45 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/35 via-transparent to-transparent"
        />

        <div className="absolute left-3 top-3 flex items-center gap-2 sm:left-4 sm:top-4">
          <span className="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/80 backdrop-blur-md sm:px-3.5 sm:py-2 sm:text-xs">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-md sm:px-3.5 sm:py-2 sm:text-sm">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-55" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent sm:h-2.5 sm:w-2.5" />
            </span>
            Live
          </span>
        </div>
      </div>

      <div className="relative z-[1] -mt-10 flex flex-1 flex-col gap-4 px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
            {product.eyebrow}
          </p>
          <h3 className="mt-1.5 text-balance text-xl font-medium leading-snug tracking-snug text-white sm:text-[1.35rem]">
            {productShortName(product)}
          </h3>
          <p className="mt-2 line-clamp-2 text-pretty text-sm leading-relaxed text-white/65">
            {product.summary}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {product.demoUrl ? (
            <a
              href={product.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              {product.demoLabel ?? "Try demo"}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          <a
            href={getCaseStudyUrl(product.slug)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Case study
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

function MobileProductStack({ products }: { products: CaseStudy[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (nextIndex: number) => {
    setActive((nextIndex + products.length) % products.length);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || prefersReducedMotion || products.length <= 1) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % products.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [paused, products.length]);

  const current = products[active];

  return (
    <div className="md:hidden">
      <div
        className="relative h-[420px]"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {products.length > 1 ? (
          <div
            aria-hidden
            className="absolute inset-x-4 bottom-1 top-6 rounded-[22px] bg-[#1a1a1a] shadow-soft"
            style={{ transform: "translateY(12px) scale(0.96) rotate(1.4deg)" }}
          />
        ) : null}
        {products.length > 1 ? (
          <div
            aria-hidden
            className="absolute inset-x-2 bottom-0.5 top-3 rounded-[22px] bg-[#151515] shadow-soft"
            style={{ transform: "translateY(6px) scale(0.98) rotate(-1deg)" }}
          />
        ) : null}

        <AnimatePresence initial={false}>
          {current ? (
            <m.div
              key={current.slug}
              initial={{ opacity: 0, y: 20, rotate: -0.6, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, rotate: 0.7, scale: 0.98 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="absolute inset-0 z-10"
            >
              <ProductCard product={current} index={active} />
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>

      {products.length > 1 ? (
        <div className="mt-5 flex justify-center">
          <CarouselNavigator
            totalSlides={products.length}
            autoDelay={AUTO_ADVANCE_MS}
            currentIndex={active}
            onIndexChange={goTo}
            isPlaying={!paused}
            previousLabel="Show previous product"
            nextLabel="Show next product"
          />
        </div>
      ) : null}
    </div>
  );
}

export function Projects() {
  const featuredProjects = getFeaturedCaseStudies();

  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">Our products</p>
          <h2 className="display mt-3 text-[clamp(2rem,3.5vw,3.25rem)] leading-[1.05]">
            Products we build and ship
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Explore live demos, then dive into the full case studies.
          </p>
        </div>

        <MobileProductStack products={featuredProjects} />

        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="hidden gap-5 md:grid md:grid-cols-2 lg:gap-6"
        >
          {featuredProjects.map((product, index) => (
            <m.div key={product.slug} variants={fadeUp}>
              <ProductCard product={product} index={index} />
            </m.div>
          ))}
        </m.div>
      </Container>
    </Section>
  );
}
