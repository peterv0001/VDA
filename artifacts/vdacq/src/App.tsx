import { useState, useEffect, type FormEvent } from "react";
import { useCreateAccessRequest, useCreateInquiry } from "@workspace/api-client-react";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Modal({ onClose }: { onClose: () => void }) {
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [titleRole, setTitleRole] = useState("");
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState("");

  const mutation = useCreateAccessRequest();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (!fullName.trim() || !email.trim() || !organization.trim() || !reason) {
      setValidationError("Please fill in all required fields.");
      return;
    }
    mutation.mutate(
      { data: { fullName: fullName.trim(), organization: organization.trim(), email: email.trim(), titleRole: titleRole.trim() || undefined, reason } },
      { onSuccess: () => { setTimeout(onClose, 2000); } }
    );
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          &#x2715;
        </button>
        <div className="modal-eye">Portfolio Access Request</div>
        <div className="modal-title" id="modal-heading">Qualified Counterparties Only</div>
        <p className="modal-sub">
          Van Dyke Acquisitions shares portfolio detail exclusively with
          verified principals, advisors, and institutional counterparties.
          Submit your information and we will respond within one business day.
        </p>
        {mutation.isSuccess ? (
          <div className="form-success">
            <div className="form-success-icon">&#x2713;</div>
            <p>Your access request has been received. We will review and respond within one business day.</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="modal-name">Full Name</label>
            <input className="modal-input" id="modal-name" placeholder="Full Name *" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <label className="sr-only" htmlFor="modal-org">Organization</label>
            <input className="modal-input" id="modal-org" placeholder="Organization / Fund / Firm *" type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} required />
            <label className="sr-only" htmlFor="modal-email">Professional Email</label>
            <input className="modal-input" id="modal-email" placeholder="Professional Email Address *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label className="sr-only" htmlFor="modal-title">Title / Role</label>
            <input className="modal-input" id="modal-title" placeholder="Title / Role" type="text" value={titleRole} onChange={(e) => setTitleRole(e.target.value)} />
            <label className="sr-only" htmlFor="modal-reason">Reason for Access</label>
            <select className="modal-input" id="modal-reason" value={reason} onChange={(e) => setReason(e.target.value)} required>
              <option value="" disabled>
                Reason for Access *
              </option>
              <option>M&A Advisory / Deal Sourcing</option>
              <option>Founder Evaluating a Sale</option>
              <option>Creditor / Banker / Trustee</option>
              <option>PE / Family Office Co-Investment</option>
              <option>Strategic / Corporate Development</option>
              <option>Other</option>
            </select>
            {validationError && <p className="form-error">{validationError}</p>}
            {mutation.isError && <p className="form-error">Something went wrong. Please try again.</p>}
            <button type="submit" className="modal-submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit Access Request"}
            </button>
          </form>
        )}
        <p className="modal-note">
          All submissions are reviewed personally. Confidentiality guaranteed.
        </p>
      </div>
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-brand">
        <div className="nav-wordmark">
          Van Dyke <span>Acquisitions</span>
        </div>
        <div className="nav-sub">
          CPG Family Office &middot; Control Investor &middot; Est. 2014
        </div>
      </div>
      <div className="nav-links">
        {["manifesto", "mandate", "platform", "portfolio", "team"].map(
          (id) => (
            <button
              key={id}
              className="nav-link"
              onClick={() => scrollTo(id)}
            >
              {id === "manifesto"
                ? "Philosophy"
                : id === "mandate"
                ? "Mandate"
                : id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          )
        )}
      </div>
      <button className="nav-cta" onClick={() => scrollTo("contact")}>
        Introduce a Situation
      </button>
    </nav>
  );
}

