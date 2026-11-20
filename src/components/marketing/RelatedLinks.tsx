import { ArrowUpRight } from "lucide-react";
import { CASE_STUDIES, getCaseStudyUrl } from "@/lib/case-studies";
import type { RelatedLink } from "@/lib/services";

export function RelatedCaseStudyCards({ slugs }: { slugs: string[] }) {
  const studies = CASE_STUDIES.filter((study) => slugs.includes(study.slug));
  if (!studies.length) return null;

  return (
    <section>
      <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug tracking-snug">
        Relevant case studies
      </h2>
      <ul className="mt-5 flex flex-col gap-3">
        {studies.map((study) => (
          <li key={study.slug}>
            <a
              href={getCaseStudyUrl(study.slug)}
              className="group flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-foreground/25"
            >
              <span>
                <span className="block text-[13px] font-medium leading-none tracking-snug text-muted-foreground">
                  {study.eyebrow}
                </span>
                <span className="mt-2 block text-base font-medium text-foreground sm:text-lg">
                  {study.cardTitle}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{study.summary}</span>
              </span>
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-foreground/50 transition-colors group-hover:text-foreground" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RelatedPagePills({
  heading = "Related pages",
  links,
}: {
  heading?: string;
  links: RelatedLink[];
}) {
  if (!links.length) return null;

  return (
    <section>
      <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug tracking-snug">
        {heading}
      </h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors hover:border-foreground/40"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
