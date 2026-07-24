"use client";

import { m } from "framer-motion";
import { Check } from "lucide-react";
import { ENGAGEMENT_INTRO, ENGAGEMENT_MODELS, type EngagementModel } from "@/lib/content";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

function Card({ model }: { model: EngagementModel }) {
  const dark = model.featured;

  return (
    <m.div
      variants={fadeUp}
      className={cn(
        "flex h-full flex-col rounded-2xl border p-7 transition-transform duration-300 hover:-translate-y-1.5 sm:p-8",
        dark
          ? "border-white/10 bg-[#53060c] text-white"
          : "border-black/[0.08] bg-[#f5f3f1] text-foreground",
      )}
    >
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

      <h3 className="mt-5 text-2xl font-medium tracking-snug sm:text-3xl">{model.name}</h3>
      <p
        className={cn(
          "mt-3 text-sm leading-relaxed",
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
        <p className={cn("text-sm font-medium", dark ? "text-white" : "text-foreground")}>
          Best for
        </p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {model.bestFor.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[15px]">
              <span
                className={cn(
                  "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                  dark ? "bg-white" : "bg-black",
                )}
              />
              <span className={dark ? "text-white/45" : "text-black/45"}>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </m.div>
  );
}

export function EngagementModels() {
  return (
    <Section id="engagement">
      <Container>
        <SectionHeader eyebrow={ENGAGEMENT_INTRO.eyebrow} title={ENGAGEMENT_INTRO.title} body={ENGAGEMENT_INTRO.body} />

        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 grid items-stretch gap-5 lg:mt-16 lg:grid-cols-3"
        >
          {ENGAGEMENT_MODELS.map((model) => (
            <Card key={model.id} model={model} />
          ))}
        </m.div>

        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-16 flex justify-center lg:mt-24"
        >
          <Button
            href="#contact"
            size="lg"
            className="h-[72px] w-full max-w-[424px] text-[22px] font-normal"
          >
            Contact Us
          </Button>
        </m.div>
      </Container>
    </Section>
  );
}
