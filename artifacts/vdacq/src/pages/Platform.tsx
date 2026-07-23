import { Link } from "wouter";
import { useReveal } from "../lib/useReveal";
import { usePageMeta } from "../lib/usePageMeta";
import { PAGE_META } from "../lib/pageMeta";

function PlatformSection() {
  const caps = [
    [
      "Capability 01",
      "Portfolio Operations & Lean",
      "Factory-floor operational rigor applied to cost structure, throughput, and margin improvement across portfolio companies.",
    ],
    [
      "Capability 02",
      "Brand & Revenue Growth",
      "Channel strategy, DTC acceleration, retail distribution build-out, and performance marketing across the CPG stack.",
    ],
    [
      "Capability 03",
      "Innovation & Product",
      "Science-led formulation strategy, SKU rationalization, and category whitespace identification within CPG verticals.",
    ],
    [
      "Capability 04",
      "Technology & Systems",
      "ERP, data infrastructure, e-commerce platforms, and AI-assisted operational tooling deployed at the portfolio level.",
    ],
    [
      "Capability 05",
      "Specialty Lending (PVG Capital)",
      "Distressed debt, bridge financing, and transitional credit solutions for CPG companies in liquidity-constrained situations.",
    ],
    [
      "Capability 06",
      "Turnaround Consulting (SMB)",
      "Structured turnaround methodology available to portfolio companies and select third-party engagements.",
    ],
  ];
  return (
    <section className="platform" id="platform">
      <div className="s-in">
        <div className="eyebrow rv">Operating Platform</div>
        <h1 className="s-h rv">The VDA Operating Group.</h1>
        <div className="plat-grid rv">
          <div>
            <div className="plat-name">
              <span>Proprietary Capability</span>
              The operating infrastructure behind every acquisition.
            </div>
            <p className="plat-desc">
              Unlike financial buyers who depend on incumbent management, VDA's
              Operating Group is a dedicated, cross-functional team deployed
              into portfolio companies from day one. We do not advise from the
              outside — we hold operating authority from the inside. This is the
              structural advantage that enables us to pursue situations that
              financial capital alone cannot resolve.
            </p>
            <div className="plat-stats">
              {[
                ["8", "Operating Disciplines Represented on Team"],
                ["PVG", "Capital \u2014 Specialty Lending Affiliate"],
                ["SMB", "Turnaround \u2014 Consulting Arm"],
              ].map(([n, l]) => (
                <div key={l} className="plat-stat">
                  <div className="plat-stat-n">{n}</div>
                  <div className="plat-stat-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="plat-caps">
              {caps.map(([n, t, d]) => (
                <div key={n} className="pcap">
                  <div className="pcap-n">{n}</div>
                  <div className="pcap-t">{t}</div>
                  <div className="pcap-d">{d}</div>
                </div>
              ))}
            </div>
            <div className="playbook-bar">
              <div className="playbook-bar-icon">VDA Playbook</div>
              <div className="playbook-bar-text">
                We enter every acquisition with a{" "}
                <strong>proprietary CPG value creation playbook</strong> — built
                from a decade of operating experience across distressed
                turnarounds, brand acceleration, and manufacturing optimization.
                No two situations are identical; the playbook is calibrated, not
                templated.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlConviction() {
  return (
    <section className="ctrl" id="ctrl">
      <div className="s-in">
        <div className="rv">
          <div className="eyebrow">Why Control</div>
          <h2 className="s-h">
            Control is not a structure.
            <br />
            It is a standard of accountability.
          </h2>
          <p className="s-sub">
            We take majority or full-control positions in every acquisition. It
            is the only structure that allows us to move with the speed and
            conviction that distressed and growth situations require.
          </p>
        </div>
        <div className="ctrl-grid rv">
          <div>
            <p className="ctrl-body">
              Institutional buyers and minority co-investors face structural
              limitations that slow value creation: committee approvals, LP
              sensitivities, and management team dependencies. As a family
              office with full operating capability and no fund clock, we face
              none of these constraints.
              <br />
              <br />
              When we acquire a business, we deploy the VDA Operating Group
              into the asset within weeks. We hold operating authority, not just
              board seats. We make decisions at the speed the business requires
              — not at the speed a committee permits.
            </p>
            <div className="ctrl-stats">
              {[
                ["20+", "Control Positions Held"],
                ["0", "Minority Stakes Ever Taken"],
                ["\u221E", "Fund Expiry Date"],
              ].map(([n, l]) => (
                <div key={l} className="ctrl-stat">
                  <div className="ctrl-stat-n">{n}</div>
                  <div className="ctrl-stat-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="ctrl-box">
            <div className="ctrl-box-title">
              "What ownership looks like at Van Dyke"
            </div>
            <ul className="ctrl-list">
              {[
                [
                  "I.",
                  "Board control and operating authority exercised from the day of close \u2014 not delegated to incumbent management by default",
                ],
                [
                  "II.",
                  "VDA Operating Group deployed on-site within 30 days of acquisition for every situation requiring stabilization",
                ],
                [
                  "III.",
                  "Executive placement authority \u2014 including CEO, COO, and CFO \u2014 exercised when a situation requires leadership change",
                ],
                [
                  "IV.",
                  "Direct access to captive manufacturing infrastructure, fulfillment network, and marketplace management capabilities",
                ],
                [
                  "V.",
                  "Specialty lending via PVG Capital for bridge situations, working capital, and transitional credit within the portfolio",
                ],
                [
                  "VI.",
                  "Exit on our timeline \u2014 strategic, financial, or continuation \u2014 with no fund clock forcing a suboptimal outcome",
                ],
              ].map(([n, t]) => (
                <li key={n}>
                  <span className="ctrl-list-n">{n}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyVDA() {
  const cards = [
    [
      "I",
      "We move without committees",
      "Single family principal. No LP approval. No investment committee. When we decide, we act \u2014 at the speed your situation requires.",
    ],
    [
      "II",
      "We have operated what we acquire",
      "We have held P&L ownership in CPG businesses. We understand manufacturing margins, retail dynamics, and DTC economics from the operator's chair \u2014 not the board room.",
    ],
    [
      "III",
      "We solve situations others decline",
      "Creditor entanglements, broken management teams, operational dysfunction \u2014 these are not disqualifiers for us. They are the scenarios our platform was built for.",
    ],
    [
      "IV",
      "We own outcomes, not just positions",
      "Control positions mean full accountability. We don't manage from a distance. We are in the building, holding the operating lever, for as long as it takes to create the value the business deserves.",
    ],
  ];
  return (
    <section className="why" id="why">
      <div className="s-in">
        <div className="rv">
          <div className="eyebrow light">Why Van Dyke</div>
          <h2 className="s-h" style={{ color: "var(--cream)" }}>
            The four reasons serious counterparties
            <br />
            call us before anyone else.
          </h2>
        </div>
        <div className="why-grid rv">
          {cards.map(([n, t, d]) => (
            <div key={n} className="wcard">
              <div className="wc-n">{n}</div>
              <div className="wc-t">{t}</div>
              <div className="wc-d">{d}</div>
            </div>
          ))}
        </div>
        <div className="why-bottom rv">
          <div className="why-bottom-text">
            "If you are representing a CPG situation — distressed or healthy —
            and you need a buyer who can move with conviction, operate without
            hesitation, and hold without a deadline:{" "}
            <em>that is precisely what we were built for.</em>"
          </div>
          <Link href="/contact" className="why-cta">
            Start a Conversation &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function PlatformPage() {
  usePageMeta(PAGE_META["/platform"].title, PAGE_META["/platform"].description);
  useReveal();
  return (
    <>
      <div className="page-head" />
      <PlatformSection />
      <ControlConviction />
      <WhyVDA />
    </>
  );
}
