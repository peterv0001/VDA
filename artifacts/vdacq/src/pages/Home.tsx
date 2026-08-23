import { Link } from "wouter";
import { useReveal } from "../lib/useReveal";
import { usePageMeta } from "../lib/usePageMeta";
import { PAGE_META } from "../lib/pageMeta";

function Hero({ onModalOpen }: { onModalOpen: () => void }) {
  return (
    <header className="hero">
      <div className="hero-tex" />
      <div className="hero-vline" style={{ left: "25%" }} />
      <div className="hero-vline" style={{ left: "50%" }} />
      <div className="hero-vline" style={{ left: "75%" }} />
      <div className="hero-content">
        <div className="hero-kicker">
          <div className="hero-pill">CPG Control Investor</div>
          <div className="hero-sep" />
          <div className="hero-est">Permanent Capital · Established 2014</div>
        </div>
        <h1>
          We acquire and operate <span className="accent">CPG companies.</span>
          <span className="sub-h">
            Van Dyke Acquisitions takes majority or full ownership of consumer
            packaged goods businesses. We do not advise from the sidelines or
            take passive positions—we own the work and hold the operating
            authority to do it.
          </span>
        </h1>
        <div className="hero-rule" />
        <p className="hero-body">
          We pursue two situations with the same standard:{" "}
          <strong>distressed CPG businesses that need stabilization</strong> and{" "}
          <strong>
            growth-stage CPG businesses ready for better ownership.
          </strong>
        </p>
        <div className="hero-btns">
          <Link href="/contact" className="btn-gold">
            Introduce a Situation
          </Link>
          <button className="btn-outline" onClick={onModalOpen}>
            Request Portfolio Access
          </button>
        </div>
      </div>
      <div className="proof-bar">
        {[
          ["20+", "Control Acquisitions"],
          ["10+", "Years Operating"],
          ["$300M", "Largest Company Managed"],
          ["CPG", "Exclusive Focus"],
          ["∞", "Holding Period"],
        ].map(([n, l]) => (
          <div key={l} className="pb-item">
            <div className="pb-n">{n}</div>
            <div className="pb-l">{l}</div>
          </div>
        ))}
      </div>
    </header>
  );
}

