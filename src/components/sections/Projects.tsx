"use client";

import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/content";
import { cn } from "@/lib/utils";
import { fadeUp, imageReveal, staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

function ProjectArtwork({ project }: { project: Project }) {
  return (
    <m.div variants={imageReveal} className="group relative">
      <div className={cn("relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br", project.artwork)}>
        <div aria-hidden className="dot-grid absolute inset-0 text-white/10" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(255,255,255,0.12),transparent_70%)]" />
        <span className="absolute left-6 top-6 text-sm font-medium tracking-snug text-white/80">{project.eyebrow}</span>
        <span className="absolute bottom-6 left-6 right-6 text-2xl font-medium tracking-snug text-white sm:text-3xl">
          {project.title}
        </span>
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
        <m.p variants={fadeUp} className="eyebrow">
          {project.eyebrow}
        </m.p>
        <m.h3 variants={fadeUp} className="display mt-3 text-[clamp(2rem,4vw,3rem)] leading-tight">
          {project.title}
        </m.h3>
        <m.p variants={fadeUp} className="mt-5 text-pretty leading-relaxed text-muted-foreground sm:text-lg">
          {project.description}
        </m.p>
        <m.ul variants={fadeUp} className="mt-6 flex flex-col gap-3">
          {project.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-[15px] text-foreground">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              {feature}
            </li>
          ))}
        </m.ul>
        <m.p variants={fadeUp} className="mt-6 text-pretty leading-relaxed text-muted-foreground sm:text-lg">
          {project.closing}
        </m.p>
        <m.div variants={fadeUp} className="mt-8">
          <Button href="#contact" className="group">
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
