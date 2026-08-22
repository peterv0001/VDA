import { expect, test } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const workspaceRoot = process.cwd();
const artifactDir = path.join(workspaceRoot, "artifacts", "vdacq");
const distPublic = path.join(artifactDir, "dist", "public");

function runBuild(envOverrides: NodeJS.ProcessEnv) {
  return spawnSync(
    "pnpm",
    ["--filter", "@workspace/vdacq", "run", "build"],
    {
      cwd: workspaceRoot,
      env: {
        ...process.env,
        PORT: "5173",
        BASE_PATH: "/",
        ...envOverrides,
      },
      encoding: "utf8",
    },
  );
}

function findHtmlFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? findHtmlFiles(entryPath)
      : entry.name.endsWith(".html")
        ? [entryPath]
        : [];
  });
}

function readUniqueMetadata(html: string, pattern: RegExp, label: string) {
  const matches = [...html.matchAll(pattern)];
  expect(matches, `${label} should occur exactly once`).toHaveLength(1);
  return matches[0][1];
}

test.describe("Production metadata build", () => {
  test("rejects a preview hostname when SITE_URL is missing", () => {
    const env = {
      REPLIT_DOMAINS: "transient-preview.example.replit.dev",
      SITE_URL: undefined,
    };
    const result = runBuild(env);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).not.toBe(0);
    expect(output).toContain("SITE_URL is required for production builds");
  });

  test("uses SITE_URL for canonical and Open Graph URLs in every generated page", () => {
    const origin = "https://metadata.example.test";
    const result = runBuild({
      SITE_URL: `${origin}/ignored-path`,
      REPLIT_DOMAINS: "ignored-preview.example.replit.dev",
    });

    expect(
      result.status,
      `Build failed:\n${result.stdout}\n${result.stderr}`,
    ).toBe(0);

    const htmlFiles = findHtmlFiles(distPublic);
    expect(htmlFiles.length).toBeGreaterThan(0);

    for (const filePath of htmlFiles) {
      const relativePath = path.relative(distPublic, filePath);
      const route =
        relativePath === "index.html"
          ? ""
          : relativePath === "404.html"
            ? "/404"
            : `/${path.dirname(relativePath).split(path.sep).join("/")}`;
      const expectedPageUrl = `${origin}${route}/`;
      const html = readFileSync(filePath, "utf8");

      const canonical = readUniqueMetadata(
        html,
        /<link rel="canonical" href="([^"]+)"/gu,
        `${relativePath} canonical`,
      );
      const ogUrl = readUniqueMetadata(
        html,
        /<meta property="og:url" content="([^"]+)"/gu,
        `${relativePath} og:url`,
      );
      const ogImage = readUniqueMetadata(
        html,
        /<meta property="og:image" content="([^"]+)"/gu,
        `${relativePath} og:image`,
      );

      expect(canonical).toBe(expectedPageUrl);
      expect(ogUrl).toBe(expectedPageUrl);
      expect(ogImage).toBe(`${origin}/og-image.jpg`);
      expect(html).not.toContain("__CANONICAL_URL__");
      expect(html).not.toContain("__OG_IMAGE_URL__");
    }
  });

  test("keeps social image URLs on the verified origin after navigation", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .locator(".nav-links")
      .getByText("Platform", { exact: true })
      .click();
    await expect(page).toHaveURL(/\/platform$/);

    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://www.vdacq.com/og-image.jpg",
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      "https://www.vdacq.com/og-image.jpg",
    );
  });
});
