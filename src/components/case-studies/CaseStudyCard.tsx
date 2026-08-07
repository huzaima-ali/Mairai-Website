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
}

export function CaseStudyCard({ study, className, reveal = true }: CaseStudyCardProps) {
  return (
    <m.a
      href={getCaseStudyUrl(study.slug)}
      variants={reveal ? fadeUp : undefined}
      className={cn(
        "group relative block overflow-hidden rounded-[24px] shadow-card transition-transform duration-500 ease-out-expo hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <CaseStudyVisual
        image={study.cardImage}
        className="absolute inset-0 rounded-[24px]"
        imgClassName="transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg bg-white/20 text-white backdrop-blur-[21px] transition-all duration-300 group-hover:bg-white/30">
        <ArrowUpRight className="h-4 w-4" />
      </span>
      <span className="absolute bottom-4 left-4 right-14 rounded-[10px] bg-white/20 px-5 py-4 text-lg font-medium tracking-snug text-white backdrop-blur-[21px] sm:text-xl lg:text-2xl lg:leading-tight lg:tracking-[-0.01em]">
        {study.cardTitle}
      </span>
    </m.a>
  );
}
