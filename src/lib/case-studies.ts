import { SITE } from "@/lib/content";

export interface CaseStudyImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface CaseStudyInfoItem {
  label: string;
  value: string;
}

export interface CaseStudySection {
  heading: string;
  body: string[];
}

export interface CaseStudy {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  cardTitle: string;
  cardImage: CaseStudyImage;
  heroImage?: CaseStudyImage;
  websiteUrl?: string;
  /** External product / demo link shown on cards and case study pages. */
  demoUrl?: string;
  demoLabel?: string;
  /** When true, case study hero embeds demoUrl in an interactive iframe. */
  embedDemo?: boolean;
  videoUrl?: string;
  projectInfo: CaseStudyInfoItem[];
  sections: CaseStudySection[];
  gallery: CaseStudyImage[];
  testimonial?: {
    quote: string;
    attribution: string;
    logo?: {
      name: string;
      file: string;
    };
  };
  cta?: string;
  featured?: boolean;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "lillyai",
    eyebrow: "Healthcare AI",
    title: "LillyAI",
    cardTitle: "LillyAI: Clinical Intelligence Platform",
    summary:
      "Transforming an early AI healthcare tool into an enterprise clinical intelligence platform.",
    cardImage: {
      src: "/case-studies/lillyai/image-01.png",
      alt: "LillyAI clinical intelligence platform interface",
    },
    heroImage: {
      src: "/case-studies/lillyai/image-01.png",
      alt: "LillyAI clinical intelligence platform interface",
    },
    projectInfo: [
      { label: "Client", value: "ATR Enterprises" },
      { label: "Category", value: "Clinical intelligence and health technology assessment platform" },
      { label: "Services", value: "Product strategy, UX, AI architecture, and full-stack engineering" },
    ],
    sections: [
      {
        heading: "Overview",
        body: [
          "LillyAI began as an AI-assisted clinical report generator that collected evidence from selected medical sources.",
          "ATR Enterprises partnered with Mirai Studios to transform the MVP into a scalable Clinical Intelligence and Health Technology Assessment platform.",
          "Mirai restructured the product around the complete drug-evaluation workflow, including structured clinical intake, multi-source evidence retrieval, AI reasoning, citation validation, economic modelling and human clinical review.",
          "The platform is designed to help pharmaceutical analysts and healthcare stakeholders generate evidence-backed clinical reports, evaluate treatment economics and prepare outputs aligned with international HTA frameworks.",
        ],
      },
      {
        heading: "Key capabilities",
        body: [
          "Multi-source medical evidence ingestion, AI-powered clinical reasoning, citation validation and hallucination controls, HTA-compliant report generation, clinical dosage calculation, economic and budget-impact modelling, human-in-the-loop reviewer workflows, enterprise roles, security and audit trails, and automated report-to-presentation generation.",
        ],
      },
      {
        heading: "Outcome",
        body: [
          "Through product strategy, UX, AI architecture and full-stack engineering, Mirai helped establish the foundation required for LillyAI to evolve from an early MVP into a commercially scalable enterprise healthcare product.",
        ],
      },
    ],
    gallery: [
      { src: "/case-studies/lillyai/image-02.png", alt: "LillyAI product screenshot 2" },
      { src: "/case-studies/lillyai/image-03.png", alt: "LillyAI product screenshot 3" },
      { src: "/case-studies/lillyai/image-04.png", alt: "LillyAI product screenshot 4" },
      { src: "/case-studies/lillyai/image-05.png", alt: "LillyAI product screenshot 5" },
      { src: "/case-studies/lillyai/image-06.png", alt: "LillyAI product screenshot 6" },
      { src: "/case-studies/lillyai/image-07.png", alt: "LillyAI product screenshot 7" },
    ],
    testimonial: {
      quote:
        "Mirai Studios helped us transform LillyAI from an early AI reporting product into a structured enterprise platform. Their team brought clarity across product strategy, user experience, AI architecture and development, while working closely with us as a long-term technology partner.",
      attribution: "Riyan Amjad Siddiqi, Director, ATR Enterprises",
      logo: { name: "lilly AI", file: "lilly-ai.svg" },
    },
  },
  {
    slug: "cero",
    eyebrow: "AI-Powered Products",
    title: "Cero LinkedIn personal branding assistant",
    cardTitle: "Cero: LinkedIn Personal Branding Assistant",
    summary:
      "Building an AI-powered LinkedIn content platform that helps professionals create better content, faster.",
    cardImage: {
      src: "/case-studies/cero/image-01.png",
      alt: "Cero LinkedIn content creation assistant interface",
    },
    heroImage: {
      src: "/case-studies/cero/image-01.png",
      alt: "Cero LinkedIn content creation assistant interface",
    },
    websiteUrl: "https://usecero.com",
    demoUrl:
      "https://chromewebstore.google.com/detail/moeocagahkkomhnekdhlfjbmomkjoddj?utm_source=item-share-cb",
    demoLabel: "Get Chrome extension",
    videoUrl: "https://www.youtube.com/embed/rj6pgHdvsBM?si=3BUvl3A0f73RK1J8",
    projectInfo: [
      { label: "Website", value: "usecero.com" },
      { label: "Category", value: "AI-powered product" },
      { label: "Format", value: "Chrome extension and SaaS product" },
      { label: "Services", value: "Product strategy, UX design, AI architecture, and full-stack development" },
    ],
    sections: [
      {
        heading: "Overview",
        body: [
          "Cero was created to solve a common problem faced by founders, consultants and professionals: maintaining a consistent LinkedIn presence without spending hours planning, writing and formatting content.",
          "Mirai Studios led the product strategy, UX design, AI architecture and full-stack development of the platform, taking Cero from an initial concept to a functional SaaS product.",
          "The product was designed as a Chrome extension that integrates directly into LinkedIn, allowing users to create, improve and publish content without disrupting their existing workflow.",
        ],
      },
      {
        heading: "Key capabilities",
        body: [
          "AI-powered LinkedIn post generation, personalised tone and writing-style adaptation, content ideas based on user goals and industry, carousel content creation, image generation, grammar, formatting and readability improvements, keyword and content optimisation, and guided onboarding based on niche, tone and posting objectives.",
        ],
      },
      {
        heading: "Outcome",
        body: [
          "Beyond the initial product, Mirai also developed the technical foundation required to support future analytics, audience insights, team collaboration, content libraries and cross-platform publishing.",
          "Through product strategy, AI development and continuous iteration, Mirai transformed Cero from an idea into a scalable content creation product built around the real workflow of LinkedIn users.",
        ],
      },
    ],
    gallery: [
      { src: "/case-studies/cero/image-02.png", alt: "Cero product screenshot 2" },
      { src: "/case-studies/cero/image-03.png", alt: "Cero product screenshot 3" },
      { src: "/case-studies/cero/image-04.png", alt: "Cero product screenshot 4" },
      { src: "/case-studies/cero/image-05.png", alt: "Cero product screenshot 5" },
      { src: "/case-studies/cero/image-06.png", alt: "Cero product screenshot 6" },
    ],
    testimonial: {
      quote:
        "Mirai Studios helped turn Cero from an early product idea into a complete AI-powered platform. Their ability to combine product strategy, user experience and technical execution allowed us to move quickly while still building a strong foundation for future growth.",
      attribution: "Ali Ahmed, Head of Product at Cero",
      logo: { name: "Cero", file: "cero-testimonial.svg" },
    },
    cta: "Start a project like this",
    featured: true,
  },
  {
    slug: "mira-pulse",
    eyebrow: "Digital Twin Products",
    title: "MiraPulse hospital operations digital twin",
    cardTitle: "MiraPulse: Hospital Operations Digital Twin",
    summary:
      "Making hospital operations visible, coordinated and actionable through a spatial digital twin.",
    cardImage: {
      src: "/case-studies/mira-pulse/image-01.png",
      alt: "MiraPulse campus command view of Mirai Smart Hospital",
    },
    heroImage: {
      src: "/case-studies/mira-pulse/image-01.png",
      alt: "MiraPulse campus command view of Mirai Smart Hospital",
    },
    websiteUrl: "https://mirapulse.miraistudios.co",
    demoUrl: "https://mirapulse.miraistudios.co",
    demoLabel: "Try live demo",
    embedDemo: true,
    projectInfo: [
      { label: "Demo", value: "mirapulse.miraistudios.co" },
      { label: "Category", value: "Hospital operations digital twin" },
      { label: "Format", value: "Interactive concept demo" },
      {
        label: "Services",
        value: "Product strategy, UX/UI, real-time 3D interaction design, and full-stack engineering",
      },
    ],
    sections: [
      {
        heading: "Overview",
        body: [
          "MiraPulse is a Mirai Studios concept demo exploring how a hospital operations digital twin can combine a live 3D facility view with operational coordination and decision support.",
          "The experience brings departments, beds, equipment, staff, alerts, incoming patients, tasks and analytics into one connected environment. A command-centre interface provides hospital-wide visibility, while synchronized companion workflows support operational action from a tablet or mobile device.",
          "Users can inspect the hospital, locate resources, monitor capacity, respond to incoming ambulance events and run a guided emergency capacity-surge simulation. During the scenario, MiraPulse exposes readiness gaps, recommends actions, assigns accountable tasks and reflects operational changes directly inside the 3D environment.",
          "Designed for hospital leadership and operational teams, the concept demonstrates how a digital twin can move beyond passive visualization to support active coordination, resource readiness and explainable operational decisions.",
        ],
      },
      {
        heading: "Key capabilities",
        body: [
          "Interactive 3D hospital campus with operational perspectives, live operational health, capacity and attention indicators, bed, room, staff and equipment coordination workflows, locate-in-3D status overlays and spatial resource visibility, incoming patient and ambulance-readiness workflows, guided emergency capacity-surge simulation, task assignment with dependencies and execution tracking, synchronized command-centre and companion experience, and rule-based alerts, recommendations and operational analytics.",
        ],
      },
      {
        heading: "Outcome",
        body: [
          "Through product strategy, UX/UI, real-time 3D interaction design and full-stack engineering, Mirai Studios created MiraPulse as a working demonstration of how hospitals could visualize pressure, coordinate resources and translate operational decisions into visible action.",
        ],
      },
    ],
    gallery: [
      {
        src: "/case-studies/mira-pulse/image-02.png",
        alt: "Staff operations",
        caption: "Operational teams can inspect attendance, availability, workload and current assignments by department.",
      },
      {
        src: "/case-studies/mira-pulse/image-03.png",
        alt: "Equipment tracking",
        caption: "Tracked equipment can be searched, located in 3D and prepared for assignment or transfer.",
      },
      {
        src: "/case-studies/mira-pulse/image-04.png",
        alt: "Patient-flow perspective",
        caption: "Purpose-built perspectives help operations teams focus on the hospital layer relevant to the decision at hand.",
      },
      {
        src: "/case-studies/mira-pulse/image-05.png",
        alt: "Guided readiness response",
        caption: "A synchronized surge scenario exposes readiness gaps and guides teams through the next operational action.",
      },
      {
        src: "/case-studies/mira-pulse/image-06.png",
        alt: "Coordinated task execution",
        caption: "Recommendations become accountable tasks with owners, dependencies, progress and visible spatial outcomes.",
      },
      {
        src: "/case-studies/mira-pulse/image-07.png",
        alt: "Operational analytics",
        caption: "Deterministic analytics translate live capacity, equipment and alert data into explainable operational insights.",
      },
    ],
    cta: "Start a project like this",
    featured: true,
  },
  {
    slug: "enorta",
    eyebrow: "AI Platform",
    title: "Enorta: Storytelling Reimagined",
    cardTitle: "Enorta: Storytelling Reimagined",
    summary:
      "Turning a simple prompt into a polished, editable and on-brand presentation in seconds.",
    cardImage: {
      src: "/case-studies/enorta/image-01.png",
      alt: "Enorta case study visual",
    },
    heroImage: {
      src: "/case-studies/enorta/image-01.png",
      alt: "Enorta case study visual",
    },
    projectInfo: [
      { label: "Category", value: "AI-native presentation platform" },
      { label: "Audience", value: "Founders, marketers, and teams" },
      { label: "Services", value: "Product strategy, user experience, platform design, and development" },
    ],
    sections: [
      {
        heading: "Overview",
        body: [
          "Enorta is an AI-native presentation platform built for founders, marketers and teams who want to focus on refining their ideas rather than manually managing layouts, formatting and visual hierarchy.",
          "Mirai Studios worked across the complete product lifecycle, from early product strategy and user experience through to platform design and development.",
          "The core challenge was to avoid the traditional trade-off between speed and quality. Existing presentation tools were either fast but generic, or highly polished but time-consuming. Enorta needed to generate professionally designed presentations within seconds while still giving users meaningful control over the final output.",
          "Trust was equally important. AI-generated design decisions can often feel unpredictable, so the platform was designed to make every automated change understandable, editable and reversible.",
        ],
      },
      {
        heading: "Key capabilities",
        body: [
          "Prompt-to-presentation generation, AI-generated slide structures and layouts, automated visual hierarchy and formatting, on-brand presentation generation, fully editable slides, AI-assisted content and design refinement, transparent and reversible AI changes, rapid regeneration and iteration, and a structured design system for visual consistency.",
        ],
      },
      {
        heading: "Outcome",
        body: [
          "Mirai Studios worked in a continuous loop across product, design and engineering, treating the AI model, interface and design system as one connected experience.",
          "Rapid prototyping and user feedback helped determine the right balance between automation and control. The resulting platform allows users to generate a complete presentation from a single prompt and refine it through an experience that feels collaborative rather than restrictive.",
          "Enorta launched with strong early retention and established a clear position as a serious alternative for users who care about both the quality of their ideas and how those ideas are presented.",
        ],
      },
    ],
    gallery: [
      { src: "/case-studies/enorta/image-02.png", alt: "Enorta product screenshot 2" },
      { src: "/case-studies/enorta/image-03.png", alt: "Enorta product screenshot 3" },
      { src: "/case-studies/enorta/image-04.png", alt: "Enorta product screenshot 4" },
      { src: "/case-studies/enorta/image-05.png", alt: "Enorta product screenshot 5" },
      { src: "/case-studies/enorta/image-06.png", alt: "Enorta product screenshot 6" },
      { src: "/case-studies/enorta/image-07.png", alt: "Enorta product screenshot 7" },
    ],
    testimonial: {
      quote:
        "We worked with Mirai Studios across the entire Enorta product journey, from early product thinking and user experience through to the design and development of the platform. What we appreciated most was their ability to balance the technical complexity of the build with the simplicity we wanted for our users. The process felt collaborative throughout, and the team adapted well as the product evolved. They helped us transform the initial idea into a polished, working product and gave us a strong foundation to continue building on.",
      attribution: "Aneeq Duraiz, CEO, Enorta",
      logo: { name: "enorta", file: "enorta-testimonial.svg" },
    },
  },
  {
    slug: "thyssenkrupp",
    eyebrow: "Digital Twin",
    title: "thyssenkrupp",
    cardTitle: "thyssenkrupp: Interactive Digital Twin",
    summary:
      "Transforming a complex U.S. manufacturing facility into an interactive digital twin and stakeholder presentation experience.",
    cardImage: {
      src: "/case-studies/thyssenkrupp/image-01.png",
      alt: "thyssenkrupp digital twin case study visual",
    },
    heroImage: {
      src: "/case-studies/thyssenkrupp/image-01.png",
      alt: "thyssenkrupp digital twin case study visual",
    },
    projectInfo: [
      { label: "Category", value: "Interactive digital twin and stakeholder presentation experience" },
      { label: "Client", value: "thyssenkrupp" },
      { label: "Focus", value: "Manufacturing facility visualisation and executive communication" },
    ],
    sections: [
      {
        heading: "Overview",
        body: [
          "thyssenkrupp required a more effective way to visualise and communicate a major U.S. manufacturing initiative connected to its work with Tesla.",
          "Traditional blueprints, CAD files, dashboards and presentation decks could not provide stakeholders with a complete and consistent understanding of the facility, its production environment and the progress of the partnership.",
          "Mirai Studios led the graphical and experience development of the solution, creating an interactive digital twin of the thyssenkrupp U.S. plant and a unified visual system for presenting key partnership milestones to leadership and stakeholder audiences.",
          "The digital twin transformed the facility from a collection of disconnected technical documents into an accurate and navigable digital environment. Stakeholders could explore the plant spatially, understand its production areas and review complex information within the context of the complete facility.",
          "Alongside the digital twin, Mirai developed the graphical language, layouts and presentation experiences used to communicate progress, capabilities and major milestones associated with the Tesla partnership.",
        ],
      },
      {
        heading: "Key deliverables",
        body: [
          "A spatially accurate digital twin of the thyssenkrupp U.S. plant, interactive navigation across production areas and facility environments, graphical and experience design for the complete platform, a milestone presentation system for the Tesla partnership, executive-facing visual experiences for communicating progress and capabilities, and a unified design language connecting the facility, project information and presentation content.",
        ],
      },
      {
        heading: "Outcome",
        body: [
          "By combining digital twin development with experience and presentation design, Mirai helped thyssenkrupp communicate a highly complex manufacturing environment in a form that was easier to explore, understand and present.",
          "The result was a persistent visual asset that could support stakeholder alignment, executive communication and future presentations beyond a single project milestone.",
        ],
      },
    ],
    gallery: [
      { src: "/case-studies/thyssenkrupp/image-02.png", alt: "thyssenkrupp digital twin screenshot 2" },
      { src: "/case-studies/thyssenkrupp/image-03.png", alt: "thyssenkrupp digital twin screenshot 3" },
      { src: "/case-studies/thyssenkrupp/image-04.png", alt: "thyssenkrupp digital twin screenshot 4" },
      { src: "/case-studies/thyssenkrupp/image-05.png", alt: "thyssenkrupp digital twin screenshot 5" },
      { src: "/case-studies/thyssenkrupp/image-06.png", alt: "thyssenkrupp digital twin screenshot 6" },
      { src: "/case-studies/thyssenkrupp/image-07.png", alt: "thyssenkrupp digital twin screenshot 7" },
    ],
    testimonial: {
      quote:
        "Working with Mirai Studios changed the way we communicate what we built. They took something enormously complex, including an entire U.S. manufacturing plant and the milestones of our partnership with Tesla, and transformed it into an experience that people could clearly see and understand. When we walked leadership and partners through the digital twin, the work spoke for itself. Mirai did not simply visualise our plant; they gave us a more effective way to communicate its scale, capabilities and progress.",
      attribution: "Dezzeria Wright, Head of Marketing, thyssenkrupp",
      logo: { name: "thyssenkrupp", file: "thyssenkrupp.webp" },
    },
  },
  {
    slug: "storypage-ai",
    eyebrow: "AI Storybooks",
    title: "StoryPage.ai",
    cardTitle: "StoryPage.ai: Personalized AI Storybooks",
    summary:
      "Helping parents turn their child's imagination into a story they'll keep forever.",
    cardImage: {
      src: "/case-studies/storypage-ai/image-01.png",
      alt: "StoryPage.ai personalized storybook platform visual",
    },
    heroImage: {
      src: "/case-studies/storypage-ai/image-01.png",
      alt: "StoryPage.ai personalized storybook platform visual",
    },
    projectInfo: [
      { label: "Category", value: "AI-powered personalized storybook platform" },
      { label: "Technology", value: "GPT-4 Mini and fal.ai image models" },
      { label: "Services", value: "Product design, UX/UI, AI architecture, frontend and backend development, prompt engineering, infrastructure, authentication, payments, and publishing workflow" },
    ],
    sections: [
      {
        heading: "Overview",
        body: [
          "StoryPage.ai is an AI-powered platform that lets parents create fully personalized children's storybooks where their child becomes the hero of the adventure. By uploading a photo and sharing a few details about their child, parents can create a unique story that feels personal, memorable, and worth revisiting for years to come.",
          "The experience is designed to be simple from start to finish. Parents upload photos of their child and optionally friends or family members, provide details such as their name, personality, age, and a story idea, then choose an illustration style and book format. The platform transforms those inputs into consistent AI-generated avatars, writes an original 20-page story, illustrates every scene, and prepares the book for both digital viewing and professional printing.",
          "Rather than relying entirely on AI, StoryPage includes a human review process to ensure every book meets a high standard of quality. Administrators can refine the story, regenerate illustrations where needed, and approve the final version before it is delivered as a digital book or printed in either softcover or hardcover format.",
        ],
      },
      {
        heading: "Key capabilities",
        body: [
          "AI avatar generation from real photos, personalized stories built around each child, multiple illustration styles and book formats, consistent characters throughout every page, multi-stage AI workflow for story and illustration generation, human review and illustration refinement before publishing, print-ready PDF generation and digital storybooks, secure user accounts, payments, and order management, and a personal library for previously created storybooks.",
        ],
      },
      {
        heading: "Outcome",
        body: [
          "Built using GPT-4 Mini for story generation and fal.ai image models for illustration, the platform combines AI with a carefully orchestrated generation pipeline to produce high-quality, personalized books at scale. The project included product design, UX/UI, AI architecture, frontend and backend development, prompt engineering, infrastructure, authentication, payments, and the complete publishing workflow-from photo upload to a finished storybook delivered to the family's doorstep.",
        ],
      },
    ],
    gallery: [
      { src: "/case-studies/storypage-ai/image-02.png", alt: "StoryPage.ai product screenshot 2" },
      { src: "/case-studies/storypage-ai/image-03.png", alt: "StoryPage.ai product screenshot 3" },
      { src: "/case-studies/storypage-ai/image-04.png", alt: "StoryPage.ai product screenshot 4" },
      { src: "/case-studies/storypage-ai/image-05.png", alt: "StoryPage.ai product screenshot 5" },
      { src: "/case-studies/storypage-ai/image-06.png", alt: "StoryPage.ai product screenshot 6" },
    ],
    testimonial: {
      quote:
        "Mirai Studios understood that StoryPage.ai was not just about generating books, but about helping families create something personal and lasting. They turned that vision into a thoughtful, easy-to-use product that makes every story feel truly unique.",
      attribution: "Awab Rizwan, Product at StoryPage.ai",
      logo: { name: "StoryPage.ai", file: "storypage-ai.svg" },
    },
  },
  {
    slug: "mindful-legal-solutions",
    eyebrow: "Legal AI",
    title: "Mindful Legal Solutions",
    cardTitle: "Mindful Legal Solutions: AI Legal Assistance",
    summary:
      "Making everyday legal guidance and document creation more accessible through AI.",
    cardImage: {
      src: "/case-studies/mindful-legal-solutions/image-01.png",
      alt: "Mindful Legal Solutions AI legal assistance platform visual",
    },
    heroImage: {
      src: "/case-studies/mindful-legal-solutions/image-01.png",
      alt: "Mindful Legal Solutions AI legal assistance platform visual",
    },
    projectInfo: [
      { label: "Category", value: "AI-powered legal assistance platform" },
      { label: "Client", value: "Mindful Legal Solutions" },
      { label: "Focus", value: "Conversational legal guidance and document generation" },
    ],
    sections: [
      {
        heading: "Overview",
        body: [
          "Mindful Legal Solutions is an AI-powered legal assistance platform designed to help individuals and businesses understand legal matters, ask questions and generate commonly required legal documents through a simple conversational experience.",
          "Mirai Studios helped develop the platform around a central AI legal agent that turns complex legal processes into a more guided and accessible workflow. Users can create an account, describe their legal requirements in natural language and receive relevant guidance or case-specific documents without navigating complicated legal interfaces.",
          "The platform supports use cases such as lease contracts, partnership agreements, business proposals and divorce-related documentation, with generated forms and PDFs tailored to the information provided by the user.",
        ],
      },
      {
        heading: "Key capabilities",
        body: [
          "Conversational AI legal assistance, personalised responses based on the user's query, automated legal document and form generation, downloadable ready-to-use PDFs, support for contracts, agreements, leases and other common documents, secure user accounts and protected information, 24/7 access to legal guidance, and subscription-based access for individuals and businesses.",
        ],
      },
      {
        heading: "Outcome",
        body: [
          "Mirai's work focused on combining AI functionality with a straightforward product experience, allowing users to move from describing their situation to receiving guidance or a generated document within one connected journey.",
          "The result is a scalable legal technology platform that reduces the friction associated with everyday legal tasks while clearly positioning its AI guidance as informational support rather than a replacement for professional legal counsel in complex matters.",
        ],
      },
    ],
    gallery: [
      { src: "/case-studies/mindful-legal-solutions/image-02.png", alt: "Mindful Legal Solutions product screenshot 2" },
      { src: "/case-studies/mindful-legal-solutions/image-03.png", alt: "Mindful Legal Solutions product screenshot 3" },
    ],
    testimonial: {
      quote:
        "Mirai Studios helped us transform the idea behind Mindful Legal Solutions into a practical AI-powered platform. They understood how to simplify complex legal workflows and created an experience that allows users to ask questions, generate documents and access guidance without feeling overwhelmed by the process.",
      attribution: "[Client Name], [Title], Mindful Legal Solutions",
      logo: { name: "Mindful Legal Solutions", file: "mindful-legal-solutions.svg" },
    },
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function getFeaturedCaseStudies() {
  return CASE_STUDIES.filter((study) => study.featured);
}

export function getCaseStudyUrl(slug: string) {
  return `/work/${slug}`;
}

export function getCaseStudyAbsoluteUrl(slug: string) {
  return `${SITE.url}${getCaseStudyUrl(slug)}`;
}
