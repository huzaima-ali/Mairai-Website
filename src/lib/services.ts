export type RelatedLink = {
  label: string;
  href: string;
};

export type MarketingSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type MarketingPage = {
  slug: string;
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  sections: MarketingSection[];
  relatedCaseStudies: string[];
  relatedServices?: RelatedLink[];
  relatedRegions?: RelatedLink[];
  faqs?: Array<{ question: string; answer: string }>;
  ctaLabel?: string;
  ctaHref?: string;
};

const REGION_LINKS: RelatedLink[] = [
  { label: "United States", href: "/regions/united-states" },
  { label: "United Kingdom", href: "/regions/united-kingdom" },
  { label: "Middle East", href: "/regions/middle-east" },
];

export const SERVICE_PAGES: MarketingPage[] = [
  {
    slug: "ai-product-development",
    path: "/services/ai-product-development",
    title: "AI Product Development",
    metaTitle: "AI Product Development Company | Mirai Studios",
    metaDescription:
      "Mirai Studios designs and builds production-ready AI products from product strategy and UX through engineering, model integration, deployment and scale.",
    eyebrow: "Services",
    h1: "AI product development for teams that need to ship",
    intro:
      "Mirai Studios is an AI product and technology partner. We help companies turn AI ideas into usable products, with clear product thinking, strong UX and engineering that holds up in production.",
    sections: [
      {
        heading: "Problems we solve",
        body: [
          "Many teams have a promising AI concept but struggle to turn it into a product people trust and use. Prototypes stall, model behaviour is hard to explain, and the gap between a demo and a durable product stays wide.",
        ],
        bullets: [
          "Unclear product scope for AI features",
          "Demos that do not survive real workflows",
          "Weak user experience around model output",
          "Missing evaluation, oversight and iteration loops",
        ],
      },
      {
        heading: "Capabilities",
        body: [
          "We cover the full product path: discovery, experience design, architecture, model integration, frontend and backend engineering, and deployment support.",
        ],
        bullets: [
          "AI product strategy and scoping",
          "UX for AI-assisted workflows",
          "Model and tool integration",
          "Full-stack product engineering",
          "Evaluation, feedback and iteration systems",
        ],
      },
      {
        heading: "Typical use cases",
        body: [
          "Content and productivity products, domain-specific AI assistants, evidence and reporting systems, and AI features inside existing SaaS platforms.",
        ],
      },
      {
        heading: "How Mirai approaches delivery",
        body: [
          "We start with the workflow and the decision the product must support, then design the interface and system around that outcome. AI is treated as part of the product architecture, not an isolated experiment.",
          "Delivery is collaborative: product, design and engineering move together so scope stays honest and releases stay useful.",
        ],
      },
      {
        heading: "Super Intelligence as a planning theme, not a product we sell",
        body: [
          "Super Intelligence, sometimes shortened to SI, is used in industry discussion for systems that could one day exceed human performance across many tasks. That is not a service Mirai offers, and it is not the same as shipping applied AI products today.",
          "What we do build is AI-native software: products, agents and automation with evaluation, permissions and human-supervised workflows. Those foundations remain useful as models become more capable.",
        ],
      },
      {
        heading: "Technologies we commonly use",
        body: [
          "Modern web stacks, LLM APIs and orchestration patterns, retrieval systems where evidence matters, and cloud infrastructure suited to the product’s scale and security needs. We choose tools for the problem, not for novelty.",
        ],
      },
    ],
    relatedCaseStudies: ["cero", "lillyai", "enorta", "storypage-ai"],
    relatedServices: [
      { label: "AI Agent Development", href: "/services/ai-agent-development" },
      { label: "Product Design", href: "/services/product-design" },
      { label: "AI Automation", href: "/services/ai-automation" },
    ],
    relatedRegions: REGION_LINKS,
    faqs: [
      {
        question: "What is included in AI product development?",
        answer:
          "Discovery, product scoping, UX for AI-assisted work, model and tool integration, full-stack engineering, and evaluation loops so the product can be used in production rather than remaining a demo.",
      },
      {
        question: "Does Mirai train proprietary Super Intelligence models?",
        answer:
          "No. We integrate proven model APIs and orchestration patterns into products. Super Intelligence and ASI are industry research topics. Mirai builds applied AI products with defined jobs, oversight and measurable workflows.",
      },
      {
        question: "How do AI product engagements usually start?",
        answer:
          "We start with the workflow and the decision the product must support, then design the interface and architecture around that outcome. A narrow first release is preferred over an unbounded prototype.",
      },
    ],
  },
  {
    slug: "ai-agent-development",
    path: "/services/ai-agent-development",
    title: "AI Agent Development",
    metaTitle: "AI Agent Development Company | Mirai Studios",
    metaDescription:
      "Build production AI agents that automate workflows, connect with business systems and operate with human oversight, security and measurable outcomes.",
    eyebrow: "Services",
    h1: "AI agents built for real business workflows",
    intro:
      "We design and engineer AI agents that support specific jobs: gathering information, generating drafts, routing work, or coordinating steps across tools, with human oversight where it matters.",
    sections: [
      {
        heading: "Problems we solve",
        body: [
          "Generic chatbots rarely fit operational reality. Teams need agents that understand context, call the right systems, and stay within clear boundaries.",
        ],
        bullets: [
          "Agents that cannot act on business systems",
          "Unclear handoff between automation and people",
          "Missing audit trails and review steps",
          "Promising demos without production controls",
        ],
      },
      {
        heading: "Capabilities",
        body: [
          "We build agents around tasks, tools and governance, not open-ended conversation alone.",
        ],
        bullets: [
          "Workflow-oriented agent design",
          "Tool use and system integrations",
          "Human-in-the-loop review patterns",
          "Guardrails, logging and evaluation",
          "Companion experiences for operators",
        ],
      },
      {
        heading: "Typical use cases",
        body: [
          "Legal and document assistance, clinical evidence workflows, internal operations copilots, and customer or partner support agents with controlled actions.",
        ],
      },
      {
        heading: "How Mirai approaches delivery",
        body: [
          "We define the job to be done, the tools the agent may use, and the points where a person must approve or intervene. That keeps the agent useful without pretending it can safely do everything unsupervised.",
        ],
      },
      {
        heading: "Agentic AI, AGI and Super Intelligence",
        body: [
          "Agentic AI here means software that can take bounded actions across tools and workflows. That is different from artificial general intelligence (AGI) or artificial superintelligence (ASI), which remain research goals rather than product categories.",
          "Enterprise agents still need permissions, logging, evaluation and human-supervised autonomous workflows. Those controls matter more as models become more capable.",
        ],
      },
    ],
    relatedCaseStudies: ["lillyai", "mindful-legal-solutions", "cero"],
    relatedServices: [
      { label: "AI Product Development", href: "/services/ai-product-development" },
      { label: "AI Automation", href: "/services/ai-automation" },
      { label: "Enterprise Engineering", href: "/services/enterprise-engineering" },
    ],
    relatedRegions: REGION_LINKS,
    faqs: [
      {
        question: "How is an AI agent different from a chatbot?",
        answer:
          "A chatbot mainly answers in conversation. An agent is designed around a job: it can call tools, update systems and route work, with review steps where a person must approve or intervene.",
      },
      {
        question: "Can agents run without human oversight?",
        answer:
          "Some low-risk steps can run automatically. High-stakes actions should stay behind review, logging and clear permissions. Mirai designs those boundaries into the workflow rather than treating oversight as an afterthought.",
      },
      {
        question: "Which systems can agents connect to?",
        answer:
          "Agents can integrate with APIs, document stores, CRMs, internal tools and custom platforms when those connections are in scope. The allowed tools are defined during design so the agent cannot act outside its job.",
      },
    ],
  },
  {
    slug: "ai-automation",
    path: "/services/ai-automation",
    title: "AI Automation",
    metaTitle: "AI Workflow Automation Company | Mirai Studios",
    metaDescription:
      "Mirai Studios designs intelligent automation that connects AI, software and business systems to remove repetitive work and accelerate delivery.",
    eyebrow: "Services",
    h1: "Intelligent automation for complex workflows",
    intro:
      "We help companies automate the work that drains teams: intake, classification, drafting, routing, enrichment and follow-up, while keeping people in control of decisions that need judgment.",
    sections: [
      {
        heading: "Problems we solve",
        body: [
          "Manual processes and brittle scripts create delays and errors. Automation without product thinking often breaks when edge cases appear.",
        ],
        bullets: [
          "Repetitive handoffs between tools and teams",
          "Document-heavy processes with slow turnaround",
          "Disconnected systems that need human glue",
          "Automation that fails silently or lacks oversight",
        ],
      },
      {
        heading: "Capabilities",
        body: [
          "We combine workflow design, AI assistance and system integration so automation fits the way the business actually operates.",
        ],
        bullets: [
          "Process mapping and opportunity sizing",
          "AI-assisted drafting and classification",
          "Integrations across business systems",
          "Exception handling and review queues",
          "Monitoring and iteration after launch",
        ],
      },
      {
        heading: "How Mirai approaches delivery",
        body: [
          "We automate the highest-friction steps first, measure whether the workflow improved, and expand only where the value is clear. The goal is reliable throughput, not automation for its own sake.",
        ],
      },
    ],
    relatedCaseStudies: ["cero", "lillyai", "mindful-legal-solutions"],
    relatedServices: [
      { label: "AI Agent Development", href: "/services/ai-agent-development" },
      { label: "Custom Software Development", href: "/services/custom-software-development" },
      { label: "Enterprise Engineering", href: "/services/enterprise-engineering" },
    ],
    relatedRegions: REGION_LINKS,
    faqs: [
      {
        question: "When is AI automation a better fit than a full AI product?",
        answer:
          "When the bottleneck is repetitive intake, classification, drafting or routing inside an existing process. A dedicated product is a better fit when users need a new interface and ongoing product surface, not only a faster back-office flow.",
      },
      {
        question: "How do you keep automation from failing silently?",
        answer:
          "Exception queues, logging and human review on uncertain or high-impact cases. Automation should make failures visible and recoverable rather than hiding them inside a script.",
      },
    ],
  },
  {
    slug: "custom-software-development",
    path: "/services/custom-software-development",
    title: "Custom Software Development",
    metaTitle: "Custom Software Development Company | Mirai Studios",
    metaDescription:
      "Mirai Studios builds custom web, mobile and enterprise software products with product design, engineering and long-term scalability in mind.",
    eyebrow: "Services",
    h1: "Custom software built around your product goals",
    intro:
      "We design and engineer software products and platforms when off-the-shelf tools cannot support the workflow, experience or differentiation your business needs.",
    sections: [
      {
        heading: "Problems we solve",
        body: [
          "Growing companies outgrow generic tools. They need software that matches their process, integrates cleanly and can evolve without becoming fragile.",
        ],
        bullets: [
          "Product ideas without a clear build path",
          "Platforms that are hard to extend",
          "Poor handoff between design and engineering",
          "Technical debt that blocks new features",
        ],
      },
      {
        heading: "Capabilities",
        body: [
          "End-to-end product engineering across web and platform experiences, with architecture choices that support growth.",
        ],
        bullets: [
          "Product discovery and technical scoping",
          "Web and SaaS application development",
          "API and data layer design",
          "Admin and operator tooling",
          "Quality, security and release practices",
        ],
      },
      {
        heading: "Typical use cases",
        body: [
          "SaaS products, internal platforms, client portals, content systems and domain-specific tools that need a tailored experience.",
        ],
      },
      {
        heading: "How Mirai approaches delivery",
        body: [
          "We treat software as a product: clarify users and outcomes, design the experience, then build in increments that can be validated. Architecture stays practical so future work is not blocked by early shortcuts.",
        ],
      },
    ],
    relatedCaseStudies: ["enorta", "storypage-ai", "cero", "mindful-legal-solutions"],
    relatedServices: [
      { label: "AI Product Development", href: "/services/ai-product-development" },
      { label: "Product Design", href: "/services/product-design" },
      { label: "Enterprise Engineering", href: "/services/enterprise-engineering" },
    ],
    relatedRegions: REGION_LINKS,
    faqs: [
      {
        question: "What kinds of custom software does Mirai build?",
        answer:
          "Web and SaaS applications, internal platforms, client portals, APIs and operator tooling. Work is scoped around a specific product goal rather than a generic staff-augmentation contract.",
      },
      {
        question: "Can custom software include AI features later?",
        answer:
          "Yes. We often design the data, workflow and interface so AI-assisted features can be added without rewriting the core product. AI is included when it has a defined job, not as a default layer.",
      },
    ],
  },
  {
    slug: "digital-twin-development",
    path: "/services/digital-twin-development",
    title: "Digital Twin Development",
    metaTitle: "Digital Twin Development Company | Mirai Studios",
    metaDescription:
      "Mirai Studios builds interactive digital twins and real-time 3D experiences for real estate, healthcare, manufacturing and enterprise use cases.",
    eyebrow: "Services",
    h1: "Digital twins that make operations and places understandable",
    intro:
      "We build interactive digital twins and real-time 3D experiences that help teams see facilities, assets and environments clearly, then act with better context.",
    sections: [
      {
        heading: "Problems we solve",
        body: [
          "Static diagrams and disconnected dashboards make it hard to understand space, capacity and status together. Stakeholders need a shared visual model they can explore.",
        ],
        bullets: [
          "Complex facilities that are hard to explain",
          "Operations data separated from spatial context",
          "Sales experiences that feel flat or static",
          "Demos that cannot run in a browser for clients",
        ],
      },
      {
        heading: "Capabilities",
        body: [
          "From interactive facility models to sales visualization and operations concepts, we combine 3D interaction design with product UX and engineering.",
        ],
        bullets: [
          "Interactive 3D environments",
          "Spatial navigation and selection flows",
          "Operational overlays and status views",
          "Browser-based delivery with modern web stacks",
          "Companion interfaces for tablets and desktops",
        ],
      },
      {
        heading: "When a digital twin is the right tool",
        body: [
          "Use a digital twin when space, assets or physical process matter to the decision. It is less useful when the problem is purely transactional and has no spatial or systems context to visualize.",
        ],
      },
      {
        heading: "Three.js and Unreal Engine",
        body: [
          "For many web-delivered twins and interactive sales experiences, Three.js and modern frontend stacks keep access simple in the browser. Unreal Engine can be appropriate for high-fidelity visualization or specialized runtime needs. We recommend based on audience, delivery channel and fidelity requirements rather than defaulting to one engine.",
        ],
      },
      {
        heading: "How Mirai approaches delivery",
        body: [
          "We define the decisions the twin must support, then design interaction, information hierarchy and performance around that. The twin is treated as a product experience, not only a 3D asset.",
        ],
      },
    ],
    relatedCaseStudies: ["mira-pulse", "esteria", "thyssenkrupp"],
    relatedServices: [
      { label: "Immersive Experiences", href: "/services/immersive-experiences" },
      { label: "Enterprise Engineering", href: "/services/enterprise-engineering" },
      { label: "Product Design", href: "/services/product-design" },
    ],
    relatedRegions: REGION_LINKS,
    faqs: [
      {
        question: "When should a company invest in a digital twin?",
        answer:
          "When space, assets or physical operations are part of the decision. Sales walkthroughs, facility operations and manufacturing visualization are typical. A twin is a weak fit for purely transactional workflows with no spatial layer.",
      },
      {
        question: "Do digital twins have to run in Unreal Engine?",
        answer:
          "No. Browser-based Three.js experiences are often enough when shareability matters. Unreal Engine can be right for higher-fidelity visualization. The engine follows audience, channel and fidelity, not novelty.",
      },
    ],
  },
  {
    slug: "product-design",
    path: "/services/product-design",
    title: "Product Design",
    metaTitle: "Product Design & UX for AI Products | Mirai Studios",
    metaDescription:
      "Mirai Studios designs clear product experiences and brand systems that make complex AI and software products easier to understand and use.",
    eyebrow: "Services",
    h1: "Product design for complex technology",
    intro:
      "We design product experiences that make AI and software feel clear, trustworthy and usable, from early flows through interface systems and visual identity.",
    sections: [
      {
        heading: "Problems we solve",
        body: [
          "Powerful systems fail when people cannot understand them. AI products especially need careful framing of uncertainty, actions and review.",
        ],
        bullets: [
          "Confusing onboarding and empty states",
          "AI output without clear next actions",
          "Inconsistent interface patterns across products",
          "Brand systems that do not scale with the product",
        ],
      },
      {
        heading: "Capabilities",
        body: [
          "Product strategy, UX/UI, interaction design and design systems that support engineering delivery.",
        ],
        bullets: [
          "Product discovery and experience mapping",
          "Interface design for AI-assisted work",
          "Design systems and component libraries",
          "Brand and visual identity support",
          "Design-engineering collaboration",
        ],
      },
      {
        heading: "How Mirai approaches delivery",
        body: [
          "Design and engineering stay close. We prototype the critical journeys first, validate comprehension and trust, then harden the system for production.",
        ],
      },
    ],
    relatedCaseStudies: ["cero", "enorta", "esteria", "mira-pulse"],
    relatedServices: [
      { label: "AI Product Development", href: "/services/ai-product-development" },
      { label: "Custom Software Development", href: "/services/custom-software-development" },
      { label: "Immersive Experiences", href: "/services/immersive-experiences" },
    ],
    relatedRegions: REGION_LINKS,
    faqs: [
      {
        question: "Why does AI product design need a different approach?",
        answer:
          "Model output is uncertain. Interfaces need to show what the system did, what a person should review, and what happens next. Generic UI patterns often hide that uncertainty.",
      },
      {
        question: "Does product design include brand work?",
        answer:
          "When it supports the product. Mirai designs interface systems, visual identity support and component libraries that engineering can implement, rather than brand work disconnected from delivery.",
      },
    ],
  },
  {
    slug: "immersive-experiences",
    path: "/services/immersive-experiences",
    title: "Immersive Experiences",
    metaTitle: "Immersive & Interactive Experience Design | Mirai Studios",
    metaDescription:
      "Mirai Studios builds immersive and interactive experiences across web 3D, spatial interfaces and premium visual storytelling for products and sales.",
    eyebrow: "Services",
    h1: "Immersive experiences that people can actually use",
    intro:
      "We create interactive and immersive experiences for sales, storytelling and product engagement, with a focus on access, clarity and performance.",
    sections: [
      {
        heading: "Problems we solve",
        body: [
          "High-concept immersive work often fails when it cannot be shared easily or when interaction gets in the way of understanding.",
        ],
        bullets: [
          "Experiences that require heavy installs",
          "Beautiful scenes with weak navigation",
          "Sales tools that do not explain the offer",
          "Immersive ideas without a delivery plan",
        ],
      },
      {
        heading: "Capabilities",
        body: [
          "Interactive 3D, panoramic walkthroughs, spatial UI and premium presentation layers designed for browsers and devices your audience already uses.",
        ],
        bullets: [
          "Interactive walkthroughs and selection flows",
          "Real-time 3D presentation experiences",
          "Spatial interface patterns",
          "Performance-minded web delivery",
          "Integration with product or sales workflows",
        ],
      },
      {
        heading: "How Mirai approaches delivery",
        body: [
          "We design immersion around the story and the decision. Interaction supports exploration, while the experience remains shareable and purposeful.",
        ],
      },
    ],
    relatedCaseStudies: ["esteria", "thyssenkrupp", "mira-pulse"],
    relatedServices: [
      { label: "Digital Twin Development", href: "/services/digital-twin-development" },
      { label: "Product Design", href: "/services/product-design" },
    ],
    relatedRegions: REGION_LINKS,
    faqs: [
      {
        question: "Can immersive experiences run in a browser?",
        answer:
          "Many of the experiences Mirai builds are designed for the web so clients can share them without a heavy install. Higher-fidelity runtimes are used when the audience and hardware justify them.",
      },
      {
        question: "What is the difference between an immersive experience and a digital twin?",
        answer:
          "An immersive experience is often for storytelling, sales or exploration. A digital twin is built around a spatial or operational model of a place or system. The two can overlap, but the job to be done is different.",
      },
    ],
  },
  {
    slug: "enterprise-engineering",
    path: "/services/enterprise-engineering",
    title: "Enterprise Engineering",
    metaTitle: "Enterprise Software Engineering Partner | Mirai Studios",
    metaDescription:
      "Mirai Studios engineers the infrastructure, integrations and systems that make AI products and platforms reliable, secure and scalable.",
    eyebrow: "Services",
    h1: "Enterprise engineering for products that must hold up",
    intro:
      "We build the systems layer behind ambitious products: APIs, integrations, cloud architecture, security practices and operational reliability.",
    sections: [
      {
        heading: "Problems we solve",
        body: [
          "Products stall when the underlying systems cannot support growth, compliance needs or integration with existing enterprise tools.",
        ],
        bullets: [
          "Fragile integrations between systems",
          "Architecture that cannot scale with usage",
          "Missing operational visibility",
          "Security and access control gaps",
        ],
      },
      {
        heading: "Capabilities",
        body: [
          "Engineering that supports product teams without turning every feature into a rewrite.",
        ],
        bullets: [
          "Cloud and application architecture",
          "API design and system integrations",
          "Auth, roles and auditability",
          "Data pipelines for AI-assisted products",
          "Reliability and delivery practices",
        ],
      },
      {
        heading: "How Mirai approaches delivery",
        body: [
          "We engineer for the product’s current stage while leaving a clear path to harden and scale. Enterprise requirements are treated as product constraints, not afterthoughts.",
        ],
      },
    ],
    relatedCaseStudies: ["lillyai", "mira-pulse", "thyssenkrupp"],
    relatedServices: [
      { label: "AI Product Development", href: "/services/ai-product-development" },
      { label: "Custom Software Development", href: "/services/custom-software-development" },
      { label: "Digital Twin Development", href: "/services/digital-twin-development" },
    ],
    relatedRegions: REGION_LINKS,
    faqs: [
      {
        question: "What does enterprise engineering cover at Mirai?",
        answer:
          "APIs, cloud architecture, integrations, authentication, roles, auditability and the reliability practices that keep AI products and platforms usable after launch.",
      },
      {
        question: "Can Mirai work with an existing internal engineering team?",
        answer:
          "Yes. Scale-with-us engagements extend an internal team. Enterprise engineering work can also sit inside a fixed-scope product build when the systems layer is part of shipping the product.",
      },
    ],
  },
];

export function getServicePage(slug: string) {
  return SERVICE_PAGES.find((page) => page.slug === slug);
}

export function getAllServiceSlugs() {
  return SERVICE_PAGES.map((page) => page.slug);
}
