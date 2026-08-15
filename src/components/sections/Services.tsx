"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { SERVICES, SERVICES_INTRO, type Service } from "@/lib/content";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServicesVoxel } from "@/components/voxel/ServicesVoxel";
import type { ServiceSculptureId } from "@/components/voxel";
import { useMediaQuery } from "@/hooks/use-media-query";

const TRANSITION_MS = 0.3;
const DESKTOP_QUERY = "(min-width: 1024px)";
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function isSculptureId(id: string): id is ServiceSculptureId {
  return SERVICES.some((service) => service.id === id);
}

function formatIndex(number: string) {
  return number;
}

function CapabilityChips({ capabilities, className }: { capabilities: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {capabilities.map((capability) => (
        <li
          key={capability}
          className="rounded-full border border-black/[0.08] bg-white/70 px-3 py-1.5 text-xs font-medium tracking-snug text-foreground/80 sm:text-[13px]"
        >
          {capability}
        </li>
      ))}
    </ul>
  );
}

function ServiceDetails({
  service,
  className,
  showTitle = true,
  media,
}: {
  service: Service;
  className?: string;
  showTitle?: boolean;
  media?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {showTitle ? (
        <h3 className="display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.1] tracking-snug">{service.title}</h3>
      ) : null}
      <p
        className={cn(
          "max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base",
          showTitle ? "mt-3" : "mt-0",
        )}
      >
        {service.description}
      </p>
      {media ? <div className="mt-5">{media}</div> : null}
      <CapabilityChips capabilities={service.capabilities} className="mt-5" />
      <a
        href={service.href}
        className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Explore our work
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}

function ServiceSelector({
  services,
  activeId,
  onSelect,
  onHoverChange,
  enableHoverPreview,
  labelledBy,
}: {
  services: Service[];
  activeId: string;
  onSelect: (id: string) => void;
  onHoverChange?: (id: string | null) => void;
  enableHoverPreview?: boolean;
  labelledBy: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  const focusTab = (index: number) => {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = services.findIndex((service) => service.id === activeId);
    if (currentIndex < 0 || services.length === 0) return;

    const selectAt = (index: number) => {
      const service = services[index];
      if (!service) return;
      onSelect(service.id);
      focusTab(index);
    };

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectAt((currentIndex + 1) % services.length);
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectAt((currentIndex - 1 + services.length) % services.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectAt(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      selectAt(services.length - 1);
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation="vertical"
      aria-labelledby={labelledBy}
      onKeyDown={onKeyDown}
      onMouseLeave={() => {
        if (enableHoverPreview) onHoverChange?.(null);
      }}
      className="relative flex flex-col border-t border-black/[0.08]"
    >
      {services.map((service) => {
        const selected = service.id === activeId;
        return (
          <button
            key={service.id}
            type="button"
            role="tab"
            id={`service-tab-${service.id}`}
            aria-selected={selected}
            aria-controls={`service-panel-${service.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(service.id)}
            onMouseEnter={() => {
              if (enableHoverPreview && !selected) onHoverChange?.(service.id);
            }}
            className={cn(
              "group relative flex min-h-[56px] w-full items-start gap-4 border-b border-black/[0.08] px-3 py-5 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4",
              selected ? "bg-black/[0.03]" : "bg-transparent hover:bg-black/[0.015]",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "absolute inset-y-3 left-0 w-[2px] rounded-full transition-all duration-300",
                selected
                  ? "bg-accent opacity-100"
                  : "bg-transparent opacity-0 group-hover:bg-black/20 group-hover:opacity-100",
              )}
            />
            <span
              className={cn(
                "mt-1 shrink-0 font-mono text-[11px] tracking-[0.08em] transition-colors duration-300 sm:text-xs",
                selected ? "text-foreground/70" : "text-foreground/35",
              )}
            >
              {formatIndex(service.number)}
            </span>
            <span
              className={cn(
                "min-w-0 flex-1 pt-0.5 text-[clamp(1.15rem,1.7vw,1.55rem)] leading-snug tracking-snug transition-colors duration-300",
                selected ? "font-medium text-foreground" : "font-normal text-foreground/45",
              )}
            >
              {service.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ServicePanel({
  service,
  reduceMotion,
  voxel,
}: {
  service: Service;
  reduceMotion: boolean;
  voxel: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {/* Image slot - voxels sit free, no border / card chrome */}
      <div className="relative aspect-[16/9] w-full">{voxel}</div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={service.id}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: TRANSITION_MS, ease: EASE_OUT_EXPO }}
          className="mt-5"
        >
          <ServiceDetails service={service} />
        </m.div>
      </AnimatePresence>
    </div>
  );
}

function MobileServiceAccordion({
  services,
  activeId,
  onSelect,
  voxel,
}: {
  services: Service[];
  activeId: string;
  onSelect: (id: string) => void;
  voxel: ReactNode;
}) {
  return (
    <ul className="border-t border-black/[0.08]">
      {services.map((service) => {
        const open = service.id === activeId;
        const panelId = `mobile-service-panel-${service.id}`;
        const buttonId = `mobile-service-trigger-${service.id}`;

        return (
          <li key={service.id} className="border-b border-black/[0.08]">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => onSelect(service.id)}
                className="flex min-h-14 w-full items-center gap-3 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="shrink-0 font-mono text-[11px] tracking-[0.08em] text-foreground/40">
                  {formatIndex(service.number)}
                </span>
                <span
                  className={cn(
                    "flex-1 text-[1.15rem] leading-snug tracking-snug sm:text-xl",
                    open ? "font-medium text-foreground" : "text-foreground/70",
                  )}
                >
                  {service.title}
                </span>
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/[0.08] bg-[#f5f3f1] text-foreground transition-transform duration-300",
                    open && "rotate-180",
                  )}
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </h3>

            {/*
              No AnimatePresence around the WebGL tree: exit animations keep the
              previous panel mounted while the next opens, which spawned two
              Canvases on mobile and often blanked the scene.
            */}
            {open ? (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-6 pt-1">
                <ServiceDetails
                  service={service}
                  showTitle={false}
                  media={
                    <div className="relative aspect-[16/9] w-full min-h-[220px]">
                      {voxel}
                    </div>
                  }
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function hoverNudgeFor(activeId: string, hoveredId: string | null) {
  if (!hoveredId || hoveredId === activeId) return 0;
  const activeIndex = SERVICES.findIndex((service) => service.id === activeId);
  const hoverIndex = SERVICES.findIndex((service) => service.id === hoveredId);
  if (activeIndex < 0 || hoverIndex < 0) return 0;
  const direction = hoverIndex > activeIndex ? 1 : -1;
  return direction * 0.075;
}

export function Services() {
  const [activeId, setActiveId] = useState(SERVICES[0]?.id ?? "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const canHover = useMediaQuery(FINE_POINTER_QUERY);
  const titleId = useId();
  const activeService = SERVICES.find((service) => service.id === activeId) ?? SERVICES[0];

  if (!activeService || !isSculptureId(activeService.id)) return null;

  const sculptureId = activeService.id;
  const nudge = canHover && isDesktop ? hoverNudgeFor(activeId, hoveredId) : 0;

  const voxel = (
    <ServicesVoxel
      serviceId={sculptureId}
      fallbackSrc={activeService.media.src}
      fallbackAlt={activeService.media.alt}
      hoverNudge={nudge}
      className="h-full w-full"
    />
  );

  return (
    <Section id="services" className="pb-8 sm:pb-10 lg:pb-12">
      <Container>
        <div id={titleId}>
          <SectionHeader eyebrow={SERVICES_INTRO.eyebrow} title={SERVICES_INTRO.title} body={SERVICES_INTRO.body} />
        </div>

        {isDesktop ? (
          <div className="mt-12 grid grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-start gap-8 lg:mt-16 xl:gap-10">
            <ServiceSelector
              services={SERVICES}
              activeId={activeId}
              onSelect={(id) => {
                setActiveId(id);
                setHoveredId(null);
              }}
              onHoverChange={setHoveredId}
              enableHoverPreview={canHover}
              labelledBy={titleId}
            />
            <div
              role="tabpanel"
              id={`service-panel-${activeService.id}`}
              aria-labelledby={`service-tab-${activeService.id}`}
              className="max-w-xl justify-self-end xl:max-w-[34rem]"
            >
              <ServicePanel service={activeService} reduceMotion={reduceMotion} voxel={voxel} />
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <MobileServiceAccordion
              services={SERVICES}
              activeId={activeId}
              onSelect={setActiveId}
              voxel={voxel}
            />
          </div>
        )}
      </Container>
    </Section>
  );
}
