"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { SERVICES, SERVICES_INTRO } from "@/lib/content";
import { accordionContent } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

function Index({ value }: { value: string }) {
  return (
    <span className="font-medium tracking-snug text-foreground">
      <span className="text-accent">[</span>
      <span className="mx-1 text-base sm:text-lg">{value}</span>
      <span className="text-accent">]</span>
    </span>
  );
}

export function Services() {
  const [openId, setOpenId] = useState<string>(SERVICES[0]?.id ?? "");

  return (
    <Section id="services">
      <Container>
        <SectionHeader eyebrow={SERVICES_INTRO.eyebrow} title={SERVICES_INTRO.title} body={SERVICES_INTRO.body} />

        <ul className="mt-12 lg:mt-16">
          {SERVICES.map((service, i) => {
            const open = openId === service.id;
            const panelId = `service-${service.id}`;
            return (
              <li
                key={service.id}
                className={cn(
                  "transition-colors duration-300",
                  open ? "rounded-2xl bg-surface" : "border-t border-border",
                  !open && i === SERVICES.length - 1 && "border-b",
                )}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? "" : service.id)}
                    className="flex w-full items-center justify-between gap-6 px-5 py-6 text-left sm:px-8 sm:py-7"
                  >
                    <span className="flex items-baseline gap-4 sm:gap-6">
                      <Index value={service.index} />
                      <span className="display text-[clamp(1.5rem,3.4vw,3rem)] leading-tight">
                        {service.title}
                      </span>
                    </span>
                    {open ? (
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-[#E2E0DE] text-foreground">
                        <Minus aria-hidden="true" className="h-6 w-6" />
                      </span>
                    ) : (
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-transparent bg-[#E2E0DE] text-accent">
                        <Plus
                          aria-hidden="true"
                          className="h-6 w-6 transition-transform duration-300"
                        />
                      </span>
                    )}
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <m.div
                      id={panelId}
                      variants={accordionContent}
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 px-5 pb-8 sm:px-8 lg:grid-cols-2 lg:gap-16">
                        <p className="max-w-md text-pretty leading-relaxed text-muted-foreground sm:pl-[3.5rem]">
                          {service.description}
                        </p>
                        <div>
                          <p className="text-sm text-muted-foreground">{service.toolsLabel}</p>
                          <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
                            {service.tools.map((tool) => (
                              <li key={tool} className="flex items-center gap-3 text-[15px] text-foreground">
                                <span className="h-3.5 w-3.5 rounded-full bg-border" />
                                {tool}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
