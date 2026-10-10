import type { ArticleRow } from "@/lib/cms/types";

type EditorialDraft = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  seoTitle: string;
  metaDescription: string;
  relatedServices: string[];
  relatedCaseStudies: string[];
  content: string;
};

function p(text: string) {
  return `<p>${text}</p>`;
}

function h2(text: string) {
  return `<h2>${text}</h2>`;
}

function ul(items: string[]) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

const SUPER_INTELLIGENCE: EditorialDraft = {
  slug: "what-super-intelligence-means-for-enterprise-software",
  title: "What Super Intelligence means for enterprise software",
  excerpt:
    "How Super Intelligence, AGI and ASI are defined in current research, why they are not products companies can buy today, and which applied AI systems businesses can actually build.",
  category: "Super Intelligence",
  publishedAt: "2026-10-10T12:00:00.000Z",
  seoTitle: "What Super Intelligence Means for Enterprise Software",
  metaDescription:
    "A practical briefing on Super Intelligence, AGI and ASI, and how enterprises should think about agentic AI, automation and human-supervised workflows today.",
  relatedServices: ["/services/ai-product-development", "/services/ai-agent-development"],
  relatedCaseStudies: ["lillyai", "cero"],
  content: [
    p("Super Intelligence, sometimes shortened to SI, has become a common phrase in product conversations. It is often used loosely, as if it were a feature list a vendor can ship. It is not."),
    p("This article separates three ideas that get mixed together: applied AI that enterprises can deploy now, artificial general intelligence (AGI), and artificial superintelligence (ASI). It then explains what Mirai Studios will and will not claim, and which system-design habits still matter as models become more capable."),
    h2("How the terms are used"),
    p("Applied AI is the work most companies actually buy. It includes products, agents and automation that support a defined job: drafting, retrieval, classification, routing, visualization or operator assistance. These systems use existing model APIs, tools and data. They fail in predictable ways and need product design, evaluation and oversight."),
    p("AGI is a research target, not a SKU. OpenAI has described AGI as AI systems that are generally smarter than humans, and in its 2023 note <a href=\"https://openai.com/index/planning-for-agi-and-beyond/\">Planning for AGI and beyond</a> treats AGI as a point on a longer continuum rather than a finished destination. Google DeepMind, in <a href=\"https://deepmind.google/blog/taking-a-responsible-path-to-agi/\">Taking a responsible path to AGI</a>, describes AGI as AI that is at least as capable as humans at most cognitive tasks."),
    p("ASI, or Superintelligence in Nick Bostrom’s widely cited sense, is an intellect much smarter than the best human brains in practically every field, including scientific creativity, general wisdom and social skills. A 2024 paper from Google DeepMind researchers, <a href=\"https://arxiv.org/abs/2311.02462\">Levels of AGI for Operationalizing Progress on the Path to AGI</a> (later presented at ICML 2024), places ASI at a superhuman general level and states that this level has not been achieved. A 2025 article in <em>AI and Ethics</em> likewise treats ASI as hypothetical."),
    p("When people say Super Intelligence or SI in a business meeting, they often mean one of three things: a marketing synonym for more capable models, a genuine AGI/ASI research discussion, or a desire for software that can run more of a workflow with less hand-holding. Only the third maps to commercial delivery, and even then it is agentic AI with constraints, not ASI."),
    h2("What enterprises can build today"),
    p("The useful systems are still narrow in job and broad in integration. They connect to documents, APIs and operator interfaces. They keep a person in the loop where the cost of a wrong action is high."),
    ul([
      "AI products that sit inside a real workflow, with UX that shows uncertainty and next actions.",
      "Agents that can use tools, with permissions, logging and review points.",
      "Intelligent automation for intake, classification, drafting and routing.",
      "Enterprise AI orchestration: connecting models, retrieval, business systems and audit trails.",
      "Human-supervised autonomous workflows, where some steps run automatically and others wait for approval.",
    ]),
    p("None of this requires a claim that the system is generally smarter than people. It requires a clear job, testable outputs and an honest interface."),
    h2("Limitations that do not disappear with bigger models"),
    p("Capability curves can rise while operational risk stays. Hallucinated citations, silent tool misuse, weak access control and missing evaluation are product failures, not model-size problems. OpenAI’s AGI note is explicit that more capable systems will need more caution, not less. DeepMind’s AGI safety writing groups risk into misuse, misalignment, accidents and structural effects. Those categories already apply to enterprise agents that can send emails, write to a CRM or change a record."),
    p("Mirai’s public work is in that applied layer. <a href=\"/work/lillyai\">LillyAI</a> is a clinical intelligence platform with evidence retrieval, citation controls and human review. <a href=\"/work/cero\">Cero</a> is an AI content product with a defined publishing job. Neither is Super Intelligence. Both are examples of AI-native software with a bounded purpose."),
    h2("How Mirai uses Super Intelligence language"),
    p("We use SI terminology as a forward-looking planning theme: design for evaluation, permissions and oversight so systems can take on more of a workflow as models improve. We do not claim to develop artificial superintelligence, proprietary frontier foundation models, or AGI."),
    p("If a team is exploring next-generation intelligent systems, the practical brief is still the same. What job should the software do? Which tools may it use? Where must a person approve? How will you know it failed? Those questions belong in <a href=\"/services/ai-product-development\">AI product development</a> and <a href=\"/services/ai-agent-development\">AI agent development</a>, not in a speculative landing page."),
    h2("Sources"),
    ul([
      "OpenAI, Planning for AGI and beyond, 2023. https://openai.com/index/planning-for-agi-and-beyond/",
      "Morris et al., Levels of AGI for Operationalizing Progress on the Path to AGI, arXiv 2311.02462, ICML 2024.",
      "Google DeepMind, Taking a responsible path to AGI. https://deepmind.google/blog/taking-a-responsible-path-to-agi/",
      "Bostrom’s Superintelligence definition as discussed in AI and Ethics (Springer), 2025.",
    ]),
  ].join(""),
};

