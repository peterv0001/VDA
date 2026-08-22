export default function CapitalProvider() {
  return (
    <div className="deck-grain relative w-screen h-screen overflow-hidden bg-bg px-[7vw] py-[7vh] text-text">
      <div className="absolute left-[7vw] top-0 h-[4vh] w-px bg-accent" />
      <div className="flex items-center gap-[1vw] font-body text-[1.2vw] uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-[3.2vw] bg-accent" />
        Our conviction
      </div>
      <h1 className="mt-[3.5vh] max-w-[70vw] font-display text-[4.8vw] font-bold leading-[1.05] tracking-[-0.05em]">
        More than a capital provider.
      </h1>
      <div className="mt-[6vh] grid grid-cols-[0.75fr_1.55fr] gap-[5vw]">
        <div className="border-l-[0.22vw] border-accent pl-[2vw]">
          <p className="font-display text-[2.4vw] leading-[1.45] text-accent">
            Operating capability belongs at the ownership level — not just at the board level.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-[3vw] gap-y-[3vh]">
          <div className="border-t border-accent/30 pt-[1.8vh]">
            <p className="font-body text-[1.55vw] leading-[1.5] text-text/80">Built by operators who have run factories, restructured supply chains, and rebuilt distribution networks</p>
          </div>
          <div className="border-t border-accent/30 pt-[1.8vh]">
            <p className="font-body text-[1.55vw] leading-[1.5] text-text/80">Permanent capital: hold on our timeline, not a fund calendar</p>
          </div>
          <div className="border-t border-accent/30 pt-[1.8vh]">
            <p className="font-body text-[1.55vw] leading-[1.5] text-text/80">Majority or full control: the authority to act decisively</p>
          </div>
          <div className="border-t border-accent/30 pt-[1.8vh]">
            <p className="font-body text-[1.55vw] leading-[1.5] text-text/80">CPG only: pattern recognition, relationships, and operating depth</p>
          </div>
        </div>
      </div>
      <p className="absolute bottom-[7vh] left-[7vw] right-[7vw] border-t border-accent/30 pt-[2.5vh] font-body text-[1.6vw] uppercase tracking-[0.09em] text-text/65">
        Distressed M&A, turnaround, growth acceleration, operational control, and brand building
      </p>
    </div>
  );
}