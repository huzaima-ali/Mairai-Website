import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
}

/** Section wrapper with consistent vertical rhythm and a top hairline divider. */
export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-28 py-20 sm:py-24 lg:py-28", className)} {...props}>
      {children}
    </section>
  );
}
