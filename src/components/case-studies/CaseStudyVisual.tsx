"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CaseStudyImage } from "@/lib/case-studies";

interface CaseStudyVisualProps {
  image: CaseStudyImage;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export function CaseStudyVisual({ image, className, imgClassName, priority = false }: CaseStudyVisualProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden rounded-[24px] border border-black/[0.08] bg-[#f5f3f1]", className)}>
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <span className="display max-w-sm text-balance text-3xl leading-tight text-black/30">{image.alt}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 size-full object-cover", imgClassName)}
        />
      )}
    </div>
  );
}