function Hero({ onModalOpen }: { onModalOpen: () => void }) {
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
          <button className="btn-gold" onClick={() => scrollTo("contact")}>
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

function Platform() {
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
        <div className="s-h rv">The VDA Operating Group.</div>
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

function TrackRecord({ onModalOpen }: { onModalOpen: () => void }) {
  const cards = [
    {
      type: "d",
      typeLabel: "Distressed \u2014 Turnaround",
      rev: "$50M\u2013$150M",
      cat: "Beverage Manufacturing \u00B7 CPG Infrastructure",
      desc: "Complete operational turnaround of a high-volume contract beverage manufacturer. At peak: 8,000 cans/minute. Full restructuring of cost base, management team, and customer portfolio prior to successful exit.",
      result: "Successfully Exited \u00B7 Value Created at Exit",
    },
    {
      type: "d",
      typeLabel: "Distressed \u2014 Restructuring",
      rev: "$20M\u2013$80M",
      cat: "Consumer Goods \u00B7 Distribution & Fulfillment",
      desc: "Acquired a CPG distribution platform in operational distress. Restructured logistics infrastructure, renegotiated supplier contracts, and rebuilt the commercial organization. National distribution restored within 18 months.",
      result: "Successfully Stabilized & Grown",
    },
    {
      type: "h",
      typeLabel: "Growth-Stage \u2014 Acceleration",
      rev: "$5M\u2013$25M",
      cat: "Functional Nutrition \u00B7 Supplements",
      desc: "Control acquisition of an emerging supplements brand with strong DTC traction but constrained retail penetration. Deployed VDA Operating Group to build retail distribution, optimize formulation costs, and build subscription revenue.",
      result: "Revenue Tripled in 24 Months",
    },
    {
      type: "d",
      typeLabel: "Distressed \u2014 Special Situation",
      rev: "$100M\u2013$300M",
      cat: "Consumer Manufacturing \u00B7 Multi-Segment",
      desc: "PVG Capital provided bridge lending to a CPG manufacturer entering a covenant breach scenario. Converted to equity control. Full operational restructuring executed with VDA Operating Group embedded in management.",
      result: "Stabilized \u00B7 Strategic Exit Achieved",
    },
    {
      type: "e",
      typeLabel: "View More",
      clickable: true,
      rev: "16+ Additional",
      cat: "Confidential Portfolio",
      desc: "Complete deal history including transaction structure, entry thesis, operating interventions, and exit outcomes shared exclusively with verified counterparties.",
      result: "\u2192 Request Portfolio Access",
    },
    {
      type: "h",
      typeLabel: "Growth-Stage \u2014 Roll-Up",
      rev: "$2M\u2013$15M",
      cat: "Wellness & Personal Care \u00B7 Multi-Brand",
      desc: "Platform acquisition of multiple adjacently positioned CPG wellness brands. Consolidated operations under VDA infrastructure. Unified DTC strategy and shared fulfillment to accelerate margin expansion.",
      result: "Active \u2014 Platform Expanding",
    },
  ];
  return (
    <section className="track" id="track">
      <div className="s-in">
        <div className="rv">
          <div className="eyebrow light">Track Record</div>
          <div className="s-h" style={{ color: "var(--cream)" }}>
            20+ control acquisitions.
            <br />
            Proven across the full CPG spectrum.
          </div>
          <p className="s-sub" style={{ color: "rgba(244,239,228,.4)" }}>
            Representative situations from a 10-year operating history. Full
            portfolio details available to qualified counterparties upon
            verified request.
          </p>
        </div>
        <div className="tr-grid rv">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`tcard${c.clickable ? " clickable" : ""}`}
              onClick={c.clickable ? onModalOpen : undefined}
              onKeyDown={c.clickable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onModalOpen(); } } : undefined}
              role={c.clickable ? "button" : undefined}
              tabIndex={c.clickable ? 0 : undefined}
            >
              <div className="tc-type">
                <span className={`tc-dot ${c.type}`} />
                <span className="tc-type-label">{c.typeLabel}</span>
              </div>
              <div
                className="tc-rev"
                style={
                  c.clickable
                    ? { fontSize: "18px", color: "rgba(244,239,228,.35)" }
                    : {}
                }
              >
                {c.rev}
              </div>
              <div
                className="tc-cat"
                style={
                  c.clickable
                    ? { color: "rgba(244,239,228,.35)" }
                    : {}
                }
              >
                {c.cat}
              </div>
              <p className="tc-desc">{c.desc}</p>
              <div
                className="tc-result"
                style={
                  c.clickable
                    ? { color: "var(--gold2)", cursor: "pointer" }
                    : {}
                }
              >
                {c.result}
              </div>
            </div>
          ))}
        </div>
        <p className="track-note">
          All deal descriptions anonymized. Revenue ranges approximate. Full
          details available to qualified counterparties under NDA.
        </p>
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
          <div className="s-h">
            Control is not a structure.
            <br />
            It is a standard of accountability.
          </div>
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

