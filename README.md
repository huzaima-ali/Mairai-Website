# Mirai Studios

A premium technology-agency marketing site — built to feel like it was crafted by an elite product team. Minimal, elegant, fast, and fully responsive, with a centralized motion system and accessible, semantic markup.

## Tech stack

- **Next.js 14** (App Router, Server Components where appropriate)
- **React 18 + TypeScript** (strict)
- **Tailwind CSS** (custom design system + 8px spacing)
- **Framer Motion** (`LazyMotion` for a small bundle, centralized variants)
- **Lenis** (smooth scrolling, reduced-motion aware)
- **React Hook Form + Zod** (validated, accessible contact form)
- **Lucide** (icons)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# open http://localhost:3000

# Other scripts
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

> Requires Node.js 18.17+ (Node 20+ recommended).

## Project structure

```
src/
├── app/                    # App Router: layout, page, SEO (sitemap, robots, OG image)
│   ├── globals.css         # Design tokens + base styles
│   ├── layout.tsx          # Root layout, providers, metadata, JSON-LD
│   └── page.tsx            # Home page composition
├── components/
│   ├── animations/         # MotionProvider, LenisProvider, Reveal, CountUp
│   ├── layout/             # Navbar, MobileMenu, Footer
│   ├── sections/           # Hero, Statistics, Services, Products, etc.
│   └── ui/                 # Button, Container, Section, SectionHeading, Logo, GlowBackground
├── hooks/                  # use-count-up, use-scrolled, use-media-query
└── lib/                    # motion variants, content data, validations, utils
```

## Design system

- **Colors** — White / light-neutral surfaces, near-black text, deep-red → dark-crimson brand accent with a subtle ember glow. Tokens live as CSS variables in `globals.css` and are surfaced through `tailwind.config.ts`.
- **Radii** — 16 / 20 / 24px (`rounded-lg` / `xl` / `2xl`).
- **Spacing** — 8px system via Tailwind's default scale.
- **Motion** — Every variant (`fadeUp`, `staggerContainer`, `imageReveal`, `accordion`, …) is defined once in `src/lib/motion.ts` and consumed via the `<Reveal />` primitive. All motion respects `prefers-reduced-motion`.

## Customizing content

All copy and data (services, products, case studies, testimonials, pricing, nav, footer) live in **`src/lib/content.ts`**. Update there and the UI follows.

## Wiring the contact form

`src/components/sections/Contact.tsx` validates with Zod and currently simulates submission. Replace the `onSubmit` body with a call to your API route / email provider (e.g. Resend, a `/app/api/contact` route, or a form backend).

## Accessibility & performance

- Semantic landmarks, skip link, keyboard-accessible accordion & carousel, visible focus rings, ARIA labels.
- Animations are limited to `transform`, `opacity`, and `filter`; reveals trigger once via IntersectionObserver.
- Images use `next/image`; remote demo images are configured in `next.config.mjs` (swap for your own assets / local files for best Lighthouse scores).
- `prefers-reduced-motion` disables smooth scroll and animation globally.

## Notes

- Demo imagery is loaded from Unsplash and avatar placeholders from pravatar for convenience. For production, replace with owned assets in `/public` and update the components + `next.config.mjs`.
- Update `SITE` in `src/lib/content.ts` (domain, email, social) before deploying so metadata, JSON-LD, sitemap, and robots resolve correctly.
