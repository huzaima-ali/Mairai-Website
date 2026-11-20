export const SITE = {
  name: "Mirai Studios",
  tagline: "We make ambitious ideas real.",
  identity: "Product engineering and applied AI",
  url: "https://miraistudios.co",
  description:
    "Mirai Studios helps founders and businesses design, build and scale digital products from MVP to production, with practical AI consulting and implementation across the US, UK and Middle East.",
  positioning:
    "We work with founders, startups and established businesses to take products from concept through MVP, launch and production. We also help organisations identify practical AI opportunities, design a roadmap and implement working solutions inside existing operations and products.",
  email: "hello@miraistudios.co",
} as const;

export const FOUNDERS = {
  people: [
    { name: "Bilal Ahmed", href: "https://www.linkedin.com/in/bilalahmed99/" },
    { name: "Ahmad Mujtaba", href: "https://www.linkedin.com/in/madebyahmad/" },
  ],
} as const;

export type NavLink = {
  label: string;
  href: string;
  /** Renders a products mega-dropdown instead of a plain link. */
  dropdown?: "products" | "work-with-us";
  /** Place this item on the right side of the nav (desktop). */
  align?: "end";
};

export const WORK_WITH_US_LINKS = [
  { label: "Request a call", description: "Tell us about your project", href: "/#contact" },
  { label: "Partner with us", description: "Agencies & delivery partners", href: "/partners" },
] as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Our Services", href: "/#services" },
  { label: "Our Products", href: "/#products", dropdown: "products" },
  { label: "Our Work", href: "/#work" },
  { label: "Insights", href: "/insights" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Build With Us", href: "/#contact", dropdown: "work-with-us" },
  { label: "Careers", href: "/careers", align: "end" },
];

export const HERO = {
  eyebrow: "Product engineering and applied AI",
  headline: "We make ambitious ideas real.",
  /** Explicit line breaks for the display headline. */
  headlineLines: ["We make ambitious", "ideas real."] as const,
  body:
    "From MVPs to production-ready platforms, we help founders and businesses design, build and scale digital products. We also help organisations turn AI opportunities into practical solutions, from strategy and consulting to implementation.",
  primaryCta: "Explore Our Work",
  primaryHref: "/#products",
  secondaryCta: "Build With Us",
  secondaryHref: "/#contact",
  cta: "Build With Us",
} as const;

export const HOME_ABOUT = {
  eyebrow: "Product engineering and applied AI",
  title: "What Mirai Studios builds",
  kicker: "From what if to what's live.",
} as const;

export const TRUST_STRIP = {
  text: "Selected products and teams we have built with",
  cta: "Build With Us",
} as const;

export const VIDEO_SECTION = {
  eyebrow: "Inside the studio",
  title: "A closer look at how we operate",
  body: "Product thinking, design craft and engineering, from the people who ship the work.",
  youtubeUrl: "https://www.youtube.com/embed/EbR1OEfwCFA?si=hngsfiP1_sDeKW8g",
  titleLabel: "Mirai Studios video",
} as const;

/**
 * Client logo wall. Each logo points to a real asset in `public/logos/`
 * (download via `scripts/download-figma-assets.mjs`). `name` is used for alt
 * text and as a graceful wordmark fallback if the file is missing.
 */
export interface ClientLogo {
  name: string;
  file: string;
  /** Pair the mark with the brand name so square icons are not stretched. */
  showName?: boolean;
  /** Black-background raster logos: blend so the plate disappears on white. */
  onDark?: boolean;
}

/** Logo wall order. Only brands represented in published case studies or testimonials. */
export const CLIENT_ROWS: ClientLogo[][] = [
  [
    { name: "Lilly AI", file: "lilly-ai-wordmark.svg" },
    { name: "Cero", file: "cero-mark.svg", showName: true },
    { name: "enorta", file: "enorta-mark.svg", showName: true },
    { name: "thyssenkrupp", file: "thyssenkrupp.webp", onDark: true },
    { name: "RoleRasta", file: "rolerasta-mark.png", showName: true, onDark: true },
  ],
];