function Portfolio({ onModalOpen }: { onModalOpen: () => void }) {
  const open = [
    {
      cat: "Functional Nutrition \u00B7 Weight Management",
      name: "TikTok Weight Loss Leader",
      type: "h",
      status: "Growth-Stage \u00B7 Active",
      desc: "GLP-1 companion stack platform. Addresses metabolic health, appetite regulation, and body composition for the post-GLP-1 consumer segment.",
    },
    {
      cat: "Longevity \u00B7 Cellular Health",
      name: "Longevity Clinics",
      type: "h",
      status: "Growth-Stage \u00B7 Active",
      desc: "Science-backed longevity formulation platform anchored in NMN, NAD+ precursors, and mitochondrial health science.",
    },
    {
      cat: "Microbiome \u00B7 Gut-Brain Axis",
      name: "Gut Health Leader in China",
      type: "h",
      status: "Growth-Stage \u00B7 Active",
      desc: "Precision probiotic and prebiotic platform positioned at the intersection of clinical gut health science and clean-label CPG.",
    },
  ];
  const locked = [
    {
      cat: "Beverage Manufacturing",
      name: "Flagship Exit",
      type: "e",
      status: "Exited \u00B7 8,000 cans/min peak",
      desc: "Core founding asset. Turnaround and exit. Full case study available to verified counterparties.",
    },
    {
      cat: "Consumer Goods \u00B7 Distressed",
      name: "Portfolio Co. B",
      type: "d",
      status: "Distressed Acquisition",
      desc: "Turnaround. $50M\u2013$150M revenue range. Full P&L restructuring executed under VDA Operating Group control.",
    },
    {
      cat: "Multi-Brand Platform \u00B7 CPG",
      name: "Portfolio Co. C",
      type: "h",
      status: "Growth Roll-Up \u00B7 Active",
      desc: "Wellness and personal care roll-up. Multiple brands consolidated under VDA infrastructure. Margin expansion ongoing.",
    },
  ];
  return (
    <section className="portfolio" id="portfolio">
      <div className="s-in">
        <div className="port-header rv">
          <div>
            <div className="eyebrow">Portfolio</div>
            <div className="s-h">Current Holdings</div>
          </div>
          <div className="port-access">
            Full profiles require verified access
          </div>
        </div>
        <div className="port-grid rv">
          {open.map((p) => (
            <div key={p.name} className="pc">
              <div className="pc-body">
                <div className="pc-cat">{p.cat}</div>
                <div className="pc-name">{p.name}</div>
                <div className="pc-status">
                  <span className={`pdot ${p.type}`} />
                  {p.status}
                </div>
                <p className="pc-desc">{p.desc}</p>
              </div>
            </div>
          ))}
          {locked.map((p) => (
            <div
              key={p.name}
              className="pc locked"
              onClick={onModalOpen}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onModalOpen(); } }}
              role="button"
              tabIndex={0}
            >
              <div className="lock-overlay">
                <div className="lock-icon">&#x1F512;</div>
                <div className="lock-lbl">Confidential Holding</div>
                <button className="lock-btn">Request Access</button>
              </div>
              <div className="pc-body">
                <div className="pc-cat">{p.cat}</div>
                <div className="pc-name">{p.name}</div>
                <div className="pc-status">
                  <span className={`pdot ${p.type}`} />
                  {p.status}
                </div>
                <p className="pc-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="port-cta-row rv">
          <button className="btn-outline-dark" onClick={onModalOpen}>
            Request Full Portfolio Access &rarr;
          </button>
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
          <div className="s-h" style={{ color: "var(--cream)" }}>
            The four reasons serious counterparties
            <br />
            call us before anyone else.
          </div>
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
          <button
            className="why-cta"
            onClick={() => scrollTo("contact")}
          >
            Start a Conversation &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}

function Team() {
  const members = [
    {
      init: "PG",
      name: "Peter Griscom",
      role: "Founder, Principal & Executive Chairman",
      badge: "Founded Van Dyke Acquisitions in 2014",
      founder: true,
    },
    { init: "JB", name: "John Brady", role: "Chief Operating Officer", badge: "Operations" },
    { init: "DB", name: "David Bates", role: "President & CFO", badge: "Finance" },
    { init: "PM", name: "Paul Massingale", role: "Chief Growth Officer", badge: "Growth" },
    { init: "SJ", name: "Steve Jorgensen", role: "SVP, Portfolio Operations", badge: "Portfolio" },
    { init: "MM", name: "Michael Maldonado", role: "SVP, Innovation", badge: "Innovation" },
    { init: "MK", name: "Margaret Keene", role: "SVP, Family & Foundation", badge: "Family Office" },
    { init: "JC", name: "Jason Collyer", role: "VP, IT & Development", badge: "Technology" },
    { init: "JK", name: "Josh Kirkman", role: "VP, Group Revenue", badge: "Revenue" },
  ];
  const founder = members[0];
  const rest = members.slice(1);
  return (
    <section className="team" id="team">
      <div className="s-in">
        <div className="rv">
          <div className="eyebrow">Leadership</div>
          <div className="s-h">The operators behind the office.</div>
          <p className="s-sub">
            A senior team spanning acquisitions, operations, technology, revenue, and portfolio
            management — unified by a decade of shared experience in consumer goods.
          </p>
        </div>
        <div className="team-grid rv">
          <div className="tmc founder">
            <div className="founder-init">{founder.init}</div>
            <div>
              <div className="founder-name">{founder.name}</div>
              <div className="founder-role">{founder.role}</div>
              <div className="founder-note">{founder.badge}</div>
            </div>
          </div>
          {rest.map((m) => (
            <div key={m.init} className="tmc">
              <div className="tmc-init">{m.init}</div>
              <div className="tmc-name">{m.name}</div>
              <div className="tmc-role">{m.role}</div>
              <div className="tmc-badge">{m.badge}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");

  const mutation = useCreateInquiry();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (!fullName.trim() || !contactEmail.trim() || !organization.trim() || !category) {
      setValidationError("Please fill in all required fields.");
      return;
    }
    mutation.mutate({
      data: {
        fullName: fullName.trim(),
        organization: organization.trim(),
        email: contactEmail.trim(),
        phone: phone.trim() || undefined,
        category,
        description: description.trim() || undefined,
      },
    });
  };

  return (
    <section className="contact" id="contact">
      <div className="s-in">
        <div className="contact-grid rv">
          <div>
            <div className="eyebrow light">Start a Conversation</div>
            <div className="s-h" style={{ color: "var(--cream)" }}>
              Introduce a situation.
            </div>
            <ul className="contact-reasons">
              {[
                [
                  "\u2192",
                  <>
                    <strong>M&A Advisors & Investment Bankers</strong>{" "}
                    representing a sell-side CPG mandate — distressed or healthy
                  </>,
                ],
                [
                  "\u2192",
                  <>
                    <strong>Founders & Owners</strong> exploring a full or
                    majority sale of a CPG brand or manufacturing business
                  </>,
                ],
                [
                  "\u2192",
                  <>
                    <strong>Creditors, Trustees & Receivers</strong> seeking a
                    qualified buyer for a distressed consumer asset
                  </>,
                ],
                [
                  "\u2192",
                  <>
                    <strong>PE Firms & Family Offices</strong> seeking
                    co-investment, co-underwriting, or a permanent capital
                    exit partner
                  </>,
                ],
              ].map(([icon, text], i) => (
                <li key={i} className="cr-item">
                  <span className="cr-icon">{icon}</span>
                  <span className="cr-text">{text}</span>
                </li>
              ))}
            </ul>
            <a href="mailto:deals@vdacq.com" className="contact-book-link">
              Or email directly &rarr; deals@vdacq.com
            </a>
          </div>
          {mutation.isSuccess ? (
            <div className="cf">
              <div className="form-success">
                <div className="form-success-icon">&#x2713;</div>
                <p>Your inquiry has been received. We'll be in touch within one business day.</p>
              </div>
            </div>
          ) : (
            <form className="cf" onSubmit={handleSubmit}>
              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-label">Full Name *</label>
                  <input className="cf-input" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="cf-field">
                  <label className="cf-label">Organization *</label>
                  <input className="cf-input" placeholder="Firm, fund, or company" value={organization} onChange={(e) => setOrganization(e.target.value)} required />
                </div>
              </div>
              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-label">Email *</label>
                  <input className="cf-input" type="email" placeholder="Professional email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
                </div>
                <div className="cf-field">
                  <label className="cf-label">Phone</label>
                  <input className="cf-input" type="tel" placeholder="Direct line (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="cf-field">
                <label className="cf-label">Nature of Situation *</label>
                <select className="cf-input" value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="" disabled>
                    Select category
                  </option>
                  <option>Sell-Side M&A / Distressed CPG Asset</option>
                  <option>Founder Exploring a Sale</option>
                  <option>Growth-Stage CPG Brand Seeking a Partner</option>
                  <option>Creditor / Trustee / Receiver Situation</option>
                  <option>Co-Investment / Co-Underwriting Opportunity</option>
                  <option>Operating Consulting Inquiry</option>
                  <option>Other / General</option>
                </select>
              </div>
              <div className="cf-field">
                <label className="cf-label">Brief Description</label>
                <textarea
                  className="cf-input cf-textarea"
                  placeholder="Briefly describe the opportunity, situation, or reason for reaching out..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {validationError && <p className="form-error">{validationError}</p>}
              {mutation.isError && <p className="form-error">Something went wrong. Please try again.</p>}
              <button type="submit" className="cf-submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit Inquiry"}
              </button>
              <p className="cf-alt">
                Prefer a direct line?{" "}
                <a href="mailto:deals@vdacq.com">deals@vdacq.com</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        Van Dyke <span>Acquisitions</span>
      </div>
      <div className="footer-links">
        <a href="#manifesto" onClick={(e) => { e.preventDefault(); scrollTo("manifesto"); }}>Philosophy</a>
        <a href="#mandate" onClick={(e) => { e.preventDefault(); scrollTo("mandate"); }}>Mandate</a>
        <a href="#portfolio" onClick={(e) => { e.preventDefault(); scrollTo("portfolio"); }}>Portfolio</a>
        <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>Contact</a>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} Van Dyke Acquisitions LLC. All rights
        reserved.
      </div>
    </footer>
  );
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  useReveal();

  return (
    <>
      <Nav />
      <Hero onModalOpen={() => setModalOpen(true)} />
      <ConvictionBand />
      <Manifesto />
      <DualMandate />
      <Platform />
      <TrackRecord onModalOpen={() => setModalOpen(true)} />
      <ControlConviction />
      <Portfolio onModalOpen={() => setModalOpen(true)} />
      <WhyVDA />
      <Team />
      <Contact />
      <Footer />
      {modalOpen && <Modal onClose={() => setModalOpen(false)} />}
    </>
  );
}
