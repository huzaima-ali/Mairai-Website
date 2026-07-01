"use client";

import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { WORK_INTRO, WORK_ITEMS, type WorkItem } from "@/lib/content";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PartnerBar } from "@/components/sections/PartnerBar";

function WorkCard({ item, className }: { item: WorkItem; className?: string }) {
  return (
    <m.a
      href="#contact"
      variants={fadeUp}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-gradient-to-br shadow-card transition-transform duration-500 ease-out-expo hover:-translate-y-1.5",
        item.artwork,
        className,
      )}
    >
      <div aria-hidden className="dot-grid absolute inset-0 text-white/[0.08]" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white/25">
        <ArrowUpRight className="h-5 w-5" />
      </span>
      <span className="absolute bottom-6 left-6 right-6 text-xl font-medium tracking-snug text-white sm:text-2xl">
        {item.title}
      </span>
    </m.a>
  );
}

export function OurWork() {
  const large = WORK_ITEMS.filter((w) => w.size === "large");
  const small = WORK_ITEMS.filter((w) => w.size === "small");

  return (
    <Section id="work">
      <Container>
        <SectionHeader eyebrow={WORK_INTRO.eyebrow} title={WORK_INTRO.title} body={WORK_INTRO.body} />

        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 flex flex-col gap-5 lg:mt-16"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {large.map((item) => (
              <WorkCard key={item.id} item={item} className="aspect-[4/3] sm:aspect-[16/11]" />
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {small.map((item) => (
              <WorkCard key={item.id} item={item} className="aspect-[4/3]" />
            ))}
          </div>
        </m.div>
      </Container>

      <div className="mt-10">
        <PartnerBar />
      </div>
    </Section>
  );
}
