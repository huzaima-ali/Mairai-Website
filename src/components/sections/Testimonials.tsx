"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS, TESTIMONIALS_INTRO, type Testimonial } from "@/lib/content";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { LogoImg } from "@/components/ui/LogoImg";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

function Avatar({ file, name, large }: { file: string; name: string; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const size = large ? "size-12 rounded-xl" : "size-9 rounded-[10px]";

  if (failed) {
    return (
      <span
        className={cn(
          "grid shrink-0 place-items-center bg-[#dee0e2] font-medium text-black/70",
          large ? "text-sm" : "text-xs",
          size,
        )}
      >
        {initials(name)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/testimonials/${file}`}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("shrink-0 object-cover", size)}
    />
  );
}

function Stars({ large }: { large?: boolean }) {
  return (
    <div className="flex items-center gap-[2px]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("fill-black text-black", large ? "size-8" : "size-6")}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

function QuoteCard({ t }: { t: Testimonial }) {
  const large = t.size === "large";
  return (
    <m.figure
      variants={fadeUp}
      className={cn(
        "flex w-full flex-col justify-between rounded-[24px] border border-black/[0.08] bg-[#f5f3f1]",
        large
          ? "px-8 pb-10 pt-12 sm:px-12 sm:pb-12 sm:pt-14 lg:min-h-[560px]"
          : "px-7 pb-8 pt-9 sm:px-8 lg:min-h-[380px]",
      )}
    >
      <div className={cn("flex flex-col", large ? "gap-10 sm:gap-14" : "gap-8")}>
        <blockquote
          className={cn(
            "text-pretty text-black",
            large
              ? "text-[26px] leading-[36px] tracking-[-0.02em] sm:text-[36px] sm:leading-[48px]"
              : "text-2xl leading-9 tracking-[-0.01em]",
          )}
        >
          {t.quote}
        </blockquote>

        <figcaption className={cn("flex items-center", large ? "gap-[18px]" : "gap-3")}>
          <Avatar file={t.avatar} name={t.name} large={large} />
          <div className="flex flex-col gap-1.5">
            <span className={cn("text-black", large ? "text-xl" : "text-base")}>{t.name}</span>
            <span className={cn("text-black/40", large ? "text-base" : "text-xs")}>{t.role}</span>
          </div>
        </figcaption>
      </div>

      <div className="mt-10 flex items-end justify-between">
        <Stars large={large} />
        <BrandMark t={t} large={large} />
      </div>
    </m.figure>
  );
}

/** Decorative gallery tile with Figma photo. */
function GallerySquare({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative hidden size-[196px] shrink-0 overflow-hidden rounded-[24px] border border-black/[0.06] bg-[#f5f3f1] lg:block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" />
    </div>
  );
}

function BrandMark({ t, large }: { t: Testimonial; large?: boolean }) {
  if (t.id === "enorta") {
    return (
      <span className={cn("flex items-center gap-1.5 text-black/25", large ? "text-[28px]" : "text-xl")}>
        <LogoImg
          src="/logos/enorta-testimonial.svg"
          name=""
          className={cn("object-contain opacity-40", large ? "size-6" : "size-5")}
          wordmarkClassName="hidden"
        />
        <span className="font-[family-name:var(--font-sans)] tracking-tight">enorta</span>
      </span>
    );
  }
  if (t.id === "cero") {
    return (
      <span className="flex items-center gap-2 text-black/25">
        <LogoImg
          src="/logos/cero-testimonial.svg"
          name=""
          className="size-[22px] object-contain opacity-40"
          wordmarkClassName="hidden"
        />
        <span className="text-[33px] font-medium leading-none tracking-tight">
          Cero
          <sup className="ml-0.5 text-[15px]">©</sup>
        </span>
      </span>
    );
  }
  return (
    <LogoImg
      src={`/logos/${t.logo.file}`}
      name={t.logo.name}
      className={cn(
        "w-auto object-contain opacity-50 grayscale",
        large ? "max-h-[40px] max-w-[160px]" : "max-h-[28px] max-w-[120px]",
      )}
      wordmarkClassName="text-black/30"
    />
  );
}

export function Testimonials() {
  const [first, middle, last] = TESTIMONIALS;

  return (
    <Section id="testimonials">
      <Container>
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="display mx-auto max-w-3xl text-balance text-center text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.08]"
        >
          {TESTIMONIALS_INTRO.title}
        </m.h2>

        {/* Desktop: staggered three-column layout (exact Figma composition) */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-16 hidden items-center gap-6 lg:flex"
        >
          {first ? (
            <div className="flex flex-1 flex-col items-end gap-6">
              <QuoteCard t={first} />
              <GallerySquare src="/testimonials/gallery-left.png" alt="" />
            </div>
          ) : null}

          {middle ? (
            <div className="flex-[1.5]">
              <QuoteCard t={middle} />
            </div>
          ) : null}

          {last ? (
            <div className="flex flex-1 flex-col items-start gap-6">
              <GallerySquare src="/testimonials/gallery-right.png" alt="" />
              <QuoteCard t={last} />
            </div>
          ) : null}
        </m.div>

        {/* Mobile/tablet: stacked cards */}
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 flex flex-col gap-6 lg:hidden"
        >
          {TESTIMONIALS.map((t) => (
            <QuoteCard key={t.id} t={t} />
          ))}
        </m.div>

        <div className="mt-14 flex justify-center">
          <Button href="#engagement" size="lg">
            {TESTIMONIALS_INTRO.cta}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
