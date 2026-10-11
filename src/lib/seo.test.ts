import assert from "node:assert/strict";
import { test } from "node:test";
import { HERO, HOME_ABOUT, SITE } from "./content.ts";
import { SERVICE_PAGES } from "./services.ts";
import { REGION_PAGES } from "./regions.ts";
import { editorialArticles } from "./cms/editorial-articles.ts";

test("homepage description matches preferred commercial summary", () => {
  assert.match(SITE.description, /AI products/);
  assert.match(SITE.description, /US, UK and Middle East/);
  assert.equal(SITE.description.includes("—"), false);
});

test("visible brand copy stays crawlable and avoids em dashes", () => {
  assert.match(SITE.positioning, /AI Product Studio/);
  assert.match(SITE.positioning, /AI-powered products/);
  assert.match(HERO.body, /AI product development/);
  assert.match(HERO.body, /SaaS platforms/);
  assert.match(HERO.body, /digital twins/);
  assert.equal(HERO.headline, "We make ambitious ideas real.");
  assert.equal(HOME_ABOUT.title, "What Mirai Studios builds");
  for (const text of [SITE.tagline, SITE.positioning, HERO.body, HERO.headline, HOME_ABOUT.kicker]) {
    assert.equal(text.includes("—"), false);
  }
});

test("service pages have unique H1s, metadata and FAQs", () => {
  const titles = SERVICE_PAGES.map((page) => page.metaTitle);
  const h1s = SERVICE_PAGES.map((page) => page.h1);
  assert.equal(new Set(titles).size, SERVICE_PAGES.length);
  assert.equal(new Set(h1s).size, SERVICE_PAGES.length);
  for (const page of SERVICE_PAGES) {
    assert.ok(page.metaDescription.length > 80);
    assert.ok((page.faqs?.length || 0) >= 2);
    assert.equal(page.h1.includes("|"), false);
  }
});

test("region pages do not invent office addresses", () => {
  const joined = REGION_PAGES.map((page) => JSON.stringify(page)).join(" ");
  assert.equal(/123 .*Street|suite 400|office at/i.test(joined), false);
  for (const page of REGION_PAGES) {
    assert.ok((page.faqs?.length || 0) >= 1);
  }
});

test("editorial insights include Super Intelligence briefing", () => {
  const slugs = editorialArticles().map((article) => article.slug);
  assert.ok(slugs.includes("what-super-intelligence-means-for-enterprise-software"));
  assert.ok(slugs.includes("ai-agents-vs-traditional-automation"));
  const si = editorialArticles().find(
    (article) => article.slug === "what-super-intelligence-means-for-enterprise-software",
  );
  assert.ok(si);
  assert.match(si.content, /do not claim to develop artificial superintelligence/);
  assert.match(si.content, /OpenAI/);
  assert.match(si.content, /DeepMind/);
});
