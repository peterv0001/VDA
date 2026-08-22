export default function Outcomes() {
  return (
    <div className="deck-grain relative w-screen h-screen overflow-hidden bg-bg px-[7vw] py-[7vh] text-text">
      <div className="flex items-center gap-[1vw] font-body text-[1.2vw] uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-[3.2vw] bg-accent" />
        Track record
      </div>
      <div className="mt-[3vh] flex items-end justify-between">
        <h1 className="font-display text-[4.8vw] font-bold leading-[1.05] tracking-[-0.05em]">
          Representative outcomes.
        </h1>
        <p className="mb-[0.5vh] font-display text-[1.85vw] italic text-accent">20+ control acquisitions</p>
      </div>
      <div className="mt-[5vh] grid grid-cols-2 gap-px bg-accent/30">
        <div className="bg-bg p-[2.3vw]">
          <p className="font-display text-[2.2vw] text-accent">One Source</p>
          <p className="mt-[0.8vh] font-body text-[1.25vw] uppercase tracking-[0.13em] text-text/45">Beverage manufacturing | $50M–$150M</p>
          <p className="mt-[1.8vh] font-body text-[1.5vw] leading-[1.5] text-text/75">Complete operational turnaround; exited 2019</p>
        </div>
        <div className="bg-bg p-[2.3vw]">
          <p className="font-display text-[2.2vw] text-accent">Tiger Logistics Group</p>
          <p className="mt-[0.8vh] font-body text-[1.25vw] uppercase tracking-[0.13em] text-text/45">Consumer goods distribution | $20M–$80M</p>
          <p className="mt-[1.8vh] font-body text-[1.5vw] leading-[1.5] text-text/75">National distribution restored within 18 months; exited 2017</p>
        </div>
        <div className="bg-bg p-[2.3vw]">
          <p className="font-display text-[2.2vw] text-accent">EFX Brands</p>
          <p className="mt-[0.8vh] font-body text-[1.25vw] uppercase tracking-[0.13em] text-text/45">Functional nutrition | $5M–$70M</p>
          <p className="mt-[1.8vh] font-body text-[1.5vw] leading-[1.5] text-text/75">Revenue tripled in 24 months; exited 2014</p>
        </div>
        <div className="bg-bg p-[2.3vw]">
          <p className="font-display text-[2.2vw] text-accent">G3 (Pure) Manufacturing</p>
          <p className="mt-[0.8vh] font-body text-[1.25vw] uppercase tracking-[0.13em] text-text/45">Consumer manufacturing | $100M–$300M</p>
          <p className="mt-[1.8vh] font-body text-[1.5vw] leading-[1.5] text-text/75">Bridge lending converted to control; strategic exit achieved in 2019</p>
        </div>
      </div>
      <p className="absolute bottom-[5.5vh] left-[7vw] font-body text-[1.2vw] tracking-[0.08em] text-text/35">
        Revenue ranges approximate; full details available to qualified counterparties under NDA
      </p>
    </div>
  );
}