import { Container } from "@/components/ui/Container";

/** Blueprint-style hairline divider with small dot terminals, as in the design. */
export function Divider() {
  return (
    <Container>
      <div className="relative h-px bg-border">
        <span className="absolute -left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-border" />
        <span className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-border" />
      </div>
    </Container>
  );
}
