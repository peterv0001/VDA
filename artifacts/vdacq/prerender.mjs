import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.join(__dirname, "dist", "public");

const { render, PAGE_META, buildFullTitle } = await import(
  "./dist/server/entry-server.js"
);

const template = readFileSync(path.join(distPublic, "index.html"), "utf-8");

const escapeHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

for (const [route, meta] of Object.entries(PAGE_META)) {
  const appHtml = render(route);
  if (!appHtml || appHtml.length < 500) {
    throw new Error(
      `Prerender for ${route} produced suspiciously little HTML (${appHtml.length} chars)`,
    );
  }
  const fullTitle = escapeHtml(buildFullTitle(meta.title));
  const description = escapeHtml(meta.description);

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
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  if (html === template) {
    throw new Error(`Prerender injection failed for ${route}`);
  }

  const outFile =
    route === "/"
      ? path.join(distPublic, "index.html")
      : path.join(distPublic, route.replace(/^\//, ""), "index.html");
  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  console.log(`prerendered ${route} -> ${path.relative(__dirname, outFile)}`);
}
