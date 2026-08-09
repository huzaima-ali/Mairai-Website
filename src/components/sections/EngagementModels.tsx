"use client";

import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { ENGAGEMENT_INTRO, ENGAGEMENT_MODELS, type EngagementModel } from "@/lib/content";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useMediaQuery } from "@/hooks/use-media-query";

function CardBody({ model, showTitle = true }: { model: EngagementModel; showTitle?: boolean }) {
  const dark = model.featured;

  return (
    <>
      <span
        className={cn(
          "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium",
          dark
            ? "border-white/15 bg-white/[0.12] text-white"
            : "border-black/[0.08] bg-black/[0.02] text-foreground",
        )}
      >
        {model.badge}
      </span>

      {showTitle ? (
        <h3 className="mt-5 text-2xl font-medium tracking-snug sm:text-3xl">{model.name}</h3>
      ) : null}
      <p
        className={cn(
          "text-sm leading-relaxed",
          showTitle ? "mt-3" : "mt-4",
          dark ? "text-white/45" : "text-black/45",
        )}
      >
        {model.description}
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {model.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[15px]">
            <Check className={cn("mt-0.5 h-4 w-4 shrink-0", dark ? "text-white" : "text-black")} />
            <span className={dark ? "text-white/45" : "text-black/45"}>{f}</span>
          </li>
        ))}
      </ul>

      <div className={cn("my-7 h-px", dark ? "bg-white/15" : "bg-black/10")} />

      <div className="flex flex-1 flex-col">
        <p className={cn("text-sm font-medium", dark ? "text-white" : "text-foreground")}>Best for</p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {model.bestFor.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[15px]">
              <span
                className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", dark ? "bg-white" : "bg-black")}
              />
              <span className={dark ? "text-white/45" : "text-black/45"}>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function DesktopCards() {
  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="mt-12 grid items-stretch gap-5 lg:mt-16 lg:grid-cols-3"
    >
      {ENGAGEMENT_MODELS.map((model) => {
        const dark = model.featured;
        return (
          <m.div
            key={model.id}
            variants={fadeUp}
            className={cn(
              "flex h-full flex-col rounded-2xl border p-7 transition-transform duration-300 hover:-translate-y-1.5 sm:p-8",
              dark
                ? "border-white/10 bg-[#53060c] text-white"
                : "border-black/[0.08] bg-[#f5f3f1] text-foreground",
            )}
          >
            <CardBody model={model} />
          </m.div>
        );
      })}
    </m.div>
  );
}

function MobileAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <ul className="mt-10 border-t border-black/[0.08]">
      {ENGAGEMENT_MODELS.map((model) => {
        const open = openId === model.id;
        const dark = model.featured;
        const panelId = `engagement-panel-${model.id}`;
        const buttonId = `engagement-trigger-${model.id}`;

        return (
          <li key={model.id} className="border-b border-black/[0.08]">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : model.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="text-xl font-medium tracking-snug text-foreground">{model.name}</span>
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/[0.08] bg-[#f5f3f1] text-foreground transition-transform duration-300",
                    open && "rotate-180",
                  )}
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {open ? (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                  className="pb-5"
                >
                  <div
                    className={cn(
                      "rounded-2xl border p-5",
                      dark
                        ? "border-white/10 bg-[#53060c] text-white"
                        : "border-black/[0.08] bg-[#f5f3f1] text-foreground",
                    )}
                  >
                    <CardBody model={model} showTitle={false} />
                  </div>
                </m.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

export function EngagementModels() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <Section id="engagement">
      <Container>
        <SectionHeader eyebrow={ENGAGEMENT_INTRO.eyebrow} title={ENGAGEMENT_INTRO.title} body={ENGAGEMENT_INTRO.body} />
        {isDesktop ? <DesktopCards /> : <MobileAccordion />}
      </Container>
    </Section>
  );
}
