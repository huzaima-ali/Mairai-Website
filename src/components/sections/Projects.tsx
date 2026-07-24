"use client";

import { m } from "framer-motion";
import { PROJECTS, type Project } from "@/lib/content";
import { fadeUp, imageReveal, staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

function ProjectArtwork({ project }: { project: Project }) {
  return (
    <m.div
      variants={imageReveal}
      className="group relative aspect-square overflow-hidden rounded-[24px] border border-black/[0.08] bg-[#030303] lg:aspect-auto"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/${project.image}`}
        alt={project.title}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
      />
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
      className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-[clamp(3rem,4.1667vw,5rem)]"
    >
      <ProjectArtwork project={project} />

      <div className="flex min-w-0 flex-col items-start">
        <m.p variants={fadeUp} className="text-[clamp(1.125rem,1.25vw,1.5rem)] text-black/40">
          {project.eyebrow}
        </m.p>
        <m.h3
          variants={fadeUp}
          className="display mt-[clamp(1rem,1.25vw,1.5rem)] text-[clamp(2.5rem,3.333vw,4rem)] leading-[1.05] tracking-[-0.01em]"
        >
          {project.title}
        </m.h3>
        <m.p
          variants={fadeUp}
          className="mt-[clamp(1.5rem,2.083vw,2.5rem)] text-pretty text-[clamp(1.125rem,1.25vw,1.5rem)] leading-[1.35] text-black/70"
        >
          {project.description}
        </m.p>
        <m.ul
          variants={fadeUp}
          className="mt-[clamp(1.25rem,1.667vw,2rem)] flex list-disc flex-col gap-[clamp(0.75rem,0.938vw,1.125rem)] pl-7"
        >
          {project.features.map((feature) => (
            <li key={feature} className="text-[clamp(1.125rem,1.25vw,1.5rem)] leading-[1.35] text-black/70">
              {feature}
            </li>
          ))}
        </m.ul>
        <m.p
          variants={fadeUp}
          className="mt-[clamp(1.5rem,2.083vw,2.5rem)] text-pretty text-[clamp(1.125rem,1.25vw,1.5rem)] leading-[1.35] text-black/70"
        >
          {project.closing}
        </m.p>
        <m.div variants={fadeUp} className="mt-[clamp(2rem,2.5vw,3rem)]">
          <Button href="#contact" size="lg">
            {project.cta}
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
