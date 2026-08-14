export const SITE = {
  name: "Mirai Studios",
  tagline: "Bringing\ntechnology to life",
  url: "https://miraistudios.com",
  description:
    "From AI products and internal business platforms to immersive digital twins and interactive experiences, our portfolio showcases solutions that transform how businesses operate and engage.",
  email: "hello@miraistudios.co",
} as const;

export const ANNOUNCEMENT = {
  text: "Cero is Free for a Limited Time",
  cta: "Learn More",
  href: "https://usecero.com",
} as const;

export const NAV_LINKS = [
  { label: "Our Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Work With Us", href: "#engagement" },
] as const;

export const HERO = {
  headline: "Building AI Products That Drive Business Growth",
  /** Explicit line breaks for the display headline. */
  headlineLines: ["Building AI", "Products That Drive", "Business Growth"] as const,
  body:
    "We help businesses design, build, and scale AI products, internal platforms, and intelligent automation. From strategy and product design to engineering and deployment, we deliver end-to-end solutions that create measurable business impact.",
  cta: "Book a Call",
} as const;

export const TRUST_STRIP = {
  text: "Trusted by leading startups and enterprises",
  cta: "Work with Us",
} as const;

export const VIDEO_SECTION = {
  eyebrow: "Inside Mirai",
  title: "See how Mirai Studios brings technology to life",
  body:
    "A closer look at the product thinking, engineering craft, and visual systems behind our work.",
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
}

/** Logo wall order. */
export const CLIENT_ROWS: ClientLogo[][] = [
  [
    { name: "Lilly AI", file: "lilly-ai-wordmark.svg" },
    { name: "Rivian", file: "rivian.svg" },
  ],
  [
    { name: "Google", file: "google.svg" },
    { name: "enorta", file: "enorta.png" },
    { name: "Cero", file: "cero.png" },
    { name: "salesforce", file: "salesforce.svg" },
  ],
  [
    { name: "Epidemic Sound", file: "epidemic-sound.png" },
    { name: "LaunchDarkly", file: "launchdarkly.svg" },
    { name: "Tim Hortons", file: "tim-hortons.svg" },
    { name: "Flipboard", file: "flipboard.svg" },
  ],
];

export const SERVICES_INTRO = {
  eyebrow: "Services",
  title: "What We Do",
  body:
    "From AI products and enterprise platforms to digital twins and immersive systems, we turn ambitious ideas into technology that ships, scales and creates measurable value.",
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
      "We design and build intelligent products that automate complex workflows, augment teams and create entirely new digital experiences.",
    capabilities: ["AI Products", "AI Agents & Copilots", "Intelligent Automation", "Predictive & Generative AI"],
    media: {
      src: "/case-studies/cero/image-01.png",
      alt: "Cero AI product interface built by Mirai Studios",
    },
    href: "#work",
  },
  {
    id: "digital-products",
    number: "02",
    title: "Digital Products & Platforms",
    description:
      "We turn ambitious product ideas into scalable web, mobile, SaaS and enterprise platforms from strategy through deployment.",
    capabilities: ["SaaS Platforms", "Web Applications", "Mobile Products", "Enterprise Platforms"],
    media: {
      src: "/case-studies/storypage-ai/image-01.png",
      alt: "StoryPage digital product platform interface",
    },
    href: "#work",
  },
  {
    id: "digital-twins",
    number: "03",
    title: "Digital Twins & Real-Time 3D",
    description:
      "We transform physical spaces, assets and environments into interactive digital experiences built for visualization, simulation and engagement.",
    capabilities: ["Digital Twins", "Real-Time 3D", "Interactive Visualization", "Simulation"],
    media: {
      src: "/case-studies/thyssenkrupp/image-01.png",
      alt: "thyssenkrupp interactive digital twin experience",
    },
    href: "#work",
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
    href: "#work",
  },
  {
    id: "spatial",
    number: "05",
    title: "Spatial & Immersive Experiences",
    description:
      "We build spatial experiences that extend digital products beyond traditional screens into AR, VR, XR and interactive environments.",
    capabilities: ["AR", "VR", "XR", "Interactive Experiences"],
    media: {
      src: "/case-studies/thyssenkrupp/image-03.png",
      alt: "Immersive spatial visualization from Mirai Studios",
    },
    href: "#work",
  },
  {
    id: "enterprise",
    number: "06",
    title: "Enterprise Engineering",
    description:
      "We engineer the infrastructure, integrations and systems required to make ambitious digital products reliable, secure and scalable.",
    capabilities: ["Cloud Architecture", "API Systems", "Enterprise Integrations", "Cybersecurity"],
    media: {
      src: "/case-studies/lillyai/image-01.png",
      alt: "LillyAI enterprise clinical intelligence platform",
    },
    href: "#work",
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

export const WORK_INTRO = {
  eyebrow: "Our Work",
  title: "Proven innovations",
  body:
    "From AI products and internal business platforms to immersive digital twins and interactive experiences, our portfolio showcases solutions that transform how businesses operate and engage.",
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
  subtitle: "Productive Long-term innovation",
  cta: "Contact Us",
} as const;

export const PARTNER_LOGOS: ClientLogo[] = [
  { name: "Mirai Studios Partner", file: "partner-mark.svg" },
];

export const TESTIMONIALS_INTRO = {
  title: "Trusted globally to deliver experiences that outperform.",
  cta: "Work with Us",
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
  eyebrow: "Work with Mirai",
  title: "Ways to build with us",
  body:
    "Scale your vision with flexible engagement models: from fixed-scope projects to dedicated engineering teams.",
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
    description: "End-to-end execution model. Share your vision, we define scope, architecture, and roadmap.",
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
    cta: "Contact Us",
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
    description: "Productive Long-term innovation & transformation collaboration for visionary organizations.",
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

export const CONTACT = {
  title: "Start building with us",
  body: "Tell us about your project. We'll take it from there, with a strategy session within 48 hours.",
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
  title: "Let's Collaborate",
  body: "Ready to engineer the next digital reality? We're accepting new projects for Q2 2026: limited slots available.",
  primary: "Work with Us",
  secondary: "Contact Us",
} as const;
