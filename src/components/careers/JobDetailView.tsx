import { ArrowUpRight } from "lucide-react";
import type { JobRow } from "@/lib/cms/types";
import { SITE } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageBackLink } from "@/components/ui/PageBackLink";
import { Button } from "@/components/ui/Button";

export function JobDetailView({ job, preview = false }: { job: JobRow; preview?: boolean }) {
  const applyEmail = job.application_email || SITE.email;
  const closed = job.status === "closed";

  return (
    <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <Container>
        <div className="max-w-3xl">
          {!preview ? <PageBackLink href="/careers" label="Back to Careers" /> : null}
          <p className="eyebrow mb-4">Careers</p>
          <h1 className="display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">{job.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {[job.department, job.location, job.workplace_type, job.employment_type]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {closed ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              This role is closed and is no longer accepting applications.
            </div>
          ) : null}

          {job.summary ? (
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {job.summary}
            </p>
          ) : null}

          {job.description ? (
            <div
              className="mt-10 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          ) : null}

          {job.requirements ? (
            <section className="mt-10">
              <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)]">Requirements</h2>
              <div
                className="mt-4 text-base leading-relaxed text-muted-foreground [&_li]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: job.requirements }}
              />
            </section>
          ) : null}

          {job.nice_to_have ? (
            <section className="mt-10">
              <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)]">Nice to have</h2>
              <div
                className="mt-4 text-base leading-relaxed text-muted-foreground [&_li]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: job.nice_to_have }}
              />
            </section>
          ) : null}

          {!closed ? (
            <div className="mt-12 rounded-[24px] border border-border bg-surface p-6 sm:p-8">
              <h2 className="display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">Apply</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Tell us about your background and the work you care about.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {(job.application_type === "email" || job.application_type === "both") && applyEmail ? (
                  <Button href={`mailto:${applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`} size="lg">
                    Email application
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                ) : null}
                {(job.application_type === "url" || job.application_type === "both") && job.application_url ? (
                  <Button href={job.application_url} variant="outline" size="lg">
                    Apply online
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
