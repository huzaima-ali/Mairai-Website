export const SITE = {
  name: "Mirai Studios",
  tagline: "Bringing technology to life",
  url: "https://miraistudios.com",
  description:
    "Innovation is the only way to thrive in the future. As an immersive technology partner, we design and build intelligent digital experiences at the intersection of AI, XR, real-time 3D, and next-generation platforms.",
  email: "hello@miraistudios.com",
} as const;

export const ANNOUNCEMENT = {
  text: "Cero is 15% OFF - Limited Time Offer",
  cta: "Learn More",
  href: "#work",
} as const;

export const NAV_LINKS = [
  { label: "Our Services", href: "#services" },
  { label: "Portfolio", href: "#work" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Work With Us", href: "#engagement" },
] as const;

export const HERO = {
  headline: "Bringing technology to life",
  body:
    "Innovation is the only way to thrive in the future. As an immersive technology partner, we design and build intelligent digital experiences at the intersection of AI, XR, real-time 3D, and next-generation platforms.",
  cta: "Contact Us",
} as const;

export interface Stat {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: 230, suffix: "+", label: "Projects Delivered" },
  { value: 100, suffix: "%", label: "On-Time Delivery" },
  { value: 23, prefix: "$", suffix: "M+", label: "Value Created" },
  { value: 120, suffix: "+", label: "Trusted Clients" },
];

export const TRUST_STRIP = {
  text: "Trusted by leading startups and enterprises",
  cta: "Work with Us",
} as const;

/**
 * Client logo wall — 3 rows × 6, in the exact Figma order. Each logo points to
 * a real asset in `public/logos/` (download via `scripts/download-figma-assets.mjs`).
 * `name` is used for alt text and as a graceful wordmark fallback if the file
 * is missing.
 */
export interface ClientLogo {
  name: string;
  file: string;
}

export const CLIENT_ROWS: ClientLogo[][] = [
  [
    { name: "Rivian", file: "rivian.svg" },
    { name: "Digital Saudi", file: "digital-saudi.png" },
    { name: "Saudi Tourism Authority", file: "saudi-tourism.png" },
    { name: "NHC Innovation", file: "nhc.svg" },
    { name: "Coca-Cola", file: "coca-cola.svg" },
    { name: "PwC", file: "pwc.svg" },
  ],
  [
    { name: "Flipboard", file: "flipboard.svg" },
    { name: "Google", file: "google.svg" },
    { name: "enorta", file: "enorta.svg" },
    { name: "McLaren", file: "mclaren.svg" },
    { name: "Cero", file: "cero.svg" },
    { name: "salesforce", file: "salesforce.svg" },
  ],
  [
    { name: "Eye of Riyadh", file: "eye-of-riyadh.svg" },
    { name: "Epidemic Sound", file: "epidemic-sound.svg" },
    { name: "Lexus", file: "lexus.svg" },
    { name: "WNBA", file: "wnba.svg" },
    { name: "LaunchDarkly", file: "launchdarkly.svg" },
    { name: "Tim Hortons", file: "tim-hortons.svg" },
  ],
];

export const SERVICES_INTRO = {
  eyebrow: "Services",
  title: "What We Do",
  body:
    "For over half a decade, we've been engineering the digital bridges that connect people, brands, and experiences.",
} as const;

export interface Service {
  id: string;
  index: string;
  title: string;
  description: string;
  toolsLabel: string;
  tools: string[];
}

