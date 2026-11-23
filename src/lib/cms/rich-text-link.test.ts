import assert from "node:assert/strict";
import { test } from "node:test";
import { canOpenCmsHref, CMS_LINK_OPTIONS, normalizeCmsHref } from "./rich-text-link.ts";

test("CMS editor does not autolink typed or pasted plain text", () => {
  assert.equal(CMS_LINK_OPTIONS.autolink, false);
  assert.equal(CMS_LINK_OPTIONS.linkOnPaste, false);
  assert.equal(CMS_LINK_OPTIONS.openOnClick, false);
});

test("intentional link attributes stay conservative for SEO", () => {
  assert.equal(CMS_LINK_OPTIONS.HTMLAttributes.rel, "noopener noreferrer");
});

test("href helpers trim input and only open http(s), mailto, or site paths", () => {
  assert.equal(normalizeCmsHref("  /work/cero  "), "/work/cero");
  assert.equal(canOpenCmsHref("https://miraistudios.co"), true);
  assert.equal(canOpenCmsHref("/insights/example"), true);
  assert.equal(canOpenCmsHref("mailto:hello@miraistudios.co"), true);
  assert.equal(canOpenCmsHref("javascript:alert(1)"), false);
  assert.equal(canOpenCmsHref("StoryPage.ai"), false);
});
