import { useEffect } from "react";

const SITE_NAME = "Van Dyke Acquisitions";

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

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const fullTitle =
      title === SITE_NAME
        ? "Van Dyke Acquisitions — CPG Family Office · Control Investor"
        : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:url", window.location.href);
    const ogImageUrl = `${window.location.origin}${import.meta.env.BASE_URL}og-image.jpg`;
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
  }, [title, description]);
}
