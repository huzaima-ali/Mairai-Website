export type InsightArticle = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  body: string[];
  featured?: boolean;
};

/** Placeholder insights for homepage + /insights until real articles ship. */
export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    slug: "ai-product-development-process",
    title: "How Mirai approaches AI product development",
    excerpt:
      "A practical look at moving from idea to production: scoping the workflow, designing for trust, and engineering systems that hold up after the demo.",
    date: "August 18, 2026",
    readTime: "6 min read",
    category: "AI Products",
    featured: true,
    body: [
      "Most AI initiatives stall between a promising prototype and a product people actually use. The gap is rarely the model alone. It is unclear workflows, weak interface design around uncertainty, and engineering that was never meant to survive real traffic or review loops.",
      "At Mirai Studios, we treat AI product development as product work first. We start with the decision or task the product must support, then design the experience and system around that outcome. Model choice matters, but only after the job to be done is clear.",
      "A useful process usually includes discovery with real operators, a narrow first release, evaluation criteria the team can defend, and a path for human oversight where the stakes are high. That keeps shipping honest and reduces the chance of building a demo that cannot become a business.",
      "This article is a placeholder for future Mirai insights. The structure is live so the homepage, insights index and article routes can be validated before long-form publishing begins.",
    ],
  },
  {
    slug: "when-to-use-a-digital-twin",
    title: "When a digital twin is the right product choice",
    excerpt:
      "Digital twins help when space, assets or operations need a shared visual model. Here is how we decide between interactive 3D and simpler product surfaces.",
    date: "August 12, 2026",
    readTime: "5 min read",
    category: "Digital Twins",
    body: [
      "A digital twin is valuable when stakeholders need to understand a place, facility or system in spatial context. Sales walkthroughs, hospital operations views and manufacturing visualization are common examples.",
      "It is the wrong tool when the problem is purely transactional and has no meaningful spatial layer. In those cases, a well-designed software workflow will outperform an expensive 3D experience.",
      "Mirai usually recommends browser-based delivery when access and shareability matter. Higher-fidelity engines can still be right for specialized visualization needs. The decision should follow audience and channel, not novelty.",
      "This is placeholder insight content used to prove out the Insights experience on the Mirai Studios website.",
    ],
  },
  {
    slug: "ai-agents-with-human-oversight",
    title: "Building AI agents with human oversight",
    excerpt:
      "Agents become useful when they can act on tools and systems, but they stay safe when review points and boundaries are designed in from the start.",
    date: "August 5, 2026",
    readTime: "7 min read",
    category: "AI Agents",
    body: [
      "Open-ended chatbots rarely match operational reality. Production agents need a defined job, permitted tools, logging and clear moments where a person must approve or intervene.",
      "Mirai designs agents around workflows: intake, drafting, routing, enrichment and follow-up. The interface should make the agent's next action understandable, reversible and auditable.",
      "Human-in-the-loop is not a failure of automation. It is often the difference between a clever demo and a system a business can trust.",
      "This placeholder article exists so Insights navigation and article pages can be tested before editorial publishing begins.",
    ],
  },
];

export function getInsightArticle(slug: string) {
  return INSIGHT_ARTICLES.find((article) => article.slug === slug);
}

export function getFeaturedInsight() {
  return INSIGHT_ARTICLES.find((article) => article.featured) ?? INSIGHT_ARTICLES[0];
}

export function getInsightUrl(slug: string) {
  return `/insights/${slug}`;
}
