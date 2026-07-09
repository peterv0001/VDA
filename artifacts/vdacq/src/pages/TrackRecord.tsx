import { useReveal } from "../lib/useReveal";
import { usePageMeta } from "../lib/usePageMeta";
import { PAGE_META } from "../lib/pageMeta";

function TrackRecordSection({ onModalOpen }: { onModalOpen: () => void }) {
  const cards = [
    {
      type: "d",
      typeLabel: "Distressed \u2014 Turnaround",
      rev: "$50M\u2013$150M",
      company: "One Source",
      cat: "Beverage Manufacturing \u00B7 CPG Infrastructure",
      desc: "Complete operational turnaround of a high-volume contract beverage manufacturer. At peak: 8,000 cans/minute. Full restructuring of cost base, management team, and customer portfolio prior to successful exit.",
      result: "Exited 2019 \u00B7 Value Created at Exit",
    },
    {
      type: "d",
      typeLabel: "Distressed \u2014 Restructuring",
      rev: "$20M\u2013$80M",
      company: "Tiger Logistics Group",
      cat: "Consumer Goods \u00B7 Distribution & Fulfillment",
      desc: "Acquired a CPG distribution platform in operational distress. Restructured logistics infrastructure, renegotiated supplier contracts, and rebuilt the commercial organization. National distribution restored within 18 months.",
      result: "Exited 2017 \u00B7 Stabilized & Grown",
    },
    {
      type: "h",
      typeLabel: "Growth-Stage \u2014 Acceleration",
      rev: "$5M\u2013$70M",
      company: "EFX Brands",
      cat: "Functional Nutrition \u00B7 Supplements",
      desc: "Control acquisition of an emerging supplements brand with strong DTC traction but constrained retail penetration. Deployed VDA Operating Group to build retail distribution, optimize formulation costs, and build subscription revenue.",
      result: "Exited 2014 \u00B7 Revenue Tripled in 24 Months",
    },
    {
      type: "d",
      typeLabel: "Distressed \u2014 Special Situation",
      rev: "$100M\u2013$300M",
      company: "G3 (Pure) Manufacturing",
      cat: "Consumer Manufacturing \u00B7 Multi-Segment",
      desc: "PVG Capital provided bridge lending to a CPG manufacturer entering a covenant breach scenario. Converted to equity control. Full operational restructuring executed with VDA Operating Group embedded in management.",
      result: "Exited 2019 \u00B7 Strategic Exit Achieved",
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
      company: "NutraSimple Holdings",
      cat: "Wellness & Personal Care \u00B7 Multi-Brand",
      desc: "Platform acquisition of multiple adjacently positioned CPG wellness brands. Consolidated operations under VDA infrastructure. Unified DTC strategy and shared fulfillment to accelerate margin expansion.",
      result: "Exited 2022 \u00B7 Platform Consolidated & Sold",
    },
  ] as Array<{
    type: string;
    typeLabel: string;
    rev: string;
    company?: string;
    cat: string;
    desc: string;
    result: string;
    clickable?: boolean;
  }>;
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
              {c.company && <div className="tc-co">{c.company}</div>}
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
          Revenue ranges approximate. Full details available to qualified
          counterparties under NDA.
        </p>
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

export default function TrackRecordPage({ onModalOpen }: { onModalOpen: () => void }) {
  usePageMeta(PAGE_META["/track-record"].title, PAGE_META["/track-record"].description);
  useReveal();
  return (
    <>
      <div className="page-head" />
      <TrackRecordSection onModalOpen={onModalOpen} />
      <Portfolio onModalOpen={onModalOpen} />
    </>
  );
}
