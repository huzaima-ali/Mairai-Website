interface BlueprintFrameProps {
  children: React.ReactNode;
}

/**
 * Continuous blueprint-style rails for the content-heavy portion of the page.
 * Containers inside the frame receive an additional responsive inset, while
 * dividers continue to span the full distance between the rails.
 */
export function BlueprintFrame({ children }: BlueprintFrameProps) {
  return (
    <div className="blueprint-frame relative">
      <div
        aria-hidden="true"
        className="blueprint-rails page-container pointer-events-none absolute inset-y-0 left-0 right-0"
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