export const SERVICES_INTRO = {
  eyebrow: "Capabilities",
  title: "What we can build with you",
  body:
    "End-to-end product development from MVP to production, and practical AI consulting through to implementation.",
} as const;

export interface ServiceMedia {
  src: string;
  alt: string;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  capabilities: string[];
  media: ServiceMedia;
  href: string;
}

export const SERVICES: Service[] = [
  {
    id: "ai-products",
    number: "01",
    title: "AI Products & Agents",
    description:
      "We help teams identify practical AI opportunities, then design and implement products, agents and workflows that fit existing operations.",
    capabilities: ["AI Products", "AI Agents & Copilots", "Intelligent Automation", "Predictive & Generative AI"],
    media: {
      src: "/case-studies/cero/image-01.png",
      alt: "Cero AI product interface built by Mirai Studios",
    },
    href: "/services/ai-product-development",
  },
  {
    id: "digital-products",
    number: "02",
    title: "Digital Products & Platforms",
    description:
      "From discovery and MVP validation to production-ready web, mobile, SaaS and enterprise platforms, we take products through launch and scale.",
    capabilities: ["SaaS Platforms", "Web Applications", "Mobile Products", "Enterprise Platforms"],
    media: {
      src: "/case-studies/storypage-ai/image-01.png",
      alt: "StoryPage digital product platform interface",
    },
    href: "/services/custom-software-development",
  },
  {
    id: "enterprise",
    number: "03",
    title: "AI for Businesses",
    description:
      "We help organisations put AI into existing operations, from opportunity mapping and a practical roadmap through to working automations and integrations.",
    capabilities: ["AI opportunity mapping", "Process automation", "System integrations", "Production deployment"],
    media: {
      src: "/case-studies/lillyai/image-01.png",
      alt: "LillyAI enterprise clinical intelligence platform",
    },
    href: "/services/ai-automation",
  },
  {
    id: "product-design",
    number: "04",
    title: "Product Design & Brand Systems",
    description:
      "We create clear, intuitive product experiences and visual systems that make complex technology easier to understand and use.",
    capabilities: ["Product Strategy", "UX/UI Design", "Design Systems", "Brand Identity"],
    media: {
      src: "/case-studies/enorta/image-02.png",
      alt: "Enorta product design and interface system",
    },
    href: "/services/product-design",
  },
  {
    id: "digital-twins",
    number: "05",
    title: "Digital Twins & Real-Time 3D",
    description:
      "We transform physical spaces, assets and environments into interactive digital experiences built for visualization, simulation and engagement.",
    capabilities: ["Digital Twins", "Real-Time 3D", "Interactive Visualization", "Simulation"],
    media: {
      src: "/case-studies/thyssenkrupp/image-01.png",
      alt: "thyssenkrupp interactive digital twin experience",
    },
    href: "/services/digital-twin-development",
  },
];

export interface Project {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  closing: string;
  cta: string;
  /** Image under `public/images/`. */
  image: string;
}

export const PROJECTS: Project[] = [
  {
    id: "cero",
    eyebrow: "AI-Powered Products",
    title: "Cero LinkedIn personal branding assistant",
    description:
      "We don't just design SaaS products: we co-build them. Cero is the first complete LinkedIn tool that uses AI, image creation, and carousels to craft personalized posts with humanity-level quality.",
    features: ["Founders & entrepreneurs", "Freelancers & consultants", "Coaches & personal brands"],
    closing:
      "Cero eliminates the gap between knowing you need a LinkedIn presence and actually having one, replacing hours of content creation with intelligent, on-brand output in minutes.",
    cta: "View Project",
    image: "cero-project.png",
  },
];

export const PRODUCTS_INTRO = {
  eyebrow: "Products we ship",
  title: "Here is what we have built",
  body:
    "Live products and studio builds, including RoleRasta, Cofound and Cero. Open a demo, then read the problem, what Mirai delivered and the resulting value.",
} as const;

export const WORK_INTRO = {
  eyebrow: "Client work",
  title: "Built to be used, not just demonstrated",
  body:
    "Selected client engagements, from clinical platforms to immersive plant experiences. Each case study covers the problem, what Mirai delivered and the resulting value.",
} as const;

