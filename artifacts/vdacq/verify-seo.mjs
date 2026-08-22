import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.join(__dirname, "dist", "public");

function resolveSiteOrigin() {
  const siteUrl = process.env.SITE_URL?.trim();
  if (!siteUrl) {
    throw new Error(
      "SEO verification requires SITE_URL to match the origin used by the production build.",
    );
  }

  return new URL(
    siteUrl.includes("://") ? siteUrl : `https://${siteUrl}`,
  ).origin;
}

const SITE_URL = resolveSiteOrigin();

function getPublicRouteFiles(directory, relativeDirectory = "") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDirectory, entry.name);
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getPublicRouteFiles(fullPath, relativePath);
    }

    if (entry.isFile() && entry.name === "index.html") {
      return [relativePath];
    }

    return [];
  });
}

function routeForFile(relativePath) {
  const routeDirectory = path.dirname(relativePath);
  return routeDirectory === "."
    ? "/"
    : `/${routeDirectory.split(path.sep).join("/")}/`;
}

function canonicalUrlForRoute(route) {
  return `${SITE_URL}${route}`;
}

function attributeValue(tag, attribute) {
  const match = tag.match(
    new RegExp(`\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`, "i"),
  );
  return match?.[2];
}

function fail(message) {
  throw new Error(`SEO verification failed: ${message}`);
}

const routeFiles = getPublicRouteFiles(distPublic);
if (routeFiles.length === 0) {
  fail("no prerendered public routes were found");
}

const canonicalUrls = new Set();

for (const relativePath of routeFiles) {
  const route = routeForFile(relativePath);
  const expectedUrl = canonicalUrlForRoute(route);
  const html = readFileSync(path.join(distPublic, relativePath), "utf8");

  const canonicalTags = [
    ...html.matchAll(/<link\b[^>]*\brel\s*=\s*(["'])canonical\1[^>]*>/gi),
  ];
  if (canonicalTags.length !== 1) {
    fail(
      `${route} has ${canonicalTags.length} canonical link tags; expected 1`,
    );
  }
  if (attributeValue(canonicalTags[0][0], "href") !== expectedUrl) {
    fail(`${route} canonical URL must be ${expectedUrl}`);
  }

  const ogUrlTags = [
    ...html.matchAll(/<meta\b[^>]*\bproperty\s*=\s*(["'])og:url\1[^>]*>/gi),
  ];
  if (ogUrlTags.length !== 1) {
    fail(`${route} has ${ogUrlTags.length} og:url meta tags; expected 1`);
  }
  if (attributeValue(ogUrlTags[0][0], "content") !== expectedUrl) {
    fail(`${route} og:url must be ${expectedUrl}`);
  }

  const robotsTags = [
    ...html.matchAll(/<meta\b[^>]*\bname\s*=\s*(["'])robots\1[^>]*>/gi),
  ];
  const robotsContent = robotsTags
    .map((tag) => attributeValue(tag[0], "content") ?? "")
    .join(",")
    .toLowerCase();
  if (!robotsContent.includes("noindex")) {
    canonicalUrls.add(expectedUrl);
  }
}

const sitemap = readFileSync(path.join(distPublic, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(
  (match) => match[1].trim(),
);
const sitemapUrlCounts = new Map();
for (const url of sitemapUrls) {
  sitemapUrlCounts.set(url, (sitemapUrlCounts.get(url) ?? 0) + 1);
}

if (sitemapUrls.length !== canonicalUrls.size) {
  fail(
    `sitemap has ${sitemapUrls.length} entries; expected ${canonicalUrls.size} public canonical URLs`,
  );
}
for (const canonicalUrl of canonicalUrls) {
  if (sitemapUrlCounts.get(canonicalUrl) !== 1) {
    fail(`sitemap must include ${canonicalUrl} exactly once`);
  }
}
for (const sitemapUrl of sitemapUrlCounts.keys()) {
  if (!canonicalUrls.has(sitemapUrl)) {
    fail(`sitemap contains a non-canonical or non-public URL: ${sitemapUrl}`);
  }
}

const robots = readFileSync(path.join(distPublic, "robots.txt"), "utf8");
const sitemapDirectives = [...robots.matchAll(/^sitemap:\s*(\S+)\s*$/gim)].map(
  (match) => match[1],
);
const expectedSitemapUrl = `${SITE_URL}/sitemap.xml`;
if (
  sitemapDirectives.length !== 1 ||
  sitemapDirectives[0] !== expectedSitemapUrl
) {
  fail(`robots.txt must contain exactly "Sitemap: ${expectedSitemapUrl}"`);
}

console.log(
  `SEO verification passed for ${canonicalUrls.size} public prerendered routes.`,
);
