import { useEffect } from "react";
import { canonicalUrlForPath } from "./canonicalUrl";
import { SITE_NAME, buildFullTitle } from "./pageMeta";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function usePageMeta(
  title: string,
  description: string,
  noIndex = false,
) {
  useEffect(() => {
    const fullTitle = buildFullTitle(title);
    const canonicalUrl = canonicalUrlForPath(window.location.pathname);
    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    setCanonical(canonicalUrl);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "en_US");
    setMeta("property", "og:url", canonicalUrl);
    const ogImageUrl = `${SITE_URL}/og-image.jpg`;
    setMeta("property", "og:image", ogImageUrl);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta(
      "property",
      "og:image:alt",
      "Van Dyke Acquisitions — We own. We operate.",
    );
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImageUrl);
  }, [title, description, noIndex]);
}
