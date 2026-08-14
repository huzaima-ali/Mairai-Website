import { SITE } from "@/lib/content";

/** Public company details for footer and legal pages. EIN must never appear here. */
export const COMPANY = {
  legalName: "Mirai Studios LLC",
  addressLine: "30 N Gould St, Ste N, Sheridan, WY 82801, United States",
  /** Official email already used across the site (`SITE.email`). */
  email: SITE.email,
} as const;

export const LEGAL_LAST_UPDATED = "August 15, 2026";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  /** Optional bullet-style lines under the paragraphs. */
  bullets?: string[];
};

export type LegalDocument = {
  slug: "terms" | "privacy-policy" | "refund-policy";
  title: string;
  description: string;
  path: string;
  intro: string[];
  sections: LegalSection[];
};

/**
 * Public-facing legal copy from Mirai_Studios_Website_Legal_Content.docx.
 * Internal notes, drafting references, and EIN are intentionally omitted.
 * Contact emails use the site's confirmed official address (`SITE.email`).
 */
export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: "terms",
    title: "Terms & Conditions",
    description: "Terms governing use of the Mirai Studios website and related information.",
    path: "/terms",
    intro: [
      "Welcome to Mirai Studios. These Terms & Conditions govern your use of the Mirai Studios website and the information, materials, and services made available through it. By using this website, you agree to these Terms & Conditions. If you do not agree, please do not use the website.",
    ],
    sections: [
      {
        heading: "1. About Mirai Studios",
        paragraphs: [
          "Mirai Studios LLC is a technology and digital product development company providing services that may include software development, artificial intelligence solutions, automation, product strategy, UI/UX design, web and mobile development, immersive technologies, real-time 3D experiences, digital twins, and related consulting services.",
        ],
      },
      {
        heading: "2. Website Use",
        paragraphs: [
          "You may use this website only for lawful purposes, including learning about Mirai Studios, reviewing our work, contacting us, and exploring potential service engagements.",
          "You must not attempt to gain unauthorized access to the website or related systems, interfere with website operation, introduce malicious code, misuse forms or communications, scrape or reproduce protected content unlawfully, or use the website in a manner that violates applicable law.",
        ],
      },
      {
        heading: "3. Website Information Is Not a Binding Service Offer",
        paragraphs: [
          "Content on this website is provided for general informational and marketing purposes. Descriptions of services, capabilities, processes, timelines, case studies, or indicative outcomes do not create a binding obligation to provide any specific service.",
          "A binding engagement begins only when Mirai Studios and the client enter into an applicable written proposal, quotation, Statement of Work, Master Services Agreement, contract, purchase order accepted by Mirai Studios, or other written agreement.",
        ],
      },
      {
        heading: "4. Client Service Agreements Take Priority",
        paragraphs: [
          "Specific client projects may be governed by a separate proposal, Statement of Work, Master Services Agreement, contract, or other written agreement. If a project-specific agreement conflicts with these website Terms & Conditions, the project-specific agreement will control for that engagement.",
        ],
      },
      {
        heading: "5. Pricing, Payments, and Project Start",
        paragraphs: [
          "Project pricing, deposits, payment schedules, milestones, deliverables, timelines, revision limits, acceptance criteria, and other commercial terms are defined in the applicable project agreement.",
          "Unless otherwise agreed in writing, Mirai Studios may require an initial payment or deposit before reserving resources or commencing work.",
        ],
      },
      {
        heading: "6. Project Timelines and Client Dependencies",
        paragraphs: [
          "Any project timeline is based on the agreed scope and assumptions at the time it is provided. Timelines may change where there are scope changes, delayed approvals, delayed feedback, missing content or access, dependency on third-party services, or other circumstances outside Mirai Studios' reasonable control.",
          "Clients are responsible for providing information, access, feedback, approvals, and materials reasonably required for delivery of their project.",
        ],
      },
      {
        heading: "7. Intellectual Property",
        paragraphs: [
          "Ownership and licensing of project deliverables, source code, designs, assets, documentation, and other project materials are governed by the applicable project agreement.",
          "Unless expressly transferred in writing, Mirai Studios retains ownership of its pre-existing intellectual property, know-how, internal tools, reusable methods, frameworks, libraries, templates, workflows, concepts, and components developed independently of a client-specific engagement.",
        ],
      },
      {
        heading: "8. Website Content and Branding",
        paragraphs: [
          "Unless otherwise stated, the Mirai Studios name, website text, visual identity, graphics, layouts, original case-study materials, and other proprietary website content are owned by or licensed to Mirai Studios LLC.",
          "You may not reproduce, distribute, modify, republish, commercially exploit, or create derivative works from protected website content without permission, except where applicable law permits otherwise.",
        ],
      },
      {
        heading: "9. Third-Party Services and Links",
        paragraphs: [
          "The website and Mirai Studios projects may reference or depend on third-party websites, cloud providers, APIs, AI services, libraries, hosting providers, payment processors, analytics tools, or other external services.",
          "Mirai Studios does not control independent third-party services and is not responsible for their availability, security, policies, pricing, performance, content, or changes. Use of third-party services may also be subject to their own terms and policies.",
        ],
      },
      {
        heading: "10. No Guarantee of Business Outcomes",
        paragraphs: [
          "Mirai Studios provides technology, product, design, consulting, and development services based on agreed project scope. Unless a specific result is expressly guaranteed in a signed written agreement, Mirai Studios does not guarantee revenue, sales, investment, user adoption, rankings, market performance, cost savings, or any other particular commercial outcome.",
        ],
      },
      {
        heading: "11. Disclaimers",
        paragraphs: [
          'To the maximum extent permitted by applicable law, this website is provided on an "as available" basis. Mirai Studios does not warrant that the website will always be uninterrupted, error-free, secure, or free from harmful components.',
          "Nothing on the website constitutes legal, tax, financial, medical, or other regulated professional advice.",
        ],
      },
      {
        heading: "12. Limitation of Liability",
        paragraphs: [
          "To the maximum extent permitted by applicable law, Mirai Studios LLC will not be liable for indirect, incidental, special, exemplary, punitive, or consequential damages arising from or related to use of this website.",
          "Liability relating to paid client services is additionally governed by the liability provisions of the applicable project agreement.",
        ],
      },
      {
        heading: "13. Refunds and Cancellations",
        paragraphs: [
          "Payments, deposits, cancellations, and refunds are governed by the Mirai Studios Refund Policy and, where applicable, the relevant project agreement. If the project agreement contains different cancellation or refund terms, the project agreement will control.",
        ],
      },
      {
        heading: "14. Privacy",
        paragraphs: [
          "Use of personal information collected through this website is described in the Mirai Studios Privacy Policy.",
        ],
      },
      {
        heading: "15. Governing Law",
        paragraphs: [
          "These website Terms & Conditions are governed by the laws of the State of Wyoming, United States, without regard to conflict-of-law principles, except to the extent that mandatory law in another jurisdiction applies.",
        ],
      },
      {
        heading: "16. Changes to These Terms",
        paragraphs: [
          "Mirai Studios may update these Terms & Conditions from time to time. The updated version becomes effective when it is published on the website, unless a later effective date is stated.",
        ],
      },
      {
        heading: "17. Severability",
        paragraphs: [
          "If any provision of these Terms & Conditions is held to be invalid or unenforceable, the remaining provisions will continue in effect to the extent permitted by law.",
        ],
      },
      {
        heading: "18. Contact",
        paragraphs: [
          `Questions about these Terms & Conditions may be sent to ${COMPANY.email} or addressed to Mirai Studios LLC, 30 N Gould St, Ste N, Sheridan, WY 82801, United States.`,
        ],
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    description: "How Mirai Studios handles deposits, cancellations, and refund reviews for professional services.",
    path: "/refund-policy",
    intro: [
      "Mirai Studios LLC provides custom software development, artificial intelligence, product design, consulting, immersive technology, and other professional services. Because our work is customized and may involve reserved personnel, planning, research, design, development, infrastructure, and third-party costs, refunds are handled differently from traditional retail purchases.",
    ],
    sections: [
      {
        heading: "1. Scope of This Policy",
        paragraphs: [
          "This Refund Policy applies to payments made directly to Mirai Studios LLC for professional services unless a project-specific proposal, Statement of Work, Master Services Agreement, contract, or other written agreement contains different refund or cancellation terms.",
          "Where a project-specific agreement exists, that agreement takes priority.",
        ],
      },
      {
        heading: "2. Deposits and Initial Payments",
        paragraphs: [
          "Deposits and initial payments may become non-refundable once Mirai Studios has commenced work, reserved project capacity, allocated personnel, or incurred costs for the engagement.",
          "Commencement of work may include discovery, research, planning, workshops, technical architecture, UI/UX design, development, project management, environment setup, meetings, or other project-related activities.",
        ],
      },
      {
        heading: "3. Work Already Performed",
        paragraphs: [
          "Fees attributable to work already performed, completed or accepted milestones, approved deliverables, or resources already committed to the project are non-refundable to the extent permitted by applicable law.",
        ],
      },
      {
        heading: "4. Client Cancellation",
        paragraphs: [
          `A client wishing to cancel an active engagement should provide written notice using the contact method specified in the project agreement or by emailing ${COMPANY.email}.`,
          "Following cancellation, Mirai Studios may determine the value of work performed and costs committed up to the effective cancellation date. Any refundable amount, if applicable, will be calculated after accounting for completed work, work in progress, committed personnel or capacity, non-cancellable obligations, and third-party costs incurred for the project.",
        ],
      },
      {
        heading: "5. Third-Party and Pass-Through Costs",
        paragraphs: [
          "Amounts already paid or committed for third-party software, cloud infrastructure, hosting, APIs, licences, contractors, purchased assets, transaction fees, or other external services are generally non-refundable once incurred, unless Mirai Studios receives the corresponding refund from the third party or applicable law requires otherwise.",
        ],
      },
      {
        heading: "6. Completed or Approved Work",
        paragraphs: [
          "Refunds will not normally be provided for completed or approved work solely because the client later changes its preferences, business strategy, intended use, or requirements.",
          "Changes requested after approval or outside the agreed scope may instead be handled through revisions, a change request, or a new Statement of Work.",
        ],
      },
      {
        heading: "7. Client Delays or Failure to Provide Inputs",
        paragraphs: [
          "A project is not automatically eligible for a refund because delivery is delayed by missing client information, access, content, feedback, approvals, decisions, or other client-side dependencies.",
        ],
      },
      {
        heading: "8. Cancellation by Mirai Studios",
        paragraphs: [
          "If Mirai Studios terminates an engagement without client breach and has received payment for services that have not been performed or committed, Mirai Studios will review the unearned portion and refund any amount that should reasonably be returned, subject to the applicable project agreement and law.",
        ],
      },
      {
        heading: "9. Refund Review",
        paragraphs: [
          "Refund requests are assessed against the applicable agreement, project status, work performed, resource commitments, and costs incurred. Approval is not automatic.",
          "If a refund is approved, the amount and processing method will be communicated in writing. Processing time may vary depending on the original payment method and financial institutions involved.",
        ],
      },
      {
        heading: "10. How to Request a Cancellation or Refund Review",
        paragraphs: [
          `Send the request to ${COMPANY.email} and include the client name, project name, relevant invoice or agreement, and a short explanation of the request.`,
        ],
      },
      {
        heading: "11. Contact",
        paragraphs: [
          `Mirai Studios LLC, 30 N Gould St, Ste N, Sheridan, WY 82801, United States. Email: ${COMPANY.email}.`,
        ],
      },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "How Mirai Studios collects, uses, and protects personal information through the website.",
    path: "/privacy-policy",
    intro: [
      "Mirai Studios LLC respects the privacy of visitors, prospective clients, clients, partners, and other individuals who interact with our website. This Privacy Policy explains what personal information we may collect through the Mirai Studios website, how we use it, when we may share it, and the choices that may be available to you.",
    ],
    sections: [
      {
        heading: "1. Who We Are",
        paragraphs: [
          `Mirai Studios LLC is a technology and digital product development company. For questions about this Privacy Policy or personal information handled through the website, contact ${COMPANY.email}.`,
        ],
      },
      {
        heading: "2. Information You Provide to Us",
        paragraphs: [
          "We may collect information that you choose to provide when you contact us, submit a website form, request information, discuss a project, or otherwise communicate with us.",
        ],
        bullets: [
          "Name and contact details, such as email address and phone number.",
          "Company name, role, and business information.",
          "Project requirements, budgets, timelines, messages, and other information submitted through inquiry or contact forms.",
          "Files, attachments, or other materials you voluntarily send to us.",
          "Communication records and information necessary to respond to or manage an inquiry or engagement.",
        ],
      },
      {
        heading: "3. Information Collected Automatically",
        paragraphs: [
          "When you visit the website, certain technical information may be collected automatically by the website, hosting infrastructure, security systems, or analytics tools that are enabled on the site.",
        ],
        bullets: [
          "IP address and approximate location derived from it.",
          "Browser, device, operating system, and language information.",
          "Pages viewed, referring pages, timestamps, interactions, and general usage information.",
          "Cookie, session, or similar technical identifiers where such technologies are used.",
        ],
      },
      {
        heading: "4. Cookies and Similar Technologies",
        paragraphs: [
          "The website may use cookies or similar technologies for functions such as essential site operation, security, preferences, performance measurement, and analytics.",
          "Where required by applicable law, we will request consent or provide relevant choices before using non-essential cookies. Browser settings may also allow you to block or delete cookies, although doing so may affect some website functionality.",
        ],
      },
      {
        heading: "5. How We Use Personal Information",
        paragraphs: ["We may use personal information for the following purposes:"],
        bullets: [
          "Responding to inquiries and communicating with prospective clients, clients, partners, and website visitors.",
          "Preparing proposals, arranging calls, evaluating project requirements, and providing requested services.",
          "Operating, maintaining, improving, securing, and troubleshooting the website.",
          "Understanding website usage and improving our content, services, and user experience.",
          "Protecting against fraud, abuse, security threats, or unlawful activity.",
          "Maintaining business records and complying with legal, regulatory, contractual, tax, accounting, or dispute-resolution obligations.",
          "Sending business communications where permitted by law and consistent with the context in which you provided your information.",
        ],
      },
      {
        heading: "6. Legal Bases Where Required",
        paragraphs: [
          "Where applicable privacy law requires a legal basis for processing, Mirai Studios may rely on consent, performance of a contract or steps requested before entering a contract, compliance with legal obligations, or legitimate business interests that are not overridden by your rights.",
        ],
      },
      {
        heading: "7. How We Share Information",
        paragraphs: [
          "We may share personal information only as reasonably necessary for legitimate business purposes, including with:",
        ],
        bullets: [
          "Service providers that support website hosting, cloud infrastructure, analytics, communications, security, customer management, or other business operations.",
          "Professional advisers such as lawyers, accountants, auditors, insurers, or consultants where appropriate.",
          "Authorities, courts, regulators, or other parties where disclosure is required by law, legal process, or reasonably necessary to protect rights, safety, or security.",
          "A purchaser, investor, successor, or other relevant party in connection with a merger, acquisition, financing, restructuring, sale of assets, or similar business transaction, subject to appropriate safeguards where required.",
          "Other parties where you instruct us to share the information or provide consent.",
        ],
      },
      {
        heading: "8. Sale of Personal Information",
        paragraphs: [
          "Mirai Studios does not sell personal information for monetary consideration as part of its business model.",
        ],
      },
      {
        heading: "9. International Processing",
        paragraphs: [
          "Mirai Studios and the service providers we use may process information in the United States and other countries. Where applicable law requires safeguards for international transfers, we will use appropriate measures or rely on permitted transfer mechanisms.",
        ],
      },
      {
        heading: "10. Data Retention",
        paragraphs: [
          "We retain personal information only for as long as reasonably necessary for the purposes described in this Policy, including to manage inquiries and client relationships, maintain business and legal records, resolve disputes, enforce agreements, and meet legal obligations.",
          "Retention periods may vary depending on the type of information, the relationship involved, and applicable legal or contractual requirements.",
        ],
      },
      {
        heading: "11. Data Security",
        paragraphs: [
          "We use reasonable administrative, technical, and organizational measures designed to protect personal information against unauthorized access, misuse, alteration, loss, or disclosure. No website, transmission method, or storage system can be guaranteed to be completely secure.",
        ],
      },
      {
        heading: "12. Your Privacy Rights",
        paragraphs: [
          "Depending on where you live and the laws that apply, you may have rights relating to your personal information, such as requesting access, correction, deletion, restriction, portability, withdrawal of consent, or objection to certain processing.",
          `These rights are not absolute and may be subject to legal exceptions. To make a privacy request, email ${COMPANY.email}. We may need to verify your identity before completing a request.`,
        ],
      },
      {
        heading: "13. Marketing Communications",
        paragraphs: [
          "Where we send marketing communications, you may opt out by using the unsubscribe method included in the communication or by contacting us. Service-related, project-related, or legally required communications may still be sent where appropriate.",
        ],
      },
      {
        heading: "14. Children's Privacy",
        paragraphs: [
          "The Mirai Studios website is intended for business and general audiences and is not directed to children under 13. We do not knowingly collect personal information online from children under 13 through the website. If you believe a child has provided personal information to us, contact us so we can review and take appropriate action.",
        ],
      },
      {
        heading: "15. Third-Party Websites",
        paragraphs: [
          "The website may contain links to third-party websites or services. Their privacy practices are governed by their own policies, and Mirai Studios is not responsible for how independent third parties collect or use information.",
        ],
      },
      {
        heading: "16. Changes to This Privacy Policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time to reflect changes in our website, services, technology, or legal requirements. The updated version becomes effective when published unless another effective date is stated.",
        ],
      },
      {
        heading: "17. Contact Us",
        paragraphs: [
          `For privacy questions or requests, contact: Mirai Studios LLC, 30 N Gould St, Ste N, Sheridan, WY 82801, United States. Email: ${COMPANY.email}.`,
        ],
      },
    ],
  },
];

export function getLegalDocument(slug: LegalDocument["slug"]) {
  return LEGAL_DOCUMENTS.find((doc) => doc.slug === slug);
}

export const LEGAL_NAV_LINKS = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
] as const;