export interface WorkItem {
  id: string;
  title: string;
  size: "large" | "small";
  image: string;
}

export const WORK_ITEMS: WorkItem[] = [
  { id: "enorta", title: "Enorta: Storytelling Reimagined", size: "large", image: "work-enorta.png" },
];

export const PARTNER_BAR = {
  title: "Partner With Us",
  subtitle: "Long-term product collaboration",
  cta: "Build With Us",
} as const;

export const PARTNER_LOGOS: ClientLogo[] = [
  { name: "Mirai Studios", file: "mirai-studios-mark.svg" },
];

export const TESTIMONIALS_INTRO = {
  title: "The people and products behind the work.",
  cta: "Build With Us",
} as const;

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  /** Full role line exactly as shown in Figma (includes the company). */
  role: string;
  /** Brand mark shown at the card's bottom-right (file in `public/logos/`). */
  logo: ClientLogo;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "lillyai",
    quote:
      "Mirai Studios helped us transform LillyAI from an early AI reporting product into a structured enterprise platform. Their team brought clarity across product strategy, user experience, AI architecture and development, while working closely with us as a long-term technology partner.",
    name: "Riyan Amjad Siddiqi",
    role: "Director, ATR Enterprises",
    logo: { name: "lilly AI", file: "lilly-ai.svg" },
  },
  {
    id: "cero",
    quote:
      "Mirai Studios helped turn Cero from an early product idea into a complete AI-powered platform. Their ability to combine product strategy, user experience and technical execution allowed us to move quickly while still building a strong foundation for future growth.",
    name: "Ali Ahmed",
    role: "Head of Product, Cero",
    logo: { name: "Cero", file: "cero-testimonial.svg" },
  },
  {
    id: "enorta",
    quote:
      "We worked with Mirai Studios across the entire Enorta product journey, from early product thinking and user experience through to the design and development of the platform. What we appreciated most was their ability to balance the technical complexity of the build with the simplicity we wanted for our users.",
    name: "Aneeq Duraiz",
    role: "CEO, Enorta",
    logo: { name: "enorta", file: "enorta-testimonial.svg" },
  },
  {
    id: "thyssenkrupp",
    quote:
      "Working with Mirai Studios changed the way we communicate what we built. They took something enormously complex, including an entire U.S. manufacturing plant and the milestones of our partnership with Tesla, and transformed it into an experience that people could clearly see and understand.",
    name: "Dezzeria Wright",
    role: "Head of Marketing, thyssenkrupp",
    logo: { name: "thyssenkrupp", file: "thyssenkrupp.webp" },
  },
  {
    id: "storypage-ai",
    quote:
      "Mirai Studios understood that StoryPage.ai was not just about generating books, but about helping families create something personal and lasting. They turned that vision into a thoughtful, easy-to-use product that makes every story feel truly unique.",
    name: "Awab Rizwan",
    role: "Product at StoryPage.ai",
    logo: { name: "StoryPage.ai", file: "storypage-ai.svg" },
  },
  {
    id: "mindful-legal-solutions",
    quote:
      "Mirai Studios helped us transform the idea behind Mindful Legal Solutions into a practical AI-powered platform. They understood how to simplify complex legal workflows and created an experience that allows users to ask questions, generate documents and access guidance without feeling overwhelmed by the process.",
    name: "Priya Mehta",
    role: "Founder, Mindful Legal Solutions",
    logo: { name: "Mindful Legal Solutions", file: "mindful-legal-solutions.svg" },
  },
];

export const ENGAGEMENT_INTRO = {
  eyebrow: "How we work",
  title: "Strategy meets design meets engineering",
  body:
    "We do not stop at advice. Choose how you want to build with Mirai, from a defined product engagement to a dedicated studio team that can design, develop, deploy and maintain the solution.",
} as const;

