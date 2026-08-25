"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { REGION_PAGES } from "@/lib/regions";
import { RegionsGlobe, REGION_HOTSPOTS, type GlobeFocusId } from "@/components/regions/RegionsGlobe";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageBackLink } from "@/components/ui/PageBackLink";
import { cn } from "@/lib/utils";

export function RegionsPageContent() {
  const [focusId, setFocusId] = useState<GlobeFocusId>(null);

  return (
    <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <Container>
        <PageBackLink />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12 xl:gap-14">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">Regions</p>
            <h1 className="display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
              AI and technology delivery across key markets
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Explore how Mirai Studios partners with companies in the United States, United Kingdom and Middle
              East. Our product and engineering delivery studio is based in Pakistan.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {REGION_PAGES.map((page) => {
                const active = focusId === page.slug;
                return (
                  <li key={page.slug}>
                    <a
                      href={page.path}
                      onMouseEnter={() => setFocusId(page.slug as GlobeFocusId)}
                      onFocus={() => setFocusId(page.slug as GlobeFocusId)}
                      className={cn(
                        "group block rounded-2xl border px-5 py-4 transition-colors",
                        active
                          ? "border-accent/40 bg-accent-soft/40"
                          : "border-border bg-surface hover:border-foreground/25",
                      )}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block text-lg font-medium text-foreground">{page.title}</span>
                          <span className="mt-1 block text-sm text-muted-foreground">{page.metaDescription}</span>
                        </span>
                        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-foreground/40 transition-colors group-hover:text-foreground" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onMouseEnter={() => setFocusId("pakistan")}
              onFocus={() => setFocusId("pakistan")}
              onClick={() => setFocusId("pakistan")}
              className={cn(
                "mt-3 w-full rounded-2xl border px-5 py-4 text-left transition-colors",
                focusId === "pakistan"
                  ? "border-emerald-600/30 bg-emerald-50"
                  : "border-border bg-surface hover:border-foreground/25",
              )}
            >
              <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Delivery studio
              </span>
              <span className="mt-1 block text-lg font-medium text-foreground">Pakistan</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Back office and development team based in Pakistan, collaborating with clients across US, UK and
                MENA time zones.
              </span>
            </button>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
              {REGION_HOTSPOTS.map((spot) => (
                <span key={spot.id} className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: spot.color }} />
                  {spot.id === "pakistan" ? "Pakistan studio" : spot.label}
                </span>
              ))}
            </div>
          </div>

          <RegionsGlobe
            focusId={focusId}
            onFocusChange={setFocusId}
            className="lg:sticky lg:top-24"
          />
        </div>
      </Container>
    </Section>
  );
}
