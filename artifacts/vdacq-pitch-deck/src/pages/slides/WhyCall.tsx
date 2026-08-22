export default function WhyCall() {
  return (
    <div className="deck-grain relative w-screen h-screen overflow-hidden bg-bg px-[7vw] py-[7vh] text-text">
      <div className="flex items-center gap-[1vw] font-body text-[1.2vw] uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-[3.2vw] bg-accent" />
        Why Van Dyke
      </div>
      <h1 className="mt-[3vh] max-w-[68vw] font-display text-[4.6vw] font-bold leading-[1.05] tracking-[-0.05em]">
        Why serious counterparties call us.
      </h1>
      <div className="mt-[6vh] grid grid-cols-2 gap-x-[5vw] gap-y-[4vh]">
        <div className="grid grid-cols-[5vw_1fr] border-t border-accent/30 pt-[2vh]">
          <p className="font-display text-[3.5vw] leading-none text-accent">I</p>
          <div>
            <p className="font-display text-[2vw] leading-[1.25]">We move without committees</p>
            <p className="mt-[1.2vh] font-body text-[1.45vw] leading-[1.55] text-text/60">We move without committees: a single family principal, no LP approval, no investment committee</p>
          </div>
        </div>
        <div className="grid grid-cols-[5vw_1fr] border-t border-accent/30 pt-[2vh]">
          <p className="font-display text-[3.5vw] leading-none text-accent">II</p>
          <div>
            <p className="font-display text-[2vw] leading-[1.25]">We have operated what we acquire</p>
            <p className="mt-[1.2vh] font-body text-[1.45vw] leading-[1.55] text-text/60">We have operated what we acquire: manufacturing, retail, distribution, and DTC from the operator’s chair</p>
          </div>
        </div>
        <div className="grid grid-cols-[5vw_1fr] border-t border-accent/30 pt-[2vh]">
          <p className="font-display text-[3.5vw] leading-none text-accent">III</p>
          <div>
            <p className="font-display text-[2vw] leading-[1.25]">We solve situations others decline</p>
            <p className="mt-[1.2vh] font-body text-[1.45vw] leading-[1.55] text-text/60">We solve situations others decline: complex capital structures, broken operations, and difficult transitions</p>
          </div>
        </div>
        <div className="grid grid-cols-[5vw_1fr] border-t border-accent/30 pt-[2vh]">
          <p className="font-display text-[3.5vw] leading-none text-accent">IV</p>
          <div>
            <p className="font-display text-[2vw] leading-[1.25]">We own outcomes, not just positions</p>
            <p className="mt-[1.2vh] font-body text-[1.45vw] leading-[1.55] text-text/60">We own outcomes, not just positions: control, accountability, and a long-term holding horizon</p>
          </div>
        </div>
      </div>
    </div>
  );
}