export interface EngagementModel {
  id: string;
  badge: string;
  name: string;
  description: string;
  features: string[];
  bestFor: string[];
  cta: string;
  featured?: boolean;
}

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    id: "build",
    badge: "End-to-End",
    name: "Build With Us",
    description: "Share the idea. We shape the product, design the experience and engineer the system through to launch.",
    features: [
      "Share your vision",
      "Fixed or milestone-based pricing",
      "We define scope, architecture & roadmap",
      "Full-cycle delivery: strategy to deployment",
    ],
    bestFor: [
      "Startups building their first product",
      "Businesses developing internal tools",
      "Teams automating workflows with AI",
      "Companies modernizing legacy systems"
    ],
    cta: "Build With Us",
  },
  {
    id: "scale",
    badge: "Hybrid",
    name: "Scale With Us",
    description: "Extend your internal team with our specialists. Flexible engagement, your standards.",
    features: [
      "AI Engineers and Technical Architects",
      "Full-Stack and Unreal/Unity Developers",
      "3D Artists and Product Managers",
      "Monthly retainer or dedicated resource model",
    ],
    bestFor: ["Teams that need to ship faster", "Hybrid team integration", "Dedicated resource engagements"],
    cta: "Contact Us",
    featured: true,
  },
  {
    id: "partner",
    badge: "Long Term",
    name: "Partner With Us",
    description: "A longer collaboration for teams that want a standing product studio alongside their own.",
    features: [
      "Tech roadmap co-creation",
      "Innovation lab setup and R&D partnerships",
      "Joint product development",
      "Revenue-share models and pilot programs",
    ],
    bestFor: ["Vision 2030-aligned entities", "Smart cities and mega-projects", "Enterprises exploring transformation"],
    cta: "Contact Us",
  },
];

export const HOME_FAQS = [
  {
    question: "What does Mirai Studios do?",
    answer:
      "Mirai Studios is a product engineering and applied AI consultancy. We help founders and businesses design, build and scale digital products from MVP to production, and we help organisations turn AI opportunities into working solutions. Work typically covers strategy, design, engineering and deployment for companies in the United States, United Kingdom and Middle East.",
  },
  {
    question: "Does Mirai Studios build Super Intelligence or AGI?",
    answer:
      "No. Super Intelligence, AGI and ASI are research and policy topics, not products Mirai sells. We build applied AI systems with defined workflows, integrations and human oversight. Super Intelligence language on this site refers to longer-term capability trends, not a claim that Mirai develops frontier foundation models.",
  },
  {
    question: "Where does Mirai Studios work?",
    answer:
      "Mirai partners with clients across the United States, United Kingdom and Middle East. Delivery is remote from the studio in Pakistan, with planned overlap for workshops, reviews and decision-making.",
  },
  {
    question: "How do we start a project?",
    answer:
      "Use the contact form on this page or email hello@miraistudios.co. Share the problem, users and any constraints. The team follows up to discuss scope, approach and next steps.",
  },
] as const;

export const CONTACT = {
  title: "Have something ambitious in mind?",
  body: "Tell us about the product or the AI opportunity. We will follow up with a strategy session within 48 hours.",
  fullNamePlaceholder: "Full Name",
  phonePlaceholder: "00 0000 000",
  emailPlaceholder: "Email Address",
  messageLabel: "Please tell us about your project so that we can best help you",
  messagePlaceholder: "Share your project details, and what you aim to achieve…",
  submit: "Send Message",
} as const;

export const CONTACT_STEPS = [
  {
    id: "contact",
    eyebrow: "Step 1 of 3",
    title: "Your contact details",
    description: "Share the best way for us to reach you.",
  },
  {
    id: "project",
    eyebrow: "Step 2 of 3",
    title: "Your project",
    description: "Tell us what you want to build or improve.",
  },
  {
    id: "review",
    eyebrow: "Step 3 of 3",
    title: "Review and send",
    description: "Confirm your details before sending them to Mirai Studios.",
  },
] as const;

export const MAIN_CTA = {
  title: "Let's build it",
  body: "If you have a product to ship, a workflow to rethink, or an AI opportunity to implement, Mirai can help. New projects for 2026 are open.",
  primary: "Build With Us",
  secondary: "Explore Our Work",
} as const;
