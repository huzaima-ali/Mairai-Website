import assert from "node:assert/strict";
import { test } from "node:test";
import { canonicalizeCmsRoute, cmsRouteAliases, regionalRouteFor } from "./regional-routes.ts";

test("regional CMS pages nest under the public region hub", () => {
  assert.equal(
    regionalRouteFor("/landing/ai-development-company-raleigh", "us"),
    "/regions/united-states/ai-development-company-raleigh",
  );
  assert.equal(
    regionalRouteFor("/landing/ai-product-development-london", "uk"),
    "/regions/united-kingdom/ai-product-development-london",
  );
  assert.equal(
    regionalRouteFor("/landing/ai-development-dubai", "mena"),
    "/regions/middle-east/ai-development-dubai",
  );
  assert.equal(
    regionalRouteFor("/services/ai-product-development", "uk"),
    "/regions/united-kingdom/ai-product-development",
  );
});

test("legacy /us /uk /mena CMS paths canonicalize onto region hubs", () => {
  assert.equal(
    canonicalizeCmsRoute("/us/landing/ai-development-company-raleigh"),
    "/regions/united-states/ai-development-company-raleigh",
  );
  assert.equal(
    canonicalizeCmsRoute("/uk/services/ai-product-development"),
    "/regions/united-kingdom/ai-product-development",
  );
  assert.equal(canonicalizeCmsRoute("/landing/global-page"), "/landing/global-page");
  assert.ok(
    cmsRouteAliases("/regions/united-states/ai-development-company-raleigh").includes(
      "/us/landing/ai-development-company-raleigh",
    ),
  );
});
