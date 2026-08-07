export const SITE = {
  name: "Mirai Studios",
  tagline: "Bringing\ntechnology to life",
  url: "https://miraistudios.com",
  description:
    "From AI products and internal business platforms to immersive digital twins and interactive experiences, our portfolio showcases solutions that transform how businesses operate and engage.",
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
  headline: "Building AI Products That Drive Business Growth",
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
    "For over half a decade, we've been engineering the digital bridges that connect people, brands, and experiences.",
} as const;

export interface Service {
  id: string;
  index: string;
  title: string;
  description: string;
  toolsLabel: string | null;
  tools: string[];
}

export const SERVICES: Service[] = [
  {
    id: "ai-native",
    index: "01",
    title: "AI-Native Products & Agents",
    description:
      "We build intelligent AI products and autonomous agents that automate workflows, assist teams, and scale business operations.",
    toolsLabel: null,
    tools: [
      "AI Product Development (MVP -> scale)",
      "AI Software Development",
      "AI Automation",
      "Predictive AI",
      "AI Agents & Copilots",
      "Industry AI Solutions",
      "Generative AI solutions",
    ],
  },
  {
    id: "platforms",
    index: "02",
    title: "Web, Mobile & SaaS Platform Builds",
    description:
      "We build scalable web, mobile, and SaaS platforms for startups, enterprises, marketplaces, dashboards, and customer-facing digital products.",
    toolsLabel: "Used tools for Web, Mobile & SaaS Platform Builds:",
    tools: [
      "SaaS Product Development",
      "Enterprise Software Dev.",
      "AI-Powered Applications",
      "Web Application Development",
      "Cloud & Backend Engineering",
      "Product Maintenance & Scaling",
    ],
  },
  {
    id: "3d",
    index: "03",
    title: "Real-time 3D Worlds & Digital Twins",
    description:
      "We create interactive 3D environments, simulations, and digital twins for visualization, training, planning, and real-time operational insight.",
    toolsLabel: "Used tools for Real-time 3D Worlds & Digital Twins:",
    tools: [
      "Digital Twin Solutions",
      "Real-Time 3D Applications",
      "Interactive Masterplans",
      "Virt. Showroom & Sales Galleries",
      "Infrastructure Twins",
      "Building & Facility Twins",
      "Web-Based 3D Experiences",
      "Live Data & IoT Visualization",
    ],
  },
  {
    id: "brand",
    index: "04",
    title: "UI/UX & Brand Identity Systems",
    description:
      "We design intuitive digital experiences and cohesive brand systems that help products look polished, feel usable, and communicate clearly.",
    toolsLabel: "Used tools for UI/UX & Brand Identity Systems:",
    tools: [
      "Product Design",
      "Mobile App Design",
      "Enterprise Dashboard Design",
      "UX Research & Testing",
      "SaaS & Web Platform Design",
      "Brand Identity Systems",
      "Interactive Prototyping",
      "Product Discovery",
    ],
  },
  {
    id: "ar-vr",
    index: "05",
    title: "Immersive XR Systems",
    description:
      "We create immersive AR, VR, and mixed-reality experiences for training, simulation, product visualization, & interactive environments.",
    toolsLabel: "Used tools for Immersive AR/VR Systems:",
    tools: [
      "Immersive training & simulation",
      "Metaverse & Virtual World",
      "Gamified Engagements",
      "XR application Dev.",
    ],
  },
  {
    id: "cloud",
    index: "06",
    title: "Cloud, Cybersecurity & API Systems",
    description:
      "We architect secure cloud infrastructure, backend systems, integrations, and APIs for reliable, scalable, and protected digital operations.",
    toolsLabel: "Used tools for Cloud, Cybersecurity & API Systems:",
    tools: [
      "Cloud Architecture",
      "Cloud Migration",
      "DevOps & CI/CD",
      "Containerization & Kubernetes",
      "Infrastructure as Code",
      "Backend Infrastructure",
      "Monitoring & Observability",
      "Managed Cloud Infrastructure",
    ],
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
    name: "[Client Name]",
    role: "[Title], Mindful Legal Solutions",
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