export const SERVICES: Service[] = [
  {
    id: "ai-native",
    index: "01",
    title: "AI-Native Products & Agents",
    description:
      "We build intelligent AI products and autonomous agents that automate workflows, assist teams, and scale business operations.",
    toolsLabel: "Used tools for AI-Native Products & Agents:",
    tools: ["OpenAI", "Claude", "LangChain", "Vercel AI SDK", "Pinecone", "Supabase"],
  },
  {
    id: "ar-vr",
    index: "02",
    title: "Immersive AR/VR Systems",
    description:
      "We craft immersive AR and VR experiences that blend digital content with the physical world for training, retail, and entertainment.",
    toolsLabel: "Used tools for Immersive AR/VR Systems:",
    tools: ["Unity", "Unreal Engine", "WebXR", "ARKit", "ARCore", "Three.js"],
  },
  {
    id: "platforms",
    index: "03",
    title: "Web, Mobile & SaaS Platform Builds",
    description:
      "We design and engineer fast, scalable web, mobile, and SaaS platforms built to grow with your business.",
    toolsLabel: "Used tools for Platform Builds:",
    tools: ["Next.js", "React Native", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    id: "brand",
    index: "04",
    title: "UI/UX & Brand Identity Systems",
    description:
      "We create cohesive UI/UX and brand identity systems that make products feel intuitive, consistent, and unmistakably yours.",
    toolsLabel: "Used tools for Brand Identity Systems:",
    tools: ["Figma", "Framer", "Webflow", "Storybook", "Adobe CC", "Lottie"],
  },
  {
    id: "cloud",
    index: "05",
    title: "Cloud, Cybersecurity & API Systems",
    description:
      "We build secure, resilient cloud infrastructure and APIs with security and compliance engineered in from day one.",
    toolsLabel: "Used tools for Cloud & API Systems:",
    tools: ["Kubernetes", "Docker", "Terraform", "GraphQL", "Cloudflare", "Auth0"],
  },
  {
    id: "3d",
    index: "06",
    title: "Real-time 3D Worlds & Digital Twins",
    description:
      "We develop real-time 3D worlds and digital twins that mirror physical environments for simulation and visualization.",
    toolsLabel: "Used tools for 3D Worlds & Digital Twins:",
    tools: ["Unreal Engine", "NVIDIA Omniverse", "Cesium", "WebGL", "Blender", "Houdini"],
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
  /** Tailwind gradient classes used for the product-showcase artwork. */
  artwork: string;
}

export const PROJECTS: Project[] = [
  {
    id: "cero",
    eyebrow: "AI-Powered Products",
    title: "Cero: LinkedIn AI Tool",
    description:
      "We don't just design SaaS products: we co-build them. Cero is the first complete LinkedIn tool that uses AI, image creation, and carousels to craft personalized posts with humanity-level quality.",
    features: ["Founders & entrepreneurs", "Freelancers & consultants", "Coaches & personal brands"],
    closing:
      "Cero eliminates the gap between knowing you need a LinkedIn presence and actually having one, replacing hours of content creation with intelligent, on-brand output in minutes.",
    cta: "View Project",
    artwork: "from-[#1a1a1d] via-[#241410] to-[#c7401f]",
  },
  {
    id: "desert-oasis",
    eyebrow: "Immersive 3D Experience",
    title: "Desert Oasis",
    description:
      "From sand-colored architectural renders to drone-view site walkthroughs, we don't just visualize spaces, we bring them to life. Immersive 3D experiences that turn concepts into compelling realities.",
    features: [
      "Photorealistic sand-colored architectural visualization",
      "Drone-view aerial walkthroughs of the full site",
      "Sunset-ready lighting with infinity pools & wellness spaces",
    ],
    closing:
      "Desert Oasis transforms a premium desert escape into a fully realized 3D world, blending modern architecture with natural Saudi landscapes through sunset lighting, infinity pools, and aerial visualization.",
    cta: "View Project",
    artwork: "from-[#caa46a] via-[#b07a44] to-[#5c3b22]",
  },
];

export const WORK_INTRO = {
  eyebrow: "Our Work",
  title: "Proven innovations",
  body:
    "From urban digital twins to AI-driven activations, our portfolio features executions that redefine digital interaction across industries.",
} as const;

export interface WorkItem {
  id: string;
  title: string;
  size: "large" | "small";
  artwork: string;
}

export const WORK_ITEMS: WorkItem[] = [
  { id: "enorta", title: "Enorta: Storytelling Reimagined", size: "large", artwork: "from-[#0a1418] via-[#0f2a33] to-[#16505f]" },
  { id: "sakani", title: "Sakani Metaverse", size: "large", artwork: "from-[#101013] via-[#1c1430] to-[#3a2a66]" },
  { id: "nhc", title: "NHC 3D Saudi Arabia", size: "small", artwork: "from-[#10130f] via-[#1c2a18] to-[#3c5c2c]" },
  { id: "coke", title: "CokeStudio: CokeVerse", size: "small", artwork: "from-[#1a0b0b] via-[#3a1212] to-[#a01722]" },
  { id: "rua", title: "RUA Al Madinah", size: "small", artwork: "from-[#16120b] via-[#2e2415] to-[#6e5226]" },
];

export const PARTNER_BAR = {
  title: "Partner With Us",
  subtitle: "Productive Long-term innovation",
  cta: "Contact Us",
} as const;

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
  /** Avatar photo (file in `public/testimonials/`); initials are used as fallback. */
  avatar: string;
  size: "small" | "large";
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "enorta",
    quote:
      "Mirai Studios transformed our concept into a scalable, market-ready AI platform with flawless execution and 100% on-time delivery.",
    name: "Sarah Jenkins",
    role: "Director of Digital Delivery at Enorta",
    logo: { name: "enorta", file: "enorta.svg" },
    avatar: "sarah-jenkins.png",
    size: "small",
  },
  {
    id: "sta",
    quote:
      "Their specialists operated as a seamless extension of our own company. Mirai's technical architecture has essentially future proofed our digital roadmap.",
    name: "Tariq Al-Fadli",
    role: "Head of Digital Experiences, Saudi Tourism Authority",
    logo: { name: "Saudi Tourism Authority", file: "saudi-tourism.png" },
    avatar: "tariq-al-fadli.png",
    size: "large",
  },
  {
    id: "nhc",
    quote:
      "Their hyper-realistic 3D visualization and seamless enterprise integration were game-changing. Mirai Studios is a true innovation partner.",
    name: "Khalid Al-Dosari",
    role: "VP of Digital Transformation at NHC",
    logo: { name: "NHC", file: "nhc.svg" },
    avatar: "khalid-al-dosari.png",
    size: "small",
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
      "Share your vision or RFP",
      "Fixed or milestone-based pricing",
      "We define scope, architecture & roadmap",
      "Full-cycle delivery: strategy to deployment",
    ],
    bestFor: [
      "Governments and public sector",
      "Enterprises and large organizations",
      "Large-scale immersive or AI platforms",
    ],
    cta: "Contact Us",
  },
  {
    id: "scale",
    badge: "Most Popular",
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

export const MAIN_CTA = {
  title: "Let's Collaborate",
  body: "Ready to engineer the next digital reality? We're accepting new projects for Q2 2026: limited slots available.",
  primary: "Work with Us",
  secondary: "Contact Us",
} as const;
