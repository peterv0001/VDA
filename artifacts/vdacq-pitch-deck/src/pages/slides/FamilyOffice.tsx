export default function FamilyOffice() {
  return (
    <div className="deck-grain relative w-screen h-screen overflow-hidden bg-bg px-[7vw] py-[7vh] text-text">
      <div className="absolute right-[7vw] top-0 h-full w-px bg-accent/15" />
      <div className="flex items-center gap-[1vw] font-body text-[1.2vw] uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-[3.2vw] bg-accent" />
        The platform
      </div>
      <div className="mt-[4vh] flex items-end justify-between">
        <h1 className="max-w-[56vw] font-display text-[4.7vw] font-bold leading-[1.06] tracking-[-0.045em] text-text">
          A family office built to operate.
        </h1>
        <p className="mb-[0.7vh] max-w-[20vw] text-right font-body text-[1.45vw] leading-[1.5] text-text/55">
          Permanent capital with operating authority.
        </p>
      </div>
      <div className="mt-[8vh] grid grid-cols-[1.1fr_1fr_1fr] border-y border-accent/25">
        <div className="border-r border-accent/25 py-[3.5vh] pr-[2.4vw]">
          <p className="font-display text-[8.4vw] font-bold leading-none tracking-[-0.07em] text-accent">20+</p>
          <p className="mt-[1.5vh] font-body text-[1.45vw] uppercase tracking-[0.16em] text-text/60">control acquisitions</p>
        </div>
        <div className="border-r border-accent/25 px-[2.8vw] py-[3.5vh]">
          <p className="font-display text-[8.4vw] font-bold leading-none tracking-[-0.07em] text-accent">10+</p>
          <p className="mt-[1.5vh] font-body text-[1.45vw] uppercase tracking-[0.16em] text-text/60">years of operation</p>
        </div>
        <div className="px-[2.8vw] py-[3.5vh]">
          <p className="font-display text-[5vw] font-bold leading-[0.9] tracking-[-0.06em] text-accent">$5M—$300M</p>
          <p className="mt-[1.5vh] font-body text-[1.45vw] uppercase tracking-[0.16em] text-text/60">annual revenue operated</p>
        </div>
      </div>
      <div className="mt-[5vh] grid grid-cols-[1fr_1.4fr] gap-[6vw]">
        <p className="font-display text-[2.15vw] leading-[1.45] text-text/85">
          CPG exclusive | Permanent capital | One principal
        </p>
        <p className="font-display text-[2.15vw] leading-[1.45] text-accent">
          No fund cycle. No LP pressure. Full accountability.
        </p>
      </div>
      <p className="absolute bottom-[5vh] left-[7vw] font-body text-[1.2vw] uppercase tracking-[0.22em] text-text/35">
        Van Dyke Acquisitions
      </p>
    </div>
  );
}