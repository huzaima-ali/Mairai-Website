import { cn } from "@/lib/utils";

/**
 * Page container — matches the Figma content width (1280px max) with the
 * generous side gutters used throughout the design.
 */
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-content px-6 sm:px-8 lg:px-12", className)} {...props} />;
}
