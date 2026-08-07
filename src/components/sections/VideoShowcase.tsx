"use client";

import { VIDEO_SECTION } from "@/lib/content";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

function getYouTubeEmbedUrl(url: string) {
  if (!url.trim()) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/embed/")[1] ?? "";
      } else {
        videoId = parsed.searchParams.get("v") ?? "";
      }
    }

    if (!videoId) {
      return null;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
  } catch {
    return null;
  }
}

export function VideoShowcase() {
  const embedUrl = getYouTubeEmbedUrl(VIDEO_SECTION.youtubeUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <Container className="py-10 lg:py-12">
      <SectionHeader eyebrow={VIDEO_SECTION.eyebrow} title={VIDEO_SECTION.title} body={VIDEO_SECTION.body} />
      <Reveal className="mt-8 lg:mt-10">
        <div className="mx-auto max-w-5xl rounded-[24px] border border-black/[0.08] bg-[#f5f3f1] p-2 shadow-card sm:p-3">
          <div className="relative aspect-video overflow-hidden rounded-[18px] bg-ink">
            <iframe
              src={embedUrl}
              title={VIDEO_SECTION.titleLabel}
              className="absolute inset-0 size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