const AGENTS_VS_AUTOMATION: EditorialDraft = {
  slug: "ai-agents-vs-traditional-automation",
  title: "AI agents vs traditional automation",
  excerpt:
    "When a script or workflow engine is enough, when an AI agent is the better tool, and how to keep tool-using software inside clear business boundaries.",
  category: "AI Agents",
  publishedAt: "2026-10-10T12:30:00.000Z",
  seoTitle: "AI Agents vs Traditional Automation",
  metaDescription:
    "Compare AI agents and traditional automation: jobs, tools, oversight, failure modes and when each approach is the right fit for enterprise workflows.",
  relatedServices: ["/services/ai-agent-development", "/services/ai-automation"],
  relatedCaseStudies: ["lillyai", "mindful-legal-solutions"],
  content: [
    p("Traditional automation is excellent at repeatable paths. If the inputs are structured and the steps rarely change, a workflow engine or integration script will beat an agent on cost, predictability and auditability."),
    p("An AI agent is useful when the job includes messy language, variable documents, or a need to choose among tools. The agent is not a smarter Zapier. It is software designed around a job, with permitted actions and a place for a person to step in."),
    h2("A practical distinction"),
    ul([
      "Automation follows a declared path. An agent interprets a goal and selects from allowed tools.",
      "Automation fails loudly when a field is missing. An agent can improvise, which is useful and dangerous.",
      "Automation is usually cheaper to operate at high volume. Agents cost more per step and need evaluation.",
    ]),
    h2("When automation is enough"),
    p("Use traditional automation for status syncing, notifications, form routing with known fields, and scheduled data movement. Adding a model in the middle of a stable path often creates new failure modes without changing the business outcome."),
    h2("When an agent is the better fit"),
    p("Use an agent when operators currently read unstructured material, decide among several systems, and produce a draft that a specialist then reviews. Legal intake, clinical evidence assembly and internal operations copilots are typical. See <a href=\"/services/ai-agent-development\">AI agent development</a> and <a href=\"/services/ai-automation\">AI automation</a> for how Mirai scopes those jobs."),
    h2("Oversight is part of the architecture"),
    p("If an agent can write to a system of record, it needs permissions, logs and a review queue. Human-in-the-loop is not a concession. It is how a business keeps agency without pretending the model has judgment. <a href=\"/work/lillyai\">LillyAI</a> and <a href=\"/work/mindful-legal-solutions\">Mindful Legal Solutions</a> are public examples of AI-assisted work with review, not open-ended autonomy."),
    p("If you are comparing the two approaches for a live workflow, start with the path that already exists. Automate the stable steps. Add an agent only where language or tool choice is the bottleneck."),
  ].join(""),
};

