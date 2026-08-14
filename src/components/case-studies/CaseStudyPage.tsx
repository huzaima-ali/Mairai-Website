import { ArrowLeft, ArrowUpRight, Quote } from "lucide-react";
import { CASE_STUDIES, type CaseStudy } from "@/lib/case-studies";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { LogoImg } from "@/components/ui/LogoImg";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { CaseStudyPreviewVisual } from "@/components/case-studies/CaseStudyPreviewVisual";
import type { CaseStudyImage } from "@/lib/case-studies";

function getYouTubeEmbedUrl(url?: string) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      videoId = parsed.pathname.startsWith("/embed/")
        ? parsed.pathname.split("/embed/")[1] ?? ""
        : parsed.searchParams.get("v") ?? "";
    }

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1` : null;
  } catch {
    return null;
  }
}

interface CaseStudyPageProps {
  study: CaseStudy;
}

export function CaseStudyPage({ study }: CaseStudyPageProps) {
  const related = CASE_STUDIES.filter((item) => item.slug !== study.slug).slice(0, 2);
  const previewImages = [study.heroImage, ...study.gallery].filter((image): image is CaseStudyImage => Boolean(image));
  const galleryOffset = study.heroImage ? 1 : 0;
  const videoEmbedUrl = getYouTubeEmbedUrl(study.videoUrl);

  return (
    <>
      <Section className="pb-8 pt-12 sm:pt-16 lg:pt-20">
        <Container>
          <div className="mb-8 flex flex-wrap gap-3">
            <a href="/" className="pill border border-border bg-background text-foreground hover:border-foreground/40">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </a>
            <a href="/#work" className="pill border border-border bg-background text-foreground hover:border-foreground/40">
              Back to work
            </a>
          </div>

          <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-10">
            <div>
              <p className="eyebrow mb-4">{study.eyebrow}</p>
              <h1 className="display max-w-4xl text-balance text-[clamp(2.25rem,4.5vw,4.75rem)] leading-[1.02]">
                {study.title}
              </h1>
            </div>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {study.summary}
            </p>
          </div>

          {study.embedDemo && study.demoUrl ? (
            <div className="mt-9 overflow-hidden rounded-[24px] border border-black/[0.08] bg-[#0a0a0a] shadow-card sm:mt-12">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
                <div>
                  <p className="text-sm font-medium text-white">Interactive demo</p>
                  <p className="text-xs text-white/55">{study.demoUrl.replace(/^https?:\/\//, "")}</p>
                </div>
                <a
                  href={study.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-medium text-ink transition-opacity hover:opacity-90 sm:text-sm"
                >
                  {study.demoLabel ?? "Open demo"}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="relative aspect-[16/9] min-h-[280px] bg-[#0a0a0a] sm:min-h-[420px]">
                <iframe
                  src={study.demoUrl}
                  title={`${study.title} live demo`}
                  className="absolute inset-0 size-full"
                  loading="lazy"
                  allow="fullscreen"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          ) : study.heroImage ? (
            <CaseStudyPreviewVisual
              image={study.heroImage}
              images={previewImages}
              index={0}
              priority
              className="mt-9 aspect-[16/8] min-h-[240px] sm:min-h-[320px] lg:mt-12"
              imgClassName="transition-transform duration-700 ease-out-expo"
            />
          ) : null}
        </Container>
      </Section>

      <Section className="py-8 lg:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:gap-12">
            <aside className="h-fit rounded-[24px] border border-black/[0.08] bg-[#f5f3f1] p-5 sm:p-7 lg:sticky lg:top-24">
              <h2 className="text-lg font-medium text-foreground">Project information</h2>
              <dl className="mt-5 flex flex-col gap-4">
                {study.projectInfo.map((item) => (
                  <div key={item.label} className="border-t border-black/[0.08] pt-4">
                    <dt className="text-sm text-muted-foreground">{item.label}</dt>
                    <dd className="mt-1 text-base leading-relaxed text-foreground">{item.value}</dd>
                  </div>
                ))}
              </dl>
              {study.websiteUrl ? (
                <a
                  href={study.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pill mt-6 w-fit bg-ink text-white transition-all duration-300 hover:shadow-pill"
                >
                  Visit website
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
              {study.demoUrl && study.demoUrl !== study.websiteUrl ? (
                <a
                  href={study.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pill mt-3 w-fit border border-border bg-background text-foreground transition-all duration-300 hover:border-foreground/40"
                >
                  {study.demoLabel ?? "Try demo"}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
            </aside>

            <div className="flex flex-col gap-9">
              {study.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="display text-[clamp(1.75rem,2.5vw,2.75rem)] leading-tight">{section.heading}</h2>
                  <div className="mt-4 flex flex-col gap-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}

              {videoEmbedUrl ? (
                <section>
                  <h2 className="display text-[clamp(1.75rem,2.5vw,2.75rem)] leading-tight">Product walkthrough</h2>
                  <div className="mt-4 rounded-[24px] border border-black/[0.08] bg-[#f5f3f1] p-2 shadow-card sm:p-3">
                    <div className="relative aspect-video overflow-hidden rounded-[18px] bg-ink">
                      <iframe
                        src={videoEmbedUrl}
                        title={`${study.title} video`}
                        className="absolute inset-0 size-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </div>
                </section>
              ) : null}

              {study.gallery.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {study.gallery.map((image, index) => (
                    <figure key={image.src} className="flex flex-col gap-3">
                      <CaseStudyPreviewVisual
                        image={image}
                        images={previewImages}
                        index={index + galleryOffset}
                        className="aspect-[4/3]"
                      />
                      {image.caption ? <figcaption className="text-sm text-muted-foreground">{image.caption}</figcaption> : null}
                    </figure>
                  ))}
                </div>
              ) : null}

              {study.testimonial ? (
                <figure className="rounded-[24px] border border-black/[0.08] bg-[#f5f3f1] p-6 sm:p-8">
                  <Quote className="h-7 w-7 text-accent" aria-hidden="true" />
                  <blockquote className="mt-5 text-pretty text-xl leading-snug tracking-snug text-foreground sm:text-2xl">
                    {study.testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{study.testimonial.attribution}</span>
                    {study.testimonial.logo ? (
                      <LogoImg
                        src={`/logos/${study.testimonial.logo.file}`}
                        name={study.testimonial.logo.name}
                        className="max-h-8 max-w-32 object-contain opacity-50 grayscale"
                        wordmarkClassName="text-black/35"
                      />
                    ) : null}
                  </figcaption>
                </figure>
              ) : null}

              <Button href="/#contact" size="lg" className="w-fit">
                {study.cta ?? "Start a project like this"}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section className="pt-12">
          <Container>
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow mb-3">More work</p>
                <h2 className="display text-[clamp(1.75rem,3vw,3rem)] leading-tight">Explore related case studies</h2>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {related.map((item) => (
                <CaseStudyCard key={item.slug} study={item} className="aspect-[16/10] min-h-[240px]" />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
