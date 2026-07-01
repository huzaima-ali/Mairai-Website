import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";

export const runtime = "edge";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: "linear-gradient(135deg,#ef3742,#99131d)",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 600, color: "#0a0a0b" }}>{SITE.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#0a0a0b",
              maxWidth: 900,
            }}
          >
            {SITE.tagline}
          </div>
          <div style={{ fontSize: 30, color: "#6b6b73", maxWidth: 820 }}>{SITE.description}</div>
        </div>

        <div
          style={{
            height: 8,
            width: 240,
            borderRadius: 999,
            background: "linear-gradient(90deg,#ef3742,#ff6b35)",
          }}
        />
      </div>
    ),
    size,
  );
}
