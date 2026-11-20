const LEGACY_REGION_HUBS = {
  us: "/regions/united-states",
  uk: "/regions/united-kingdom",
  mena: "/regions/middle-east",
} as const;

const LEGACY_CMS_KINDS = ["landing", "services", "industries", "regions"] as const;

function lastPathSegment(route: string) {
  return route.replace(/\/+$/, "").split("/").filter(Boolean).pop() || "";
}

function normalizePath(route: string) {
  const trimmed = route.trim();
  if (!trimmed || trimmed === "/") return "/";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+/g, "/").replace(/\/+$/, "") || "/";
}

/** Map leftover /us|/uk|/mena CMS paths onto the public region hubs. */
export function canonicalizeCmsRoute(route: string) {
  const normalized = normalizePath(route);
  const match = normalized.match(/^\/(us|uk|mena)\/(landing|services|industries|regions)\/([^/]+)$/);
  if (!match) return normalized;
  const hub = LEGACY_REGION_HUBS[match[1] as keyof typeof LEGACY_REGION_HUBS];
  return `${hub}/${match[3]}`;
}

export function cmsRouteAliases(route: string) {
  const canonical = canonicalizeCmsRoute(route);
  const aliases = new Set<string>([normalizePath(route), canonical]);
  const hubMatch = canonical.match(/^\/regions\/(united-states|united-kingdom|middle-east)\/([^/]+)$/);
  if (hubMatch) {
    const code =
      hubMatch[1] === "united-states" ? "us" : hubMatch[1] === "united-kingdom" ? "uk" : "mena";
    for (const kind of LEGACY_CMS_KINDS) {
      aliases.add(`/${code}/${kind}/${hubMatch[2]}`);
    }
  }
  return [...aliases];
}

export function regionHubPath(regionCode?: string | null, customPrefix?: string) {
  if (!regionCode || regionCode === "global") return null;
  if (regionCode === "custom") {
    const slug = customPrefix?.replace(/^\/+|\/+$/g, "") || "custom";
    return `/regions/${slug}`;
  }
  return LEGACY_REGION_HUBS[regionCode as keyof typeof LEGACY_REGION_HUBS] || null;
}

export function regionalRouteFor(baseRoute: string, regionCode: string, customSlug?: string) {
  const pageSlug = lastPathSegment(baseRoute);
  const hub = regionHubPath(regionCode, customSlug);
  if (!hub || !pageSlug) {
    const path = baseRoute.startsWith("/") ? baseRoute : `/${baseRoute}`;
    return normalizePath(path);
  }
  return normalizePath(`${hub}/${pageSlug}`);
}
