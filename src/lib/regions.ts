import type { MarketingPage } from "@/lib/services";

export const REGION_PAGES: MarketingPage[] = [
  {
    slug: "united-states",
    path: "/regions/united-states",
    title: "United States",
    metaTitle: "AI Development & Technology Partner in the USA | Mirai Studios",
    metaDescription:
      "Mirai Studios partners with US companies to design and build AI products, software platforms, automation and digital twins with product-led engineering delivery.",
    eyebrow: "Regions",
    h1: "AI development and technology partner for US companies",
    intro:
      "Mirai Studios works with startups, product teams and enterprises in the United States that need a partner to design, build and scale AI products, software platforms and immersive technology.",
    sections: [
      {
        heading: "Services available",
        body: [
          "US clients engage Mirai for AI product development, AI agents, intelligent automation, custom software, digital twins, product design and enterprise engineering.",
        ],
      },
      {
        heading: "Engagement model",
        body: [
          "Engagements typically start with discovery and scoping, then move into design and engineering with clear milestones. Work is defined in proposals or statements of work so scope, ownership and outcomes stay explicit.",
        ],
      },
      {
        heading: "Remote delivery and collaboration",
        body: [
          "Mirai delivers remotely with structured communication, shared tooling and regular working sessions. US teams can collaborate across Eastern, Central, Mountain and Pacific time zones with planned overlap for workshops, reviews and decision-making.",
        ],
      },
      {
        heading: "Industries we support",
        body: [
          "Healthcare technology, legal technology, real estate technology, manufacturing visualization and AI-native SaaS products are areas where we already have relevant case work.",
        ],
      },
      {
        heading: "Why US teams work with Mirai",
        body: [
          "US product and operations leaders often need more than a staffing vendor. They need a partner that can shape the product, design the experience and engineer a system that is ready for real users. Mirai combines those disciplines in one delivery team.",
        ],
      },
    ],
    relatedCaseStudies: ["cero", "lillyai", "mira-pulse", "thyssenkrupp", "mindful-legal-solutions"],
    relatedServices: [
      { label: "AI Product Development", href: "/services/ai-product-development" },
      { label: "Digital Twin Development", href: "/services/digital-twin-development" },
      { label: "Enterprise Engineering", href: "/services/enterprise-engineering" },
    ],
  },
  {
    slug: "united-kingdom",
    path: "/regions/united-kingdom",
    title: "United Kingdom",
    metaTitle: "AI Development & Product Engineering Partner in the UK | Mirai Studios",
    metaDescription:
      "Mirai Studios helps UK companies design and build AI products, enterprise software, automation and digital twins with clear product engineering delivery.",
    eyebrow: "Regions",
    h1: "AI and product engineering partner for UK businesses",
    intro:
      "Mirai Studios supports UK companies that want to build AI products, software platforms and immersive systems with a partner that can move from strategy to shipped software.",
    sections: [
      {
        heading: "Services available",
        body: [
          "UK clients can engage Mirai for AI product development, agents and automation, custom software, digital twins, immersive experiences, product design and enterprise engineering.",
        ],
      },
      {
        heading: "Engagement model",
        body: [
          "We work through defined discovery, design and delivery phases. Communication stays practical: working sessions, written decisions and incremental releases that UK stakeholders can review.",
        ],
      },
      {
        heading: "Timezone collaboration",
        body: [
          "UK business hours align well with Mirai’s delivery rhythm. We plan overlap for workshops and reviews, then continue execution asynchronously so progress does not depend on constant meetings.",
        ],
      },
      {
        heading: "Why UK teams choose Mirai",
        body: [
          "UK product and technology leaders often need a partner who can own complex delivery without losing product clarity. Mirai brings design, AI and engineering together so the work stays coherent from first prototype to production release.",
        ],
      },
    ],
    relatedCaseStudies: ["cero", "enorta", "lillyai", "esteria"],
    relatedServices: [
      { label: "AI Product Development", href: "/services/ai-product-development" },
      { label: "Custom Software Development", href: "/services/custom-software-development" },
      { label: "Product Design", href: "/services/product-design" },
    ],
  },
  {
    slug: "middle-east",
    path: "/regions/middle-east",
    title: "Middle East",
    metaTitle: "AI Development Company for the Middle East | Mirai Studios",
    metaDescription:
      "Mirai Studios supports companies across the Middle East, including Saudi Arabia and the UAE, with AI products, software platforms, digital twins and immersive technology delivery.",
    eyebrow: "Regions",
    h1: "AI and technology delivery for Middle East organizations",
    intro:
      "Mirai Studios partners with companies across the Middle East that need AI products, enterprise platforms, digital twins and immersive experiences delivered with product discipline.",
    sections: [
      {
        heading: "Where we support buyers",
        body: [
          "We work with organizations across the GCC, including teams based in Saudi Arabia and the United Arab Emirates. Conversations often involve buyers in Riyadh, Dubai and Abu Dhabi who need a technology partner for ambitious digital programmes.",
        ],
      },
      {
        heading: "Services available",
        body: [
          "AI product development, agents and automation, custom software, digital twin development, immersive experiences, product design and enterprise engineering.",
        ],
      },
      {
        heading: "Engagement and remote delivery",
        body: [
          "Projects are scoped clearly and delivered remotely with scheduled collaboration windows. That model suits leadership reviews, technical workshops and iterative product delivery without requiring a large on-site footprint for every phase.",
        ],
      },
      {
        heading: "Timezone collaboration",
        body: [
          "Gulf Standard Time overlaps well with Mirai’s working day. We schedule decision sessions for buyer convenience and keep day-to-day execution moving through shared roadmaps and async updates.",
        ],
      },
      {
        heading: "Relevant experience",
        body: [
          "Interactive real estate visualization, hospital operations concepts, manufacturing digital twins and AI product work give Middle East buyers concrete references for both commercial and operational use cases.",
        ],
      },
    ],
    relatedCaseStudies: ["esteria", "mira-pulse", "thyssenkrupp", "cero"],
    relatedServices: [
      { label: "Digital Twin Development", href: "/services/digital-twin-development" },
      { label: "Immersive Experiences", href: "/services/immersive-experiences" },
      { label: "AI Product Development", href: "/services/ai-product-development" },
    ],
  },
];

export function getRegionPage(slug: string) {
  return REGION_PAGES.find((page) => page.slug === slug);
}

export function getAllRegionSlugs() {
  return REGION_PAGES.map((page) => page.slug);
}
