export const SITE = {
  name: "Mirai Studios",
  tagline: "Bringing\ntechnology to life",
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
  cta: "Book a Call",
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

/** Exact Figma logo wall order (3 rows × 4). */
export const CLIENT_ROWS: ClientLogo[][] = [
  [
    { name: "Coca-Cola", file: "coca-cola.svg" },
    { name: "Lilly AI", file: "lilly-ai-wordmark.svg" },
    { name: "Rivian", file: "rivian.svg" },
    { name: "PwC", file: "pwc.svg" },
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
  /** Image under `public/images/`. */
  image: string;
}

export const PROJECTS: Project[] = [
  {
    id: "cero",
    eyebrow: "AI-Powered Products",
    title: "LinkedIn personal branding assistant",
    description:
      "We don't just design SaaS products: we co-build them. Cero is the first complete LinkedIn tool that uses AI, image creation, and carousels to craft personalized posts with humanity-level quality.",
    features: ["Founders & entrepreneurs", "Freelancers & consultants", "Coaches & personal brands"],
    closing:
      "Cero eliminates the gap between knowing you need a LinkedIn presence and actually having one, replacing hours of content creation with intelligent, on-brand output in minutes.",
    cta: "View Project",
    image: "cero-project.png",
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
    image: "desert-oasis.png",
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
  image: string;
}

export const WORK_ITEMS: WorkItem[] = [
  { id: "enorta", title: "Enorta: Storytelling Reimagined", size: "large", image: "work-enorta.png" },
  {
    id: "real-estate",
    title: "Real Estate Virtual Sales Center",
    size: "large",
    image: "work-real-estate.png",
  },
  {
    id: "virtual-community",
    title: "Virtual Real Estate Community",
    size: "small",
    image: "work-virtual-community.png",
  },
  { id: "coke", title: "COCA COLA", size: "small", image: "work-coca-cola.png" },
  {
    id: "vr-prop",
    title: "Interactive Prop VR Experience",
    size: "small",
    image: "work-vr-prop.png",
  },
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
    logo: { name: "enorta", file: "enorta-testimonial.svg" },
    avatar: "sarah-jenkins.png",
    size: "small",
  },
  {
    id: "cero",
    quote:
      "Their specialists operated as a seamless extension of our own company. Mirai's technical architecture has essentially future proofed our digital roadmap.",
    name: "Tariq Al-Fadli",
    role: "Head of Digital Experiences, Cero",
    logo: { name: "Cero", file: "cero-testimonial.svg" },
    avatar: "tariq-al-fadli.png",
    size: "large",
  },
  {
    id: "lilly",
    quote:
      "Their hyper-realistic 3D visualization and seamless enterprise integration were game-changing. Mirai Studios is a true innovation partner.",
    name: "Khalid Al-Dosari",
    role: "VP of Digital Transformation at lilly AI",
    logo: { name: "lilly AI", file: "lilly-ai.svg" },
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

export const MAIN_CTA = {
  title: "Let's Collaborate",
  body: "Ready to engineer the next digital reality? We're accepting new projects for Q2 2026: limited slots available.",
  primary: "Work with Us",
  secondary: "Contact Us",
} as const;
