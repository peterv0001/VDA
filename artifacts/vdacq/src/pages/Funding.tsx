import { useReveal } from "../lib/useReveal";
import { usePageMeta } from "../lib/usePageMeta";
import { PAGE_META } from "../lib/pageMeta";

const options = [
  {
    label: "Growth Capital",
    name: "Get Growth Funding",
    company: "Cohort Capital",
    href: "https://cohortfunding.com",
    display: "cohortfunding.com",
    desc: "For scaling CPG brands with proven traction. Cohort Capital structures growth financing to fund inventory, retail expansion, and revenue acceleration \u2014 without giving up control before you're ready.",
    points: [
      "Growth financing for brands ready to scale",
      "Inventory, retail expansion & marketing capital",
      "Founder-aligned structures",
    ],
  },
  {
    label: "Operational Capital",
    name: "Get Operational Funding",
    company: "LeaderShield Funding",
    href: "https://leadershieldfunding.com",
    display: "leadershieldfunding.com",
    desc: "For operators who need working capital now. LeaderShield Funding provides operational financing to bridge cash-flow gaps, cover payroll and production runs, and keep the business moving.",
    points: [
      "Working capital & cash-flow solutions",
      "Bridge financing for production & payroll",
      "Fast, operator-focused underwriting",
    ],
  },
];

export default function FundingPage() {
  usePageMeta(PAGE_META["/funding"].title, PAGE_META["/funding"].description);
  useReveal();
  return (
    <>
      <div className="page-head" />
      <section className="funding" id="funding">
        <div className="s-in">
          <div className="rv">
            <div className="eyebrow light">Get Funding</div>
            <h1 className="s-h" style={{ color: "var(--cream)" }}>
              Capital for every stage
              <br />
              of the journey.
            </h1>
            <p className="s-sub" style={{ color: "rgba(244,239,228,.4)" }}>
              For businesses Van Dyke does not acquire, our owned companies
              provide growth financing or operational funding for the situation
              at hand.
            </p>
          </div>
          <div className="funding-grid rv">
            {options.map((o) => (
              <div key={o.name} className="fcard">
                <div className="fcard-label">{o.label}</div>
                <div className="fcard-h">{o.name}</div>
                <div className="fcard-partner">
                  A Van Dyke Acquisitions company · {o.company} · {o.display}
                </div>
                <p className="fcard-p">{o.desc}</p>
                <ul className="fcard-points">
                  {o.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <a
                  href={o.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fcard-cta"
                >
                  {o.name} &rarr;
                </a>
              </div>
            ))}
          </div>
          <p className="funding-note rv">
            Funding decisions are made by Cohort Capital and LeaderShield
            Funding. Applications open in a new window.
          </p>
        </div>
      </section>
    </>
  );
}
