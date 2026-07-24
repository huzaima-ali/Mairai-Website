import { cn } from "@/lib/utils";

/**
 * Shared content boundary: fluid page gutters up to the 1760px content width
 * measured from the 1920px desktop design.
 */
export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("page-container", className)} {...props} />;
}
