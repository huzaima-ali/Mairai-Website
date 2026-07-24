import { Container } from "@/components/ui/Container";

/** Blueprint-style hairline divider with small dot terminals, as in the design. */
export function Divider() {
  return (
    <div className="blueprint-divider-container relative h-px bg-border">
      <Container className="blueprint-divider-rail relative h-px">
        <span
          aria-hidden="true"
          className="absolute -left-[3px] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-foreground/45"
        />
        <span
          aria-hidden="true"
          className="absolute -right-[3px] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-foreground/45"
        />
      </Container>
    </div>
  );
}
