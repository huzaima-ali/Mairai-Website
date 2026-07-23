"use client";

import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/content";
import { fadeUp, imageReveal, staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

function ProjectArtwork({ project }: { project: Project }) {
  return (
    <m.div variants={imageReveal} className="group relative">
      <div className="relative aspect-square overflow-hidden rounded-[24px] border border-black/[0.08] bg-[#030303]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/${project.image}`}
          alt={project.title}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
      </div>
    </m.div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
    >
      <ProjectArtwork project={project} />

      <div className="flex flex-col items-start">
        <m.p variants={fadeUp} className="text-2xl text-black/40">
          {project.eyebrow}
        </m.p>
        <m.h3 variants={fadeUp} className="display mt-6 text-[clamp(2rem,4vw,4rem)] leading-[1.05] tracking-[-0.01em]">
          {project.title}
        </m.h3>
        <m.p variants={fadeUp} className="mt-10 text-pretty text-2xl leading-8 text-black/70">
          {project.description}
        </m.p>
        <m.ul variants={fadeUp} className="mt-12 flex flex-col gap-8">
          {project.features.map((feature) => (
            <li key={feature} className="flex items-center gap-4 text-2xl text-black/70">
              <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-foreground/10 text-[10px] text-foreground">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </m.ul>
        <m.p variants={fadeUp} className="mt-12 text-pretty text-2xl leading-8 text-black/70">
          {project.closing}
        </m.p>
        <m.div variants={fadeUp} className="mt-12">
          <Button href="#contact" size="lg" className="group">
            {project.cta}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </m.div>
      </div>
    </m.div>
  );
}

export function Projects() {
  return (
    <Section className="py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-20 lg:gap-28">
          {PROJECTS.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
