import { exclusiveHomepageFeatured, homepageFeatureFlags } from "./homepage-featured.ts";
import { editorialArticles } from "./editorial-articles.ts";
import { isCmsArticleId, mergeAdminArticles } from "./article-merge.ts";
import { jobDraftSchema } from "./job-fields.ts";
import {
  applicationEmailSubject,
  buildCareerApplicationEmail,
  CAREERS_INBOX,
  duplicateSubmissionKey,
  isAllowedCvFile,
  jobApplicationFieldsSchema,
  rememberApplicationAttempt,
  forgetApplicationAttempt,
  resetApplicationAttempts,
} from "../job-application.ts";
import assert from "node:assert/strict";
import { test } from "node:test";

test("admin insights list includes editorial articles missing from CMS", () => {
  const editorial = editorialArticles();
  const merged = mergeAdminArticles([], editorial);
  const slugs = merged.map((article) => article.slug);
  assert.ok(slugs.includes("what-super-intelligence-means-for-enterprise-software"));
  assert.ok(slugs.includes("ai-agents-vs-traditional-automation"));
  assert.ok(slugs.includes("enterprise-ai-agent-architecture-security-and-oversight"));
  assert.ok(slugs.includes("ai-powered-digital-twins-in-real-estate-and-healthcare"));
  assert.equal(merged.length, editorial.length);
});

test("admin insights list does not duplicate editorial slugs already in CMS", () => {
  const editorial = editorialArticles();
  const first = editorial[0];
  assert.ok(first);
  const cmsCopy = { ...first, id: "11111111-1111-4111-8111-111111111111" };
  const merged = mergeAdminArticles([cmsCopy], editorial);
  assert.equal(merged.filter((article) => article.slug === first.slug).length, 1);
  assert.equal(merged.find((article) => article.slug === first.slug)?.id, cmsCopy.id);
});

test("deleted CMS slugs are not reintroduced from editorial copy", () => {
  const editorial = editorialArticles();
  const first = editorial[0];
  assert.ok(first);
  const merged = mergeAdminArticles([], editorial, [first.slug]);
  assert.equal(merged.some((article) => article.slug === first.slug), false);
});

test("CMS article ids are UUIDs and editorial ids are not", () => {
  assert.equal(isCmsArticleId("11111111-1111-4111-8111-111111111111"), true);
  assert.equal(isCmsArticleId("editorial-what-super-intelligence-means-for-enterprise-software"), false);
});

test("switching homepage article removes the previous one", () => {
  const articles = [
    { id: "a", status: "published" },
    { id: "b", status: "published" },
  ];
  const afterA = exclusiveHomepageFeatured(null, "a", articles);
  assert.equal(afterA.featuredId, "a");
  const afterB = exclusiveHomepageFeatured(afterA.featuredId, "b", articles);
  assert.equal(afterB.featuredId, "b");
  const flags = homepageFeatureFlags(["a", "b"], afterB.featuredId);
  assert.equal(flags.a, false);
  assert.equal(flags.b, true);
});

test("admin homepage flags follow stored featured id after refresh", () => {
  const storedId = "b";
  const flags = homepageFeatureFlags(["a", "b", "c"], storedId);
  assert.deepEqual(flags, { a: false, b: true, c: false });
});

test("failed homepage update keeps previous featured article", () => {
  const articles = [{ id: "a", status: "published" }];
  const result = exclusiveHomepageFeatured("a", "missing", articles);
  assert.equal(result.featuredId, "a");
  assert.ok(result.error);
});

test("draft articles cannot be featured", () => {
  const result = exclusiveHomepageFeatured(null, "d", [{ id: "d", status: "draft" }]);
  assert.equal(result.featuredId, null);
  assert.ok(result.error);
});

test("create job form requires title and slug", () => {
  const missing = jobDraftSchema.safeParse({ title: "", slug: "" });
  assert.equal(missing.success, false);
  const ok = jobDraftSchema.safeParse({
    title: "Product Engineer",
    slug: "product-engineer",
    application_type: "email",
  });
  assert.equal(ok.success, true);
});

test("application email subject format", () => {
  assert.equal(
    applicationEmailSubject("Product Engineer", "Ada Lovelace"),
    "Job Application: Product Engineer - Ada Lovelace",
  );
});

test("career application payload recipient reply-to and metadata", () => {
  const email = buildCareerApplicationEmail({
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    jobTitle: "Product Engineer",
    jobId: "job-123",
    message: "I would like to join the product team at Mirai.",
    links: "https://linkedin.com/in/ada",
    cvFileName: "ada-cv.pdf",
  });
  assert.equal(email.to, CAREERS_INBOX);
  assert.equal(email.replyTo, "ada@example.com");
  assert.equal(email.subject, "Job Application: Product Engineer - Ada Lovelace");
  assert.match(email.text, /Job ID: job-123/);
  assert.match(email.text, /Applicant name: Ada Lovelace/);
  assert.match(email.text, /Applicant email: ada@example.com/);
  assert.match(email.html, /Product Engineer/);
});

test("career application field validation", () => {
  const missing = jobApplicationFieldsSchema.safeParse({
    fullName: "A",
    email: "not-an-email",
    message: "short",
    jobId: "",
    jobTitle: "",
  });
  assert.equal(missing.success, false);

  const ok = jobApplicationFieldsSchema.safeParse({
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    message: "I would like to join the product team at Mirai.",
    links: "https://github.com/ada",
    jobId: "job-123",
    jobTitle: "Product Engineer",
    honeypot: "",
    startedAt: Date.now(),
  });
  assert.equal(ok.success, true);
});

test("cv file type and size validation", () => {
  assert.equal(isAllowedCvFile({ name: "cv.pdf", type: "application/pdf", size: 1024 }).ok, true);
  assert.equal(isAllowedCvFile({ name: "cv.docx", type: "", size: 2048 }).ok, true);
  assert.equal(isAllowedCvFile({ name: "cv.png", type: "image/png", size: 1024 }).ok, false);
  assert.equal(isAllowedCvFile({ name: "cv.pdf", type: "application/pdf", size: 6 * 1024 * 1024 }).ok, false);
});

test("duplicate application submissions are blocked", () => {
  resetApplicationAttempts();
  const key = duplicateSubmissionKey({
    jobId: "job-123",
    email: "Ada@example.com",
    fullName: "Ada Lovelace",
  });
  assert.equal(rememberApplicationAttempt(key, 1_000).duplicate, false);
  assert.equal(rememberApplicationAttempt(key, 2_000).duplicate, true);
  assert.equal(rememberApplicationAttempt(key, 70_000).duplicate, false);
});

test("failed send can be retried", () => {
  resetApplicationAttempts();
  const key = duplicateSubmissionKey({
    jobId: "job-123",
    email: "ada@example.com",
    fullName: "Ada Lovelace",
  });
  assert.equal(rememberApplicationAttempt(key, 1_000).duplicate, false);
  forgetApplicationAttempt(key);
  assert.equal(rememberApplicationAttempt(key, 1_500).duplicate, false);
});
