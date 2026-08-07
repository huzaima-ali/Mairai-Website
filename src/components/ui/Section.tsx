import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
}

/** Section wrapper with consistent vertical rhythm and a top hairline divider. */
export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-16 sm:py-20 lg:py-24", className)} {...props}>
      {children}
    </section>
  );
}
