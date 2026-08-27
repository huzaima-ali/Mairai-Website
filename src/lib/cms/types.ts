export type ArticleStatus = "draft" | "published" | "unpublished";
export type JobStatus = "draft" | "published" | "closed" | "unpublished";
export type ApplicationType = "email" | "url" | "both";
export type CmsPageStatus = "draft" | "published" | "unpublished";
export type RegionCode = "us" | "uk" | "mena" | "custom" | "global";
export type CmsManagedPageType = "service-detail" | "industry" | "region-detail" | "landing";

export type PageSeoRow = {
  id: string;
  route: string;
  page_name: string;
  page_type: string;
  seo_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  noindex: boolean;
  nofollow?: boolean;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image_url?: string | null;
  twitter_card?: string | null;
  breadcrumb_label?: string | null;
  include_in_sitemap?: boolean;
  sitemap_priority?: number | null;
  canonical_override?: string | null;
  page_summary?: string | null;
  primary_topic?: string | null;
  industry?: string | null;
  region_served?: string | null;
  related_services?: string[];
  related_industries?: string[];
  related_case_studies?: string[];
  schema_area_served?: string | null;
  schema_service_name?: string | null;
  schema_types?: string[];
  advanced_schema_json?: string | null;
  region_code?: string | null;
  base_route?: string | null;
  status?: CmsPageStatus | "published";
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

export type CmsPageRow = {
  id: string;
  route: string;
  slug: string;
  base_route: string;
  region_code: string;
  region_label: string;
  page_name: string;
  page_type: string;
  status: CmsPageStatus;
  source_page_id: string | null;
  source_route: string | null;
  source_page_name: string | null;
  h1: string;
  intro: string;
  body_html: string;
  cta_heading: string | null;
  cta_copy: string | null;
  cta_label: string | null;
  cta_href: string | null;
  regional_proof: string;
  related_services: string[];
  related_industries: string[];
  related_case_studies: string[];
  primary_topic: string | null;
  industry: string | null;
  region_served: string | null;
  page_summary: string | null;
  seo_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_override: string | null;
  noindex: boolean;
  include_in_sitemap: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
};

export type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  category: string;
  tags: string[];
  author_name: string;
  status: ArticleStatus;
  published_at: string | null;
  scheduled_at?: string | null;
  created_at: string;
  updated_at: string;
  seo_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image_url?: string | null;
  canonical_override?: string | null;
  noindex: boolean;
  related_services?: string[];
  related_industries?: string[];
  related_articles?: string[];
  related_case_studies?: string[];
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
};

export type JobRow = {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  workplace_type: string;
  employment_type: string;
  summary: string;
  description: string;
  requirements: string;
  nice_to_have: string;
  application_type: ApplicationType;
  application_url: string | null;
  application_email: string | null;
  status: JobStatus;
  published_at: string | null;
  valid_through: string | null;
  created_at: string;
  updated_at: string;
  seo_title: string | null;
  meta_description: string | null;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
};

export type MediaAssetRow = {
  id: string;
  storage_path: string;
  public_url: string;
  file_name: string;
  mime_type: string;
  byte_size: number;
  alt_text: string;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
};

export type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export const REGION_VARIANT_OPTIONS = [
  { code: "us" as const, label: "United States", prefix: "/us", areaServed: "United States" },
  { code: "uk" as const, label: "United Kingdom", prefix: "/uk", areaServed: "United Kingdom" },
  { code: "mena" as const, label: "Middle East / MENA", prefix: "/mena", areaServed: "Middle East" },
  { code: "custom" as const, label: "Custom Region", prefix: "", areaServed: "" },
];

export const CMS_PAGE_TYPE_OPTIONS = [
  { value: "service-detail" as const, label: "Service", prefix: "/services", registryType: "service-detail" },
  { value: "industry" as const, label: "Industry", prefix: "/industries", registryType: "industry" },
  { value: "region-detail" as const, label: "Region", prefix: "/regions", registryType: "region-detail" },
  { value: "landing" as const, label: "Generic Landing Page", prefix: "/landing", registryType: "landing" },
];
