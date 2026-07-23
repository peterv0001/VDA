import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.join(__dirname, "dist", "public");

const { render, PAGE_META, buildFullTitle } = await import(
  "./dist/server/entry-server.js"
);

const template = readFileSync(path.join(distPublic, "index.html"), "utf-8");

const SITE_URL = "https://www.vdacq.com";

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Van Dyke Acquisitions",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  description:
    "Van Dyke Acquisitions is a family office deploying permanent capital in control positions across the consumer packaged goods industry. Established 2014.",
  foundingDate: "2014",
  sameAs: [],
};

const ROUTE_LABELS = {
  "/platform": "Platform",
  "/track-record": "Track Record",
  "/team": "Team",
  "/funding": "Get Funding",
  "/contact": "Contact",
};

function buildJsonLd(route, meta, fullTitle) {
  const canonicalUrl = route === "/" ? SITE_URL : `${SITE_URL}${route}`;
  const schemas = [];

  if (route === "/") {
    schemas.push(ORGANIZATION_SCHEMA);
  }

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonicalUrl,
    url: canonicalUrl,
    name: fullTitle,
    description: meta.description,
    isPartOf: { "@id": SITE_URL },
    inLanguage: "en-US",
  };

  if (route !== "/") {
    webPage.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Van Dyke Acquisitions",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: ROUTE_LABELS[route] || meta.title,
          item: canonicalUrl,
        },
      ],
    };
  }

  schemas.push(webPage);

  return schemas
    .map(
      (s) =>
        `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`,
    )
    .join("\n  ");
}

const escapeHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

for (const [route, meta] of Object.entries(PAGE_META)) {
  // The /404 entry is rendered as a dedicated 404.html, not as a directory index
  const renderPath = route === "/404" ? "/___not_found___" : route;
  const appHtml = render(renderPath);
  if (!appHtml || appHtml.length < 500) {
    throw new Error(
      `Prerender for ${route} produced suspiciously little HTML (${appHtml.length} chars)`,
    );
  }
  const fullTitle = escapeHtml(buildFullTitle(meta.title));
  const description = escapeHtml(meta.description);
  const jsonLd = buildJsonLd(route, meta, buildFullTitle(meta.title));
  const canonicalUrl = escapeHtml(route === "/" ? SITE_URL : `${SITE_URL}${route}`);

  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${fullTitle}</title>`)
    .replace(
      /(<meta name="description" content=")[^"]*(")/,
      `$1${description}$2`,
    )
    .replace(
      /(<meta property="og:title" content=")[^"]*(")/,
      `$1${fullTitle}$2`,
    )
    .replace(
      /(<meta property="og:description" content=")[^"]*(")/,
      `$1${description}$2`,
    )
    .replace(
      /(<meta property="og:url" content=")[^"]*(")/,
      `$1${canonicalUrl}$2`,
    )
    .replace(
      /(<link rel="canonical" href=")[^"]*(")/,
      `$1${canonicalUrl}$2`,
    )
    .replace(
      /(<meta name="twitter:title" content=")[^"]*(")/,
      `$1${fullTitle}$2`,
    )
    .replace(
      /(<meta name="twitter:description" content=")[^"]*(")/,
      `$1${description}$2`,
    )
    .replace("<!-- __JSONLD__ -->", jsonLd)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  if (html === template) {
    throw new Error(`Prerender injection failed for ${route}`);
  }

  let outFile;
  if (route === "/") {
    outFile = path.join(distPublic, "index.html");
  } else if (route === "/404") {
    outFile = path.join(distPublic, "404.html");
  } else {
    outFile = path.join(distPublic, route.replace(/^\//, ""), "index.html");
  }
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  console.log(`prerendered ${route} -> ${path.relative(__dirname, outFile)}`);
}
