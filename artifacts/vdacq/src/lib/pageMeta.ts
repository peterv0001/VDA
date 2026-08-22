export const SITE_NAME = "Van Dyke Acquisitions";

export const DEFAULT_FULL_TITLE =
  "Van Dyke Acquisitions — CPG Family Office · Control Investor";

export function buildFullTitle(title: string): string {
  return title === SITE_NAME ? DEFAULT_FULL_TITLE : `${title} — ${SITE_NAME}`;
}

export interface PageMeta {
  title: string;
  description: string;
  noIndex?: boolean;
}

export const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: SITE_NAME,
    description:
      "Van Dyke Acquisitions is a family office deploying permanent capital in control positions across the consumer packaged goods industry. Established 2014.",
  },
  "/platform": {
    title: "Platform",
    description:
      "An operating platform built for control ownership in CPG: portfolio operations, brand growth, innovation, technology, and specialty lending capabilities.",
  },
  "/track-record": {
    title: "Track Record",
    description:
      "A decade of control acquisitions and exits across the consumer packaged goods industry — Van Dyke Acquisitions' portfolio and investment history since 2014.",
  },
  "/team": {
    title: "Team",
    description:
      "Meet the operators and investors behind Van Dyke Acquisitions — a leadership team built for hands-on control ownership in CPG.",
  },
  "/funding": {
    title: "Get Funding",
    description:
      "Growth and operational funding for CPG brands — access growth capital through Cohort Capital or operational financing through Lead Shield Funding.",
  },
  "/velocity-os": {
    title: "Velocity OS Operations Help",
    description:
      "Velocity OS helps owners and operators create clearer accountability, measurable execution, operating leverage, and disciplined growth.",
  },
  "/contact": {
    title: "Contact",
    description:
      "Get in touch with Van Dyke Acquisitions — acquisition opportunities, lending inquiries, and partnership discussions in the CPG space.",
  },
  "/admin": {
    title: "Owner Access",
    description: "Secure owner review portal for Van Dyke Acquisitions.",
    noIndex: true,
  },
  "/404": {
    title: "Page Not Found",
    description:
      "The page you are looking for does not exist. Van Dyke Acquisitions — permanent capital, control acquisitions, CPG exclusive.",
  },
};
