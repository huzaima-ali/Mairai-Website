"use client";

import { type FC, type ReactNode } from "react";
import { m } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeConfig = {
  shell: string;
  button: string;
  buttonDisabled: string;
  dot: string;
  progress: string;
  fill: string;
};

interface CarouselNavigatorProps {
  totalSlides?: number;
  autoDelay?: number;
  themes?: ThemeConfig[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  isPlaying?: boolean;
  loop?: boolean;
  className?: string;
  previousLabel?: string;
  nextLabel?: string;
}

const DEFAULT_TOTAL_SLIDES = 4;
const DEFAULT_AUTO_DELAY = 2000;

const MIRAI_THEME: ThemeConfig = {
  shell: "border border-black/[0.08] bg-[#f5f3f1]",
  button: "bg-ink text-white hover:brightness-95",
  buttonDisabled: "cursor-not-allowed bg-black/10 text-black/35 opacity-60",
  dot: "bg-black/20",
  progress: "bg-black/20",
  fill: "bg-ink",
};

export const CarouselNavigator: FC<CarouselNavigatorProps> = ({
  totalSlides = DEFAULT_TOTAL_SLIDES,
  autoDelay = DEFAULT_AUTO_DELAY,
  themes,
  currentIndex,
  onIndexChange,
  isPlaying = true,
  loop = true,
  className,
  previousLabel = "Previous slide",
  nextLabel = "Next slide",
}) => {
  const themeList = themes?.length ? themes : Array.from({ length: totalSlides }, () => MIRAI_THEME);
  const theme = themeList[currentIndex % themeList.length] ?? MIRAI_THEME;
  const atStart = currentIndex === 0;
  const atEnd = currentIndex === totalSlides - 1;
  const prevDisabled = !loop && atStart;
  const nextDisabled = !loop && atEnd;

  const goPrev = () => {
    if (prevDisabled) return;
    onIndexChange((currentIndex - 1 + totalSlides) % totalSlides);
  };

  const goNext = () => {
    if (nextDisabled) return;
    onIndexChange((currentIndex + 1) % totalSlides);
  };

  return (
    <m.div
      className={cn(
        "mx-auto flex w-fit items-center justify-center gap-1 rounded-full px-3 py-2.5 transition-colors duration-300 sm:px-4 sm:py-3",
        theme.shell,
        className,
      )}
      role="group"
      aria-label="Carousel navigation"
    >
      <ArrowButton
        onClick={goPrev}
        themeColor={theme.button}
        disabled={prevDisabled}
        ariaLabel={previousLabel}
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
      </ArrowButton>

      <div className="flex items-center gap-2 px-2" aria-label="Choose slide">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <Indicator
            key={i}
            isActive={i === currentIndex}
            theme={theme}
            autoDelay={autoDelay}
            isPlaying={isPlaying && i === currentIndex}
            onClick={() => onIndexChange(i)}
            label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <ArrowButton
        onClick={goNext}
        themeColor={theme.button}
        disabled={nextDisabled}
        ariaLabel={nextLabel}
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
      </ArrowButton>
    </m.div>
  );
};

function ArrowButton({
  children,
  onClick,
  themeColor,
  disabled,
  ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  themeColor: string;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors duration-300 sm:h-12 sm:w-12",
        disabled ? "cursor-not-allowed bg-black/10 text-black/35 opacity-60" : cn("cursor-pointer", themeColor),
      )}
    >
      {children}
    </m.button>
  );
}

function Indicator({
  isActive,
  theme,
  autoDelay,
  isPlaying,
  onClick,
  label,
}: {
  isActive: boolean;
  theme: ThemeConfig;
  autoDelay: number;
  isPlaying: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "relative h-3 overflow-hidden rounded-full transition-[width,background-color] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive ? cn("w-10 sm:w-12", theme.progress) : cn("w-3", theme.dot),
      )}
    >
      {isActive && isPlaying ? (
        <m.div
          key={`progress-${autoDelay}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: autoDelay / 1000, ease: "linear" }}
          className={cn("absolute inset-y-0 left-0 rounded-full", theme.fill)}
        />
      ) : null}
    </button>
  );
}
