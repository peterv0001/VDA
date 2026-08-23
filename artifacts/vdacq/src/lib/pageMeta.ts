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
      "Van Dyke Acquisitions acquires and operates CPG companies with permanent capital, majority or full ownership, and operating authority. Explore distressed and growth-stage acquisitions, operations help, workshops, and funding options.",
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
      "Growth financing through Cohort Capital and operational funding through LeaderShield Funding—companies owned by Van Dyke Acquisitions for businesses it does not acquire.",
  },
  "/velocity-os": {
    title: "Velocity OS & Operator's Daily Journal",
    description:
      "See how Velocity OS turns operating principles into daily actions, weekly decisions, and quarterly resets. Preview 20 pages of the Operator's Daily Journal and unlock the complete workbook.",
  },
  "/how-we-operate": {
    title: "How We Operate",
    description:
      "Explore Van Dyke Acquisitions' open Velocity Operating System library: the illustrated operating model, metrics and questions, decision rules, and checklists.",
  },
  "/how-we-operate/book": {
    title: "The Velocity Operating System",
    description:
      "Read the complete illustrated edition of The Velocity Operating System by Peter V. Griscom: lean discipline, power-law positioning, and AI as enterprise electricity.",
  },
  "/how-we-operate/metrics-and-questions": {
    title: "Velocity OS Metrics & Questions",
    description:
      "Read the 29-page Velocity OS Metrics & Questions companion: operating measures and questions for evidence-led execution.",
  },
  "/how-we-operate/rule-book": {
    title: "Velocity OS Rule Book",
    description:
      "Read the 11-page Velocity OS Rule Book: cited decision rules and governance standards for durable operating discipline.",
  },
  "/how-we-operate/checklist-book": {
    title: "Velocity OS Checklist Book",
    description:
      "Read the 41-page Velocity OS Checklist Book: execution and review checklists for repeatable operating practice.",
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