function ControlStandard() {
  const items = [
    ["Capital", "Permanent family office capital"],
    ["Ownership", "Majority or full ownership"],
    ["Authority", "Operating authority at close"],
    ["Focus", "Consumer packaged goods only"],
  ];
  return (
    <section
      className="control-standard"
      aria-labelledby="control-standard-title"
    >
      <div className="s-in control-standard-inner rv">
        <div>
          <div className="eyebrow">The Control Standard</div>
          <h2 id="control-standard-title" className="s-h">
            Ownership that can make the change.
          </h2>
        </div>
        <div className="control-standard-grid">
          {items.map(([label, value]) => (
            <div className="control-standard-item" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AcquisitionPaths() {
  const paths = [
    {
      label: "Distressed CPG Acquisitions",
      title: "When a business needs stabilization.",
      description:
        "We acquire CPG businesses where operational complexity, creditor pressure, or a broken cost and execution model requires an owner who can act quickly.",
      signals: [
        "Creditor, covenant, receivership, or pre-insolvency situations",
        "Manufacturing, supply chain, margin, or leadership breakdowns",
        "Assets that need a buyer with operating infrastructure",
      ],
      className: "distressed",
    },
    {
      label: "Growth-Stage CPG Acquisitions",
      title: "When a brand needs better ownership.",
      description:
        "We acquire healthy CPG companies with real consumer pull that have outgrown their current ownership, capital structure, or operating capacity.",
      signals: [
        "Founder transitions, succession, and majority exits",
        "Brands constrained by distribution, channel, or execution gaps",
        "Growth companies seeking a permanent control owner",
      ],
      className: "growth",
    },
  ];

  return (
    <section
      className="acquisition-paths"
      aria-labelledby="acquisition-paths-title"
    >
      <div className="s-in">
        <div className="acquisition-paths-intro rv">
          <div className="eyebrow light">Acquisitions</div>
          <h2 id="acquisition-paths-title" className="s-h">
            Two acquisition paths.
            <br />
            One ownership model.
          </h2>
          <p>
            In either situation, we acquire control, put operating authority
            behind the business, and hold for the work—not for a fund deadline.
          </p>
        </div>
        <div className="acquisition-paths-grid rv">
          {paths.map((path) => (
            <article
              className={`acquisition-card ${path.className}`}
              key={path.label}
            >
              <div className="acquisition-card-label">{path.label}</div>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <ul>
                {path.signals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
              <Link href="/contact" className="acquisition-card-link">
                Introduce an acquisition opportunity{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OperatingSystemCallout() {
  return (
    <section
      className="operating-callout"
      aria-labelledby="operating-system-title"
    >
      <div className="s-in operating-callout-inner rv">
        <div className="operating-callout-marker" aria-hidden="true">
          <span>01</span>
          <span>VOS</span>
        </div>
        <div className="operating-callout-copy">
          <div className="eyebrow light">The Velocity Operating System</div>
          <h2 id="operating-system-title">
            Our operating method, shared in public.
          </h2>
          <p>
            The Velocity Operating System is the practical method we use to
            create operating change: principles, measures, decision rules, and
            checklists that turn accountability into repeatable work.
          </p>
          <p>
            Start with the illustrated book, then use the public library when
            the work calls for a specific measure, rule, or practice.
          </p>
        </div>
        <div className="operating-callout-actions">
          <Link href="/how-we-operate/book" className="btn-gold">
            Read the book
          </Link>
          <Link href="/how-we-operate" className="operating-callout-library">
            Explore the library <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function OperationsOfferings() {
  return (
    <section
      className="operations-offerings"
      aria-labelledby="operations-offerings-title"
    >
      <div className="s-in">
        <div className="operations-offerings-head rv">
          <div>
            <div className="eyebrow">Operating Engagements</div>
            <h2 id="operations-offerings-title" className="s-h">
              Hands-on help when an acquisition is not the answer.
            </h2>
          </div>
          <p>
            We also use the Velocity Operating System directly with ownership
            groups and leadership teams that need change now.
          </p>
        </div>
        <div className="operations-offerings-grid rv">
          <article className="operations-offering">
            <div className="operations-offering-number">01</div>
            <h3>Velocity OS Workshops</h3>
            <p>
              Hands-on working sessions for teams that need to establish shared
              facts, clearer decision rights, operating cadence, and a practical
              next set of actions.
            </p>
            <Link href="/velocity-os#intake-form">Request a workshop →</Link>
          </article>
          <article className="operations-offering">
            <div className="operations-offering-number">02</div>
            <h3>Turnaround Consulting</h3>
            <p>
              Focused operational intervention for businesses facing a material
              execution, margin, cash, or leadership constraint without a change
              in ownership.
            </p>
            <Link href="/velocity-os#intake-form">
              Begin an operations conversation →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function FundingOptions() {
  return (
    <section
      className="funding-options"
      aria-labelledby="funding-options-title"
    >
      <div className="s-in">
        <div className="funding-options-head rv">
          <div className="eyebrow light">Get Funding Options</div>
          <h2 id="funding-options-title" className="s-h">
            Funding when an acquisition
            <br />
            is not the answer.
          </h2>
          <p>
            For businesses Van Dyke does not acquire, Cohort Capital and
            LeaderShield Funding offer two distinct paths: growth financing and
            operational funding.
          </p>
        </div>
        <div className="funding-options-grid rv">
          <article className="funding-option-card">
            <div className="funding-option-type">Growth Financing</div>
            <h3>Cohort Capital</h3>
            <p>
              Growth financing for CPG brands with traction that need capital
              for inventory, retail expansion, marketing, and revenue
              acceleration.
            </p>
            <a
              href="https://cohortfunding.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Cohort Capital
            </a>
          </article>
          <article className="funding-option-card">
            <div className="funding-option-type">Operational Funding</div>
            <h3>LeaderShield Funding</h3>
            <p>
              Operational funding for businesses that need working capital to
              manage cash-flow gaps, production runs, payroll, and day-to-day
              continuity.
            </p>
            <a
              href="https://leadershieldfunding.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore LeaderShield Funding
            </a>
          </article>
        </div>
        <Link href="/funding" className="funding-options-link rv">
          Compare funding options <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

function ProofAndNextStep({ onModalOpen }: { onModalOpen: () => void }) {
  return (
    <section className="proof-next" aria-labelledby="proof-next-title">
      <div className="s-in proof-next-grid rv">
        <div>
          <div className="eyebrow">Proof, When It Matters</div>
          <h2 id="proof-next-title" className="s-h">
            A record built in
            <br />
            the operating chair.
          </h2>
          <p>
            Review representative control acquisitions, then request verified
            access for the confidential portfolio detail.
          </p>
          <div className="proof-next-actions">
            <Link href="/track-record" className="btn-outline-dark">
              View Track Record
            </Link>
            <button className="proof-access-button" onClick={onModalOpen}>
              Request Full Portfolio Access
            </button>
          </div>
        </div>
        <div className="proof-next-contact">
          <div className="eyebrow light">Start Here</div>
          <h3>What do you need?</h3>
          <Link href="/contact">
            An acquisition conversation <span aria-hidden="true">→</span>
          </Link>
          <Link href="/velocity-os#intake-form">
            Operational help <span aria-hidden="true">→</span>
          </Link>
          <Link href="/funding">
            Growth or operational funding <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home({ onModalOpen }: { onModalOpen: () => void }) {
  usePageMeta(PAGE_META["/"].title, PAGE_META["/"].description);
  useReveal();

  return (
    <>
      <Hero onModalOpen={onModalOpen} />
      <ControlStandard />
      <AcquisitionPaths />
      <OperatingSystemCallout />
      <OperationsOfferings />
      <FundingOptions />
      <ProofAndNextStep onModalOpen={onModalOpen} />
    </>
  );
}
