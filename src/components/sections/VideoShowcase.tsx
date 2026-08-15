"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VIDEO_SECTION } from "@/lib/content";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

function getYouTubeVideoId(url: string) {
  if (!url.trim()) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1]?.split("/")[0] || null;
      }
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }

  return null;
}

function buildEmbedSrc(videoId: string, autoplay: boolean) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    // Browsers only allow autoplay when muted
    mute: "1",
  });

  if (autoplay) {
    params.set("autoplay", "1");
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function VideoShowcase() {
  const videoId = useMemo(() => getYouTubeVideoId(VIDEO_SECTION.youtubeUrl), []);
  const frameRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [allowAutoplay, setAllowAutoplay] = useState(true);

  useEffect(() => {
    setAllowAutoplay(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const node = frameRef.current;
    if (!node || !allowAutoplay) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(Boolean(entry?.isIntersecting && (entry.intersectionRatio ?? 0) >= 0.4));
      },
      { threshold: [0, 0.4, 0.65], rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [allowAutoplay]);

  if (!videoId) {
    return null;
  }

  const shouldAutoplay = allowAutoplay && inView;
  const embedSrc = buildEmbedSrc(videoId, shouldAutoplay);

  return (
    <Container className="py-8 lg:py-10">
      <SectionHeader eyebrow={VIDEO_SECTION.eyebrow} title={VIDEO_SECTION.title} body={VIDEO_SECTION.body} />
      <Reveal className="mt-6 lg:mt-8">
        <div className="mx-auto max-w-5xl rounded-[24px] border border-black/[0.08] bg-[#f5f3f1] p-2 shadow-card sm:p-3">
          <div ref={frameRef} className="relative aspect-video overflow-hidden rounded-[18px] bg-ink">
            <iframe
              key={embedSrc}
              src={embedSrc}
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
