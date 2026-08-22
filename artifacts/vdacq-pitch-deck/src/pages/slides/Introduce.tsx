export default function Introduce() {
  return (
    <div className="deck-grain relative w-screen h-screen overflow-hidden bg-bg px-[7vw] py-[7vh] text-text">
      <div className="absolute left-[7vw] top-0 h-full w-px bg-accent/25" />
      <div className="absolute right-[7vw] top-[7vh] font-body text-[1.2vw] uppercase tracking-[0.22em] text-text/35">
        Van Dyke Acquisitions
      </div>
      <div className="relative max-w-[70vw] pt-[8vh]">
        <div className="flex items-center gap-[1vw] font-body text-[1.2vw] uppercase tracking-[0.22em] text-accent">
          <span className="h-px w-[3.2vw] bg-accent" />
          Start a conversation
        </div>
        <h1 className="mt-[3vh] font-display text-[6vw] font-bold leading-[0.98] tracking-[-0.06em]">
          Introduce a situation.
        </h1>
      </div>
      <div className="mt-[6vh] grid grid-cols-2 gap-x-[6vw] gap-y-[2.6vh]">
        <p className="border-t border-accent/30 pt-[1.6vh] font-body text-[1.6vw] leading-[1.5] text-text/70">M&A advisors and investment bankers with a sell-side CPG mandate</p>
        <p className="border-t border-accent/30 pt-[1.6vh] font-body text-[1.6vw] leading-[1.5] text-text/70">Founders and owners exploring a full or majority sale</p>
        <p className="border-t border-accent/30 pt-[1.6vh] font-body text-[1.6vw] leading-[1.5] text-text/70">Creditors, trustees, and receivers seeking a qualified buyer</p>
        <p className="border-t border-accent/30 pt-[1.6vh] font-body text-[1.6vw] leading-[1.5] text-text/70">PE firms and family offices seeking co-investment, co-underwriting, or a permanent-capital exit partner</p>
      </div>
      <div className="absolute bottom-[8vh] left-[7vw] right-[7vw] flex items-end justify-between border-t border-accent pt-[3vh]">
        <p className="font-display text-[2.4vw] text-accent">deals@vdacq.com | (217) 486-1588</p>
        <p className="font-body text-[1.45vw] tracking-[0.08em] text-text/55">We respond within one business day.</p>
      </div>
    </div>
  );
}