const AGENT_ARCHITECTURE: EditorialDraft = {
  slug: "enterprise-ai-agent-architecture-security-and-oversight",
  title: "Enterprise AI agent architecture, security and oversight",
  excerpt:
    "A working model for production agents: jobs, tools, permissions, logging, evaluation and the review points that keep autonomous steps inside policy.",
  category: "AI Agents",
  publishedAt: "2026-10-10T13:00:00.000Z",
  seoTitle: "Enterprise AI Agent Architecture, Security and Oversight",
  metaDescription:
    "How to design enterprise AI agents with tool permissions, audit trails, evaluation and human-supervised workflows rather than unbounded autonomy.",
  relatedServices: ["/services/ai-agent-development", "/services/enterprise-engineering"],
  relatedCaseStudies: ["lillyai"],
  content: [
    p("A production agent is an application, not a prompt. It needs a job description, a tool list, identity, logging and a way to stop. This article describes the architecture Mirai uses when agents sit near real business systems."),
    h2("Start with the job, then the tools"),
    p("Write the job in operator language: gather evidence, draft a report, route a ticket, enrich a record. Then list the tools the agent may call. Anything not on the list is out of scope. That is more important than model choice."),
    h2("Security and identity"),
    p("The agent should act as a first-class identity with least privilege. It should not inherit a shared admin token. Tool calls should be attributable to that identity so security and operations teams can see what happened. Authentication, roles and audit trails belong in <a href=\"/services/enterprise-engineering\">enterprise engineering</a>, not in a later hardening phase."),
    h2("Oversight patterns that hold up"),
    ul([
      "Read-only tools can often run automatically.",
      "Writes, messages and money movement should wait for approval unless the blast radius is tiny and tested.",
      "Uncertain outputs go to a review queue with the source context attached.",
      "Evaluation sets catch regressions when prompts, tools or models change.",
    ]),
    p("These are human-supervised autonomous workflows. Some steps run on their own. The system remains accountable."),
    h2("What this is not"),
    p("This is not Super Intelligence and it is not AGI. It is agentic AI with enterprise constraints. If a vendor cannot explain permissions, logs and review, the system is a demo regardless of the model behind it."),
    p("Mirai’s <a href=\"/work/lillyai\">LillyAI</a> work is a useful reference: multi-source retrieval, citation controls, reviewer workflows, roles and audit trails. That is the shape of an enterprise agent product, even when the interface is a report rather than a chat."),
  ].join(""),
};

const DIGITAL_TWINS: EditorialDraft = {
  slug: "ai-powered-digital-twins-in-real-estate-and-healthcare",
  title: "AI-powered digital twins in real estate and healthcare",
  excerpt:
    "When a spatial model is the right product, how AI can sit on top of it, and what Mirai has actually built in real estate visualization and hospital operations concepts.",
  category: "Digital Twins",
  publishedAt: "2026-10-10T13:30:00.000Z",
  seoTitle: "AI-Powered Digital Twins in Real Estate and Healthcare",
  metaDescription:
    "How digital twins support real estate sales and healthcare operations, where AI helps, and when a simpler software surface is the better product.",
  relatedServices: ["/services/digital-twin-development", "/services/immersive-experiences"],
  relatedCaseStudies: ["esteria", "mira-pulse"],
  content: [
    p("A digital twin is valuable when people need a shared spatial model of a place or system. It is the wrong starting point when the job is a form, a queue or a document with no meaningful layout in space."),
    h2("Real estate: explanation before spectacle"),
    p("In real estate, twins and interactive 3D are usually sales and planning tools. Buyers need to understand layout, finishes and options. <a href=\"/work/esteria\">Esteria</a> is Mirai’s public reference for interactive real estate visualization: a spatial experience designed so people can explore rather than watch a static render."),
    p("AI can sit next to that experience as guided explanation, option filtering or content generation. It should not replace the spatial model. If the model is slow or confusing, a language model will not save it."),
    h2("Healthcare: operations, not decoration"),
    p("<a href=\"/work/mira-pulse\">MiraPulse</a> is a hospital operations concept: departments, capacity, staff, equipment and alerts in one environment, with a command-centre view and companion workflows. The twin exists so operators can see status in context. Analytics and recommendations have to stay explainable. A black-box suggestion over a 3D campus is not an operations product."),
    h2("Where AI belongs"),
    ul([
      "Summarizing status across a facility.",
      "Routing attention to rooms, assets or queues that need a person.",
      "Helping non-specialists navigate a complex model.",
    ]),
    p("Where AI does not belong: inventing occupancy, hiding missing data, or implying clinical autonomy the system does not have."),
    h2("Choosing the surface"),
    p("Choose a twin when space is part of the decision. Choose a conventional application when it is not. Browser delivery is often enough for clients who need to share a link. Higher-fidelity engines are a later choice. Details live on <a href=\"/services/digital-twin-development\">digital twin development</a> and <a href=\"/services/immersive-experiences\">immersive experiences</a>."),
  ].join(""),
};

const DRAFTS: EditorialDraft[] = [SUPER_INTELLIGENCE, AGENTS_VS_AUTOMATION, AGENT_ARCHITECTURE, DIGITAL_TWINS];

export function editorialArticles(): ArticleRow[] {
  return DRAFTS.map((article) => {
    const now = article.publishedAt;
    return {
      id: `editorial-${article.slug}`,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featured_image_url: null,
      featured_image_alt: null,
      category: article.category,
      tags: [article.category],
      author_name: "Mirai Studios",
      status: "published",
      published_at: now,
      created_at: now,
      updated_at: now,
      seo_title: article.seoTitle,
      meta_description: article.metaDescription,
      og_title: article.seoTitle,
      og_description: article.metaDescription,
      og_image_url: null,
      canonical_override: null,
      noindex: false,
      related_services: article.relatedServices,
      related_case_studies: article.relatedCaseStudies,
      created_by: null,
      updated_by: null,
      deleted_at: null,
    } satisfies ArticleRow;
  });
}

export function getEditorialArticleBySlug(slug: string) {
  return editorialArticles().find((article) => article.slug === slug) || null;
}
