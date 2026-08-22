export default function ControlStandard() {
  return (
    <div className="deck-grain relative w-screen h-screen overflow-hidden bg-bg px-[7vw] py-[7vh] text-text">
      <div className="flex items-center gap-[1vw] font-body text-[1.2vw] uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-[3.2vw] bg-accent" />
        Why control
      </div>
      <h1 className="mt-[3vh] max-w-[65vw] font-display text-[4.6vw] font-bold leading-[1.05] tracking-[-0.05em]">
        Control is a standard
      </h1>
      <h2 className="font-display text-[4.6vw] font-normal italic leading-[1.05] tracking-[-0.05em] text-accent">
        of accountability.
      </h2>
      <div className="mt-[5vh] grid grid-cols-[0.86fr_1.35fr] gap-[6vw]">
        <div>
          <p className="border-y border-accent/30 py-[2.2vh] font-body text-[1.55vw] uppercase tracking-[0.12em] leading-[1.7] text-text/65">
            20+ control positions held | 0 minority stakes | no fund expiry date
          </p>
          <p className="mt-[4vh] font-display text-[2.4vw] leading-[1.42] text-text/85">
            Ownership means direct authority, decisive action, and accountability for outcomes.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-[4vw] gap-y-[2.4vh]">
          <div className="border-t border-accent/35 pt-[1.5vh]">
            <p className="font-body text-[1.45vw] leading-[1.55] text-text/70">Board control and operating authority from close</p>
          </div>
          <div className="border-t border-accent/35 pt-[1.5vh]">
            <p className="font-body text-[1.45vw] leading-[1.55] text-text/70">VDA Operating Group on-site within 30 days when stabilization is needed</p>
          </div>
          <div className="border-t border-accent/35 pt-[1.5vh]">
            <p className="font-body text-[1.45vw] leading-[1.55] text-text/70">Executive placement authority when leadership must change</p>
          </div>
          <div className="border-t border-accent/35 pt-[1.5vh]">
            <p className="font-body text-[1.45vw] leading-[1.55] text-text/70">Direct access to manufacturing, fulfillment, marketplace, and specialty-lending capabilities</p>
          </div>
        </div>
      </div>
    </div>
  );
}