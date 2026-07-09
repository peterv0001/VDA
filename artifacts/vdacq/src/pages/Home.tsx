import { Link, useLocation } from "wouter";
import { useReveal } from "../lib/useReveal";

function Hero({ onModalOpen }: { onModalOpen: () => void }) {
  const [, navigate] = useLocation();
  return (
    <div className="hero">
      <div className="hero-tex" />
      <div className="hero-vline" style={{ left: "25%" }} />
      <div className="hero-vline" style={{ left: "50%" }} />
      <div className="hero-vline" style={{ left: "75%" }} />
      <div className="hero-content">
        <div className="hero-kicker">
          <div className="hero-pill">Control Investor</div>
          <div className="hero-sep" />
          <div className="hero-est">
            Established 2014 &middot; CPG Exclusive
          </div>
        </div>
        <h1>
          We don't advise.
          <br />
          We don't observe.
          <span className="accent">We own. We operate.</span>
          <span className="sub-h">
            Van Dyke Acquisitions is a family office deploying permanent capital
            in control positions across the consumer packaged goods industry —
            with the operating platform, sector depth, and decision authority to
            transform companies that others won't touch and accelerate those
            that deserve better ownership.
          </span>
        </h1>
        <div className="hero-rule" />
        <p className="hero-body">
          In 10 years and <strong>20+ control acquisitions</strong>, we have
          operated CPG businesses from{" "}
          <strong>under $5M to over $300M</strong> in annual revenue. We have
          built brands from the factory floor, restructured P&Ls from the
          operating chair, and created exits that institutional capital couldn't
          engineer.{" "}
          <strong>
            No fund cycle. No LP pressure. One principal. Full accountability.
          </strong>
        </p>
        <div className="hero-btns">
          <button className="btn-gold" onClick={() => navigate("/contact")}>
            Introduce a Situation
          </button>
          <button className="btn-outline" onClick={onModalOpen}>
            Request Portfolio Access
          </button>
        </div>
      </div>
      <div className="proof-bar">
        {[
          ["20+", "Control Acquisitions"],
          ["10+", "Years of Operation"],
          ["$300M", "Largest Co. Managed"],
          ["CPG", "Exclusive Category"],
          ["\u221E", "Holding Period"],
        ].map(([n, l]) => (
          <div key={l} className="pb-item">
            <div className="pb-n">{n}</div>
            <div className="pb-l">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConvictionBand() {
  const items = [
    ["Investment Type", "Control Acquisitions Only"],
    ["Category Focus", "Consumer Packaged Goods"],
    ["Capital Structure", "Permanent Family Office Capital"],
    ["Mandate", "Distressed & Growth-Stage"],
    ["Operating Arm", "VDA Operating Group \u00B7 PVG Capital"],
  ];
  return (
    <div className="conv-band">
      <div className="conv-inner">
        {items.map(([cap, val]) => (
          <div key={cap} className="cb-item">
            <div className="cb-cap">{cap}</div>
            <div className="cb-val">{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <div className="s-in">
        <div className="mfst-grid rv">
          <div>
            <div className="eyebrow">Our Conviction</div>
            <div className="s-h">More than a capital provider.</div>
            <div className="mfst-pull">
              "The firms that will define the next decade of CPG value creation
              are those with operating capabilities embedded at the ownership
              level — not just at the board level."
            </div>
            <div className="mfst-badge-row">
              {[
                "Distressed M&A",
                "Turnaround",
                "Growth Acceleration",
                "Operational Control",
                "Brand Building",
                "Specialty Lending",
              ].map((b) => (
                <span key={b} className="mfst-badge">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mfst-body">
              Van Dyke Acquisitions was not built to deploy capital and observe.
              It was built by operators — people who have run factories,
              restructured supply chains, rebuilt distribution networks, and
              navigated the complexity of consumer brands in distress and in
              growth.{" "}
              <strong>
                That is our edge. It compounds with every acquisition we make.
              </strong>
              <br />
              <br />
              We were founded in 2014 — originally as Golden Tiger Holdings —
              with a core beverage manufacturing business that at peak produced
              8,000 cans per minute. The experience of building, scaling, and
              ultimately exiting that business gave us something no investment
              committee can manufacture:{" "}
              <strong>
                the credibility of having operated at scale in consumer goods
              </strong>{" "}
              before deploying a dollar of acquisition capital.
              <br />
              <br />
              Today, we bring that operating DNA to every situation we enter —
              whether a brand facing creditor pressure and needing immediate
              operational stabilization, or a founder-led business that has
              outgrown its current ownership structure and needs a partner who
              will act with speed and conviction.
            </p>
            <div className="vc-pillars">
              {[
                [
                  "01 \u2014 Capital",
                  "Permanent. No Expiry.",
                  "Family office structure means we hold on our timeline, not a fund's calendar. Zero LP pressure.",
                ],
                [
                  "02 \u2014 Control",
                  "Majority or Full. Non-Negotiable.",
                  "We take controlling stakes. The ability to act decisively is prerequisite, not preference.",
                ],
                [
                  "03 \u2014 Operators",
                  "We've Run These Businesses.",
                  "Our team has held P&L ownership in CPG — manufacturing, brand, and distribution alike.",
                ],
                [
                  "04 \u2014 Category",
                  "CPG Only. Always.",
                  "Exclusive sector focus drives insights, relationships, and pattern recognition that generalists lack.",
                ],
              ].map(([ico, t, d]) => (
                <div key={ico} className="vcp">
                  <div className="vcp-ico">{ico}</div>
                  <div className="vcp-t">{t}</div>
                  <div className="vcp-d">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DualMandate() {
  return (
    <section className="dual" id="mandate">
      <div className="s-in">
        <div className="dual-intro rv">
          <div className="eyebrow light">Investment Mandate</div>
          <div className="s-h" style={{ color: "var(--cream)" }}>
            Two types of situation.
            <br />
            One standard of rigor.
          </div>
          <p className="dual-intro-body">
            We have expanded beyond our original distressed mandate — not
            because we have softened our standards, but because the operating
            intensity we apply to turnarounds creates a genuine competitive
            advantage in healthy growth situations as well. Our diligence is the
            same. Our involvement is the same. Our accountability is the same.
          </p>
        </div>
        <div className="dual-grid rv">
          <div className="dcard">
            <div
              className="dcard-bar"
              style={{
                background: "linear-gradient(90deg,#7a1f1f,#c03535)",
              }}
            />
            <div className="dcard-label r">
              <span
                className="dcard-dot"
                style={{ background: "#c03535" }}
              />
              Distressed Acquisitions
            </div>
            <div className="dcard-h">
              When complexity creates opportunity.
            </div>
            <p className="dcard-p">
              Our founding mandate. We are among the few buyers in the consumer
              space with the operational infrastructure to pursue genuinely
              distressed CPG situations — not just financially stressed, but
              operationally broken. We move where institutional capital cannot,
              and we stabilize what others decline.
            </p>
            <ul className="dcard-sigs">
              {[
                "Brands under creditor pressure, covenant breach, or bank workout",
                "Post-bankruptcy assets and pre-insolvency acquisitions",
                "Receivership and trustee-directed sale processes",
                "Founder-led businesses with operational dysfunction",
                "Distressed debt positions convertible to equity control",
                "Special situations via PVG Capital, our credit affiliate",
              ].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <div className="dcard-ft">
              10+ years of distressed CPG acquisition and turnaround track
              record
            </div>
          </div>
          <div className="dcard">
            <div
              className="dcard-bar"
              style={{
                background: "linear-gradient(90deg,#1e5c30,#3d9c5a)",
              }}
            />
            <div className="dcard-label g">
              <span
                className="dcard-dot"
                style={{ background: "#3d9c5a" }}
              />
              Growth-Stage Acquisitions
            </div>
            <div className="dcard-h">
              When a brand deserves better ownership.
            </div>
            <p className="dcard-p">
              Our expanded mandate. Healthy CPG brands with real consumer pull
              but misaligned ownership, capital constraints, or growth plateaus
              are now equally compelling. We apply turnaround-caliber diligence
              and operational depth to acceleration — not just recovery. The
              result: a faster path to the brand's potential than any financial
              buyer can offer.
            </p>
            <ul className="dcard-sigs">
              {[
                "CPG brands with $2M\u2013$50M revenue seeking a decisive control partner",
                "Founder transitions, succession situations, and majority exits",
                "PE-backed assets requiring a longer-horizon permanent owner",
                "Brands with channel gaps, distribution underperformance, or DTC-to-retail pivots",
                "Roll-up targets within our active CPG portfolio verticals",
              ].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <div className="dcard-ft">
              Now actively acquiring healthy, growth-stage CPG companies
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Teasers() {
  const items: [string, string, string, string][] = [
    [
      "/track-record",
      "Track Record",
      "20+ control acquisitions across the CPG spectrum",
      "Named exits, revenue ranges, and current holdings — from distressed turnarounds to growth-stage platforms.",
    ],
    [
      "/platform",
      "Operating Platform",
      "The VDA Operating Group",
      "Six proprietary capabilities deployed into every acquisition — from lean operations to specialty lending.",
    ],
    [
      "/team",
      "Leadership",
      "The operators behind the office",
      "A senior team spanning acquisitions, operations, technology, revenue, and portfolio management.",
    ],
    [
      "/contact",
      "Start a Conversation",
      "Introduce a situation",
      "Advisors, founders, creditors, and co-investors — we respond within one business day.",
    ],
  ];
  return (
    <section className="teasers">
      <div className="s-in">
        <div className="rv">
          <div className="eyebrow">Explore Van Dyke</div>
          <div className="s-h">Go deeper.</div>
        </div>
        <div className="teaser-grid rv">
          {items.map(([href, eye, title, desc]) => (
            <Link key={href} href={href} className="teaser-card">
              <div className="teaser-eye">{eye}</div>
              <div className="teaser-title">{title}</div>
              <p className="teaser-desc">{desc}</p>
              <div className="teaser-link">Explore &rarr;</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home({ onModalOpen }: { onModalOpen: () => void }) {
  useReveal();
  return (
    <>
      <Hero onModalOpen={onModalOpen} />
      <ConvictionBand />
      <Manifesto />
      <DualMandate />
      <Teasers />
    </>
  );
}
