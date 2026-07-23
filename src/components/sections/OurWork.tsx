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
        "group relative block overflow-hidden rounded-[24px] border border-black/[0.08] shadow-card transition-transform duration-500 ease-out-expo hover:-translate-y-1.5",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/${item.image}`}
        alt={item.title}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
      <span className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-2xl border border-white/16 bg-white/20 text-white backdrop-blur-[21px] transition-all duration-300 group-hover:bg-white/30">
        <ArrowUpRight className="h-5 w-5" />
      </span>
      <span className="absolute bottom-6 left-6 right-16 rounded-[10px] border border-white/16 bg-white/20 px-6 py-5 text-xl font-medium tracking-snug text-white backdrop-blur-[21px] sm:text-2xl lg:text-[32px] lg:leading-none lg:tracking-[-0.01em]">
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
          className="mt-12 flex flex-col gap-6 lg:mt-16"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {large.map((item) => (
              <WorkCard key={item.id} item={item} className="aspect-[768/720] min-h-[280px]" />
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {small.map((item) => (
              <WorkCard key={item.id} item={item} className="aspect-[504/372] min-h-[220px]" />
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
