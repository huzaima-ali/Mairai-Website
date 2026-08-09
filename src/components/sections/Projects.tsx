"use client";

import { m } from "framer-motion";
import { getCaseStudyUrl, getFeaturedCaseStudies, type CaseStudy } from "@/lib/case-studies";
import { fadeUp, imageReveal, staggerContainer, viewportOnce } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CaseStudyVisual } from "@/components/case-studies/CaseStudyVisual";

function ProjectArtwork({ project }: { project: CaseStudy }) {
  return (
    <m.div
      variants={imageReveal}
      className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-black/[0.08] bg-[#030303]"
    >
      <CaseStudyVisual
        image={project.heroImage ?? project.cardImage}
        className="absolute inset-0 rounded-none border-0"
        imgClassName="transition-transform duration-700 ease-out-expo group-hover/project:scale-[1.03]"
      />
    </m.div>
  );
}

function ProjectRow({ project }: { project: CaseStudy }) {
  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="group/project relative isolate grid items-center gap-8 rounded-[28px] transition-colors duration-300 hover:bg-black/[0.02] lg:grid-cols-[0.9fr_1.1fr] lg:gap-[clamp(2rem,3vw,3.5rem)]"
    >
      <a
        href={getCaseStudyUrl(project.slug)}
        className="absolute inset-0 z-20 rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
        aria-label={`Open ${project.title} case study`}
      />
      <ProjectArtwork project={project} />

      <div className="flex min-w-0 flex-col items-start">
        <m.p variants={fadeUp} className="text-base text-black/40 sm:text-lg">
          {project.eyebrow}
        </m.p>
        <m.h3
          variants={fadeUp}
          className="display mt-4 text-[clamp(2rem,3vw,3.25rem)] leading-[1.05] tracking-[-0.01em]"
        >
          {project.title}
        </m.h3>
        <m.p
          variants={fadeUp}
          className="mt-5 line-clamp-1 text-pretty text-base leading-relaxed text-black/70 sm:line-clamp-none sm:text-lg"
        >
          {project.summary}
        </m.p>
        <m.ul
          variants={fadeUp}
          className="mt-5 hidden list-disc flex-col gap-2.5 pl-6 sm:flex"
        >
          {project.projectInfo.map((info) => (
            <li key={info.label} className="text-base leading-relaxed text-black/70 sm:text-lg">
              {info.value}
            </li>
          ))}
        </m.ul>
        <m.p
          variants={fadeUp}
          className="mt-5 hidden text-pretty text-base leading-relaxed text-black/70 sm:block sm:text-lg"
        >
          {project.sections[0]?.body.at(-1)}
        </m.p>
        <m.div variants={fadeUp} className="mt-7">
          <span className="pill h-14 bg-ink text-white transition-all duration-300 group-hover/project:shadow-pill">
            View Project
          </span>
        </m.div>
      </div>
    </m.div>
  );
}

export function Projects() {
  const featuredProjects = getFeaturedCaseStudies();

  return (
    <Section className="py-8 sm:py-10 lg:py-12">
      <Container>
        <div className="flex flex-col gap-14 lg:gap-20">
          {featuredProjects.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
