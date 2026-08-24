"use client";

import { useEffect } from "react";
import Lenis from "lenis";

const NAV_OFFSET = -88;

function getHomeHashTarget(href: string) {
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname !== "/" && url.pathname !== "") return null;
    if (!url.hash || url.hash === "#") return null;
    return document.querySelector(url.hash) as HTMLElement | null;
  } catch {
    return null;
  }
}

function isOnHomePage() {
  return window.location.pathname === "/" || window.location.pathname === "";
}

/**
 * Initializes Lenis smooth scrolling for the whole document.
 * - Respects prefers-reduced-motion (skips smoothing entirely).
 * - Handles in-page and cross-page home section anchors (`#x` and `/#x`).
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollNative = (el: HTMLElement) => {
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    };

    if (prefersReduced) {
      const onAnchorClick = (event: MouseEvent) => {
        const anchor = (event.target as HTMLElement)?.closest("a[href]");
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href) return;

        const el = getHomeHashTarget(href);
        if (!el || !isOnHomePage()) return;

        event.preventDefault();
        scrollNative(el);
        history.replaceState(null, "", `/${new URL(href, window.location.href).hash}`);
      };

      const scrollToHashOnLoad = () => {
        const hash = window.location.hash;
        if (!hash || hash === "#") return;
        const el = document.querySelector(hash) as HTMLElement | null;
        if (el) scrollNative(el);
      };

      document.addEventListener("click", onAnchorClick);
      requestAnimationFrame(scrollToHashOnLoad);

      return () => {
        document.removeEventListener("click", onAnchorClick);
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const scrollToEl = (el: HTMLElement) => {
      lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.2 });
    };

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      const el = getHomeHashTarget(href);
      if (!el) return;

      // Already on home: smooth-scroll without a full reload.
      if (isOnHomePage()) {
        event.preventDefault();
        scrollToEl(el);
        history.replaceState(null, "", `/${new URL(href, window.location.href).hash}`);
      }
      // From another page: allow navigation to `/#section`, then scroll on load.
    };

    const scrollToHashOnLoad = () => {
      const hash = window.location.hash;
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash) as HTMLElement | null;
      if (!el) return;
      // Wait a frame so section layout (and sticky nav offset) settle.
      requestAnimationFrame(() => scrollToEl(el));
    };

    document.addEventListener("click", onAnchorClick);
    requestAnimationFrame(scrollToHashOnLoad);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
