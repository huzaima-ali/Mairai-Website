import { ArrowLeft } from "lucide-react";

/** Consistent home / parent back control for marketing and content pages. */
export function PageBackLink({
  href = "/",
  label = "Back to Mirai Studios",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      className="pill mb-8 inline-flex border border-border bg-background text-foreground hover:border-foreground/40"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      {label}
    </a>
  );
}
