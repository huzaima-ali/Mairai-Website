"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStudyImage } from "@/lib/case-studies";
import { CaseStudyVisual } from "@/components/case-studies/CaseStudyVisual";

interface CaseStudyPreviewVisualProps {
  image: CaseStudyImage;
  images: CaseStudyImage[];
  index: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export function CaseStudyPreviewVisual({
  image,
  images,
  index,
  className,
  imgClassName,
  priority = false,
}: CaseStudyPreviewVisualProps) {
  const gallery = images.length > 0 ? images : [image];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(index);
  const activeImage = gallery[active] ?? image;

  const openPreview = () => {
    setActive(index);
    setOpen(true);
  };

  const goTo = useCallback((nextIndex: number) => {
    setActive((nextIndex + gallery.length) % gallery.length);
  }, [gallery.length]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }

      if (event.key === "ArrowLeft") {
        goTo(active - 1);
      }

      if (event.key === "ArrowRight") {
        goTo(active + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, gallery.length, goTo, open]);

  return (
    <>
      <button
        type="button"
        onClick={openPreview}
        className={cn(
          "group relative block w-full overflow-hidden rounded-[24px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
        aria-label={`Preview ${image.alt}`}
      >
        <CaseStudyVisual
          image={image}
          priority={priority}
          className="absolute inset-0 rounded-[inherit]"
          imgClassName={cn("transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]", imgClassName)}
        />
        <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 p-4 text-white backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Case study image gallery"
          onClick={() => setOpen(false)}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/60">
                {active + 1} / {gallery.length}
              </p>
              <p className="mt-1 text-base font-medium">{activeImage.alt}</p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setOpen(false);
              }}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Close gallery preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative mt-4 flex min-h-0 flex-1 items-center justify-center" onClick={(event) => event.stopPropagation()}>
            {gallery.length > 1 ? (
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                className="absolute left-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Show previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : null}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeImage.src} alt={activeImage.alt} className="max-h-full max-w-full rounded-[18px] object-contain shadow-card" />

            {gallery.length > 1 ? (
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                className="absolute right-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Show next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          {gallery.length > 1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1" onClick={(event) => event.stopPropagation()}>
              {gallery.map((item, itemIndex) => (
                <button
                  key={`${item.src}-${itemIndex}`}
                  type="button"
                  onClick={() => goTo(itemIndex)}
                  className={cn(
                    "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-colors",
                    active === itemIndex ? "border-white" : "border-white/20 opacity-65 hover:opacity-100",
                  )}
                  aria-label={`Preview image ${itemIndex + 1}`}
                  aria-current={active === itemIndex ? "true" : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt="" className="absolute inset-0 size-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
