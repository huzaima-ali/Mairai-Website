import { SERVICE_PAGES } from "@/lib/services";
import { REGION_PAGES } from "@/lib/regions";
import { CASE_STUDIES, getCaseStudyUrl } from "@/lib/case-studies";
import { LEGAL_DOCUMENTS } from "@/lib/legal";
import { absoluteUrl } from "@/lib/seo";

export type PageType =
  | "home"
  | "service"
  | "service-detail"
  | "industry"
  | "landing"
  | "region"
  | "region-detail"
  | "partners"
  | "insights"
  | "insight-article"
  | "careers"
  | "job"
  | "case-study"
  | "legal"
  | "other";

export type RegistryPage = {
  route: string;
  pageName: string;
  pageType: PageType;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage?: string;
  indexable: boolean;
};

const HOME: RegistryPage = {
  route: "/",
  pageName: "Homepage",
  pageType: "home",
  defaultTitle: "AI Development & Product Engineering Company",
  defaultDescription:
    "Mirai Studios designs and builds AI products, agents, platforms, digital twins and immersive experiences for businesses across the US, UK and Middle East.",
  indexable: true,
};

export function getStaticRegistryPages(): RegistryPage[] {
  const pages: RegistryPage[] = [
    HOME,
    {
      route: "/services",
      pageName: "Services",
      pageType: "service",
      defaultTitle: "AI & Technology Services",
      defaultDescription:
        "Explore Mirai Studios services spanning AI product development, agents, automation, custom software, digital twins, immersive experiences, product design and enterprise engineering.",
      indexable: true,
    },
    ...SERVICE_PAGES.map(
      (page): RegistryPage => ({
        route: page.path,
        pageName: page.title,
        pageType: "service-detail",
        defaultTitle: page.metaTitle.replace(/\s*\|\s*Mirai Studios$/, ""),
        defaultDescription: page.metaDescription,
        indexable: true,
      }),
    ),
    {
      route: "/regions",
      pageName: "Regions",
      pageType: "region",
      defaultTitle: "Regions — US, UK & Middle East",
      defaultDescription:
        "Mirai Studios partners with companies in the United States, United Kingdom and Middle East, with delivery from Pakistan.",
      indexable: true,
    },
    ...REGION_PAGES.map(
      (page): RegistryPage => ({
        route: page.path,
        pageName: page.title,
        pageType: "region-detail",
        defaultTitle: page.metaTitle.replace(/\s*\|\s*Mirai Studios$/, ""),
        defaultDescription: page.metaDescription,
        indexable: true,
      }),
    ),
    {
      route: "/partners",
      pageName: "Partners",
      pageType: "partners",
      defaultTitle: "Partner with Mirai Studios",
      defaultDescription:
        "Partner with Mirai Studios for AI product development, engineering delivery and technology collaboration.",
      indexable: true,
    },
    {
      route: "/insights",
      pageName: "Insights",
      pageType: "insights",
      defaultTitle: "Insights on AI Products, Agents & Digital Twins",
      defaultDescription:
        "Mirai Studios insights on AI product development, AI agents, automation, digital twins and delivery practices.",
      indexable: true,
    },
    {
      route: "/careers",
      pageName: "Careers",
      pageType: "careers",
      defaultTitle: "Careers at Mirai Studios",
      defaultDescription:
        "Explore careers at Mirai Studios. We hire product, design and engineering talent to build AI products, software platforms and digital twin experiences.",
      indexable: true,
    },
    ...CASE_STUDIES.map(
      (study): RegistryPage => ({
        route: getCaseStudyUrl(study.slug),
        pageName: study.cardTitle || study.title,
        pageType: "case-study",
        defaultTitle: study.title,
        defaultDescription: study.summary,
        defaultOgImage: study.cardImage?.src,
        indexable: true,
      }),
    ),
    ...LEGAL_DOCUMENTS.map(
      (doc): RegistryPage => ({
        route: doc.path,
        pageName: doc.title,
        pageType: "legal",
        defaultTitle: doc.title,
        defaultDescription: doc.description,
        indexable: true,
      }),
    ),
  ];

  return pages;
}

export function getRegistryPage(route: string) {
  return getStaticRegistryPages().find((page) => page.route === route);
}

export function canonicalForRoute(route: string) {
  return absoluteUrl(route);
}
