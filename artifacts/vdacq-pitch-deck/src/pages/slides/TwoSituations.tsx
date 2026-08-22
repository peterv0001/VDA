export default function TwoSituations() {
  return (
    <div className="deck-grain relative w-screen h-screen overflow-hidden bg-bg px-[7vw] py-[7vh] text-text">
      <div className="flex items-center gap-[1vw] font-body text-[1.2vw] uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-[3.2vw] bg-accent" />
        Investment mandate
      </div>
      <h1 className="mt-[3vh] max-w-[72vw] font-display text-[4.6vw] font-bold leading-[1.08] tracking-[-0.05em]">
        Two types of situation.
      </h1>
      <h2 className="font-display text-[4.6vw] font-normal italic leading-[1.08] tracking-[-0.05em] text-accent">
        One standard of rigor.
      </h2>
      <div className="mt-[6vh] grid grid-cols-2 gap-[0.18vw] bg-accent/30">
        <div className="bg-[#0d1f13] p-[3vw]">
          <div className="flex items-center gap-[0.8vw] font-body text-[1.2vw] uppercase tracking-[0.18em] text-[#e8a0a0]">
            <span className="h-[0.6vw] w-[0.6vw] rounded-full bg-[#c03535]" />
            Distressed acquisitions
          </div>
          <p className="mt-[3vh] font-display text-[2.6vw] leading-[1.22] text-text">
            Complexity creates opportunity.
          </p>
          <p className="mt-[3vh] font-body text-[1.65vw] leading-[1.65] text-text/60">
            Distressed acquisitions: creditor pressure, covenant breach, post-bankruptcy assets, receivership, and operational dysfunction
          </p>
        </div>
        <div className="bg-[#0d1f13] p-[3vw]">
          <div className="flex items-center gap-[0.8vw] font-body text-[1.2vw] uppercase tracking-[0.18em] text-[#8ed49e]">
            <span className="h-[0.6vw] w-[0.6vw] rounded-full bg-[#3d9c5a]" />
            Growth-stage acquisitions
          </div>
          <p className="mt-[3vh] font-display text-[2.6vw] leading-[1.22] text-text">
            A brand deserves better ownership.
          </p>
          <p className="mt-[3vh] font-body text-[1.65vw] leading-[1.65] text-text/60">
            Growth-stage acquisitions: CPG brands with $2M–$50M revenue, founder transitions, long-horizon ownership needs, and channel gaps
          </p>
        </div>
      </div>
      <p className="mt-[4vh] max-w-[74vw] font-display text-[2vw] leading-[1.45] text-accent">
        Turnaround-caliber diligence and hands-on operating accountability in both cases
      </p>
    </div>
  );
}