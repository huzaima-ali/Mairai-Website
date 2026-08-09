"use client";

import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getCaseStudyUrl, type CaseStudy } from "@/lib/case-studies";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { CaseStudyVisual } from "@/components/case-studies/CaseStudyVisual";

interface CaseStudyCardProps {
  study: CaseStudy;
  className?: string;
  reveal?: boolean;
  /** When true, title stays centered at all breakpoints. */
  centerTitle?: boolean;
  /** When false, renders a non-link surface for use inside another interactive control. */
  interactive?: boolean;
}

export function CaseStudyCard({
  study,
  className,
  reveal = true,
  centerTitle = false,
  interactive = true,
}: CaseStudyCardProps) {
  const classNames = cn(
    "group relative block h-full overflow-hidden rounded-[24px] shadow-card transition-transform duration-500 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    interactive && "hover:-translate-y-1.5",
    className,
  );

  const content = (
    <>
      <CaseStudyVisual
        image={study.cardImage}
        className="absolute inset-0 rounded-[24px]"
        imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
      <span className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-lg bg-white/20 text-white backdrop-blur-[21px] transition-all duration-300 group-hover:bg-white/30">
        <ArrowUpRight className="h-4 w-4" />
      </span>
      <span
        className={cn(
          "absolute inset-x-4 bottom-4 z-10 flex min-h-[3.5rem] items-center rounded-[10px] bg-white/20 px-4 py-3 text-base font-medium tracking-snug text-white backdrop-blur-[21px] sm:min-h-[3.75rem] sm:px-5 sm:py-4 sm:text-xl lg:text-2xl lg:leading-tight lg:tracking-[-0.01em]",
          centerTitle ? "justify-center text-center" : "justify-center text-center lg:justify-start lg:pr-14 lg:text-left",
        )}
      >
        <span
          className={cn(
            "w-full text-balance",
            centerTitle ? "text-center" : "text-center lg:text-left",
          )}
        >
          {study.cardTitle}
        </span>
      </span>
    </>
  );

  if (!interactive) {
    return (
      <m.div variants={reveal ? fadeUp : undefined} className={classNames} aria-hidden>
        {content}
      </m.div>
    );
  }

  return (
    <m.a
      href={getCaseStudyUrl(study.slug)}
      variants={reveal ? fadeUp : undefined}
      className={classNames}
      aria-label={`Open ${study.title} case study`}
    >
      {content}
    </m.a>
  );
}
