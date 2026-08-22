export default function OperatingGroup() {
  return (
    <div className="deck-grain relative w-screen h-screen overflow-hidden bg-bg px-[7vw] py-[7vh] text-text">
      <div className="absolute right-[7vw] top-0 h-[11vh] w-px bg-accent" />
      <div className="flex items-center gap-[1vw] font-body text-[1.2vw] uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-[3.2vw] bg-accent" />
        Operating platform
      </div>
      <div className="mt-[3vh] flex items-end justify-between">
        <h1 className="font-display text-[4.8vw] font-bold leading-[1.05] tracking-[-0.05em]">
          The VDA Operating Group.
        </h1>
        <p className="max-w-[25vw] font-body text-[1.45vw] leading-[1.5] text-text/55">
          Dedicated, cross-functional team deployed from day one
        </p>
      </div>
      <div className="mt-[6vh] grid grid-cols-3 gap-px bg-accent/30">
        <div className="bg-bg p-[2vw]">
          <p className="font-body text-[1.05vw] uppercase tracking-[0.18em] text-accent">01</p>
          <p className="mt-[1.3vh] font-display text-[2vw] leading-[1.28]">Portfolio operations & lean</p>
          <p className="mt-[1.3vh] font-body text-[1.35vw] leading-[1.5] text-text/55">Cost structure, throughput, and margin improvement</p>
        </div>
        <div className="bg-bg p-[2vw]">
          <p className="font-body text-[1.05vw] uppercase tracking-[0.18em] text-accent">02</p>
          <p className="mt-[1.3vh] font-display text-[2vw] leading-[1.28]">Brand & revenue growth</p>
          <p className="mt-[1.3vh] font-body text-[1.35vw] leading-[1.5] text-text/55">Retail, DTC, distribution, and performance marketing</p>
        </div>
        <div className="bg-bg p-[2vw]">
          <p className="font-body text-[1.05vw] uppercase tracking-[0.18em] text-accent">03</p>
          <p className="mt-[1.3vh] font-display text-[2vw] leading-[1.28]">Innovation & product</p>
          <p className="mt-[1.3vh] font-body text-[1.35vw] leading-[1.5] text-text/55">Science-led formulation and category whitespace</p>
        </div>
        <div className="bg-bg p-[2vw]">
          <p className="font-body text-[1.05vw] uppercase tracking-[0.18em] text-accent">04</p>
          <p className="mt-[1.3vh] font-display text-[2vw] leading-[1.28]">Technology & systems</p>
          <p className="mt-[1.3vh] font-body text-[1.35vw] leading-[1.5] text-text/55">ERP, data infrastructure, e-commerce platforms, and AI-assisted tooling</p>
        </div>
        <div className="bg-bg p-[2vw]">
          <p className="font-body text-[1.05vw] uppercase tracking-[0.18em] text-accent">05</p>
          <p className="mt-[1.3vh] font-display text-[2vw] leading-[1.28]">Specialty lending</p>
          <p className="mt-[1.3vh] font-body text-[1.35vw] leading-[1.5] text-text/55">PVG Capital: transitional credit and bridge solutions</p>
        </div>
        <div className="bg-bg p-[2vw]">
          <p className="font-body text-[1.05vw] uppercase tracking-[0.18em] text-accent">06</p>
          <p className="mt-[1.3vh] font-display text-[2vw] leading-[1.28]">Turnaround consulting</p>
          <p className="mt-[1.3vh] font-body text-[1.35vw] leading-[1.5] text-text/55">Structured methodology for portfolio and select third-party engagements</p>
        </div>
      </div>
      <p className="mt-[3.2vh] border-l-[0.2vw] border-accent pl-[1.5vw] font-display text-[1.85vw] leading-[1.4] text-accent">
        Proprietary CPG value-creation playbook calibrated to every situation
      </p>
    </div>
  );
}