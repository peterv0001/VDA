import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;

function resolveSiteOrigin(isBuild: boolean): string {
  const siteUrl = process.env.SITE_URL?.trim();

  if (siteUrl) {
    let parsed: URL;
    try {
      parsed = new URL(
        siteUrl.includes("://") ? siteUrl : `https://${siteUrl}`,
      );
    } catch {
      throw new Error(
        `SITE_URL is set but is not a valid URL: "${siteUrl}". ` +
          `Set it to the site's public origin, e.g. https://www.example.com`,
      );
    }
    return parsed.origin;
  }

  const replitDomain = process.env.REPLIT_DOMAINS?.split(",")[0]?.trim();

  if (isBuild) {
    throw new Error(
      "SITE_URL is required for production builds. " +
        "Set SITE_URL to the site's stable public origin (e.g. https://www.example.com) " +
        "so that og:image, og:url, and canonical tags are not baked with an ephemeral preview hostname. " +
        (replitDomain
          ? `Found REPLIT_DOMAINS fallback (${replitDomain}) but it is not stable enough for a shippable build.`
          : "Neither SITE_URL nor REPLIT_DOMAINS is available."),
    );
  }

  if (replitDomain) {
    return `https://${replitDomain}`;
  }

  return "";
}

export default defineConfig(async ({ command }) => {
  const siteOrigin = resolveSiteOrigin(command === "build");
  const ogImageUrl = `${siteOrigin}${normalizedBase}og-image.jpg`;

  return {
    base: basePath,
    plugins: [
      react(),
      runtimeErrorOverlay(),
      {
        name: "inject-og-image-url",
        transformIndexHtml(html) {
          const homepageCanonical = `${siteOrigin}${normalizedBase}`;
          return html
            .replaceAll("__OG_IMAGE_URL__", ogImageUrl)
            .replaceAll("__CANONICAL_URL__", homepageCanonical);
        },
      },
      ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
        ? [
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer({
                root: path.resolve(import.meta.dirname, ".."),
              }),
            ),
            await import("@replit/vite-plugin-dev-banner").then((m) =>
              m.devBanner(),
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(
          import.meta.dirname,
          "..",
          "..",
          "attached_assets",
        ),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
      },
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
