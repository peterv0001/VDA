const base = import.meta.env.BASE_URL;

export default function Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <img
        src={`${base}cover-production-line.jpg`}
        crossOrigin="anonymous"
        alt="Beverage production line"
        className="absolute inset-0 h-full w-full object-cover opacity-65"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,10,0.98)_0%,rgba(8,15,10,0.84)_42%,rgba(8,15,10,0.30)_100%)]" />
      <div className="deck-grain absolute inset-0" />
      <div className="absolute left-[7vw] top-0 h-full w-px bg-accent/25" />
      <div className="absolute left-[11vw] top-[11vh] flex items-center gap-[1.1vw] text-[1.5vw] font-body uppercase tracking-[0.24em] text-accent">
        <span className="h-px w-[3.6vw] bg-accent" />
        Control investor
      </div>
      <div className="absolute bottom-[12vh] left-[11vw] max-w-[62vw]">
        <p className="font-display text-[6.5vw] font-bold leading-[0.95] tracking-[-0.055em] text-text">
          Van Dyke
        </p>
        <p className="mt-[0.7vh] font-display text-[6.5vw] font-bold leading-[0.95] tracking-[-0.055em] text-accent">
          Acquisitions
        </p>
        <div className="mt-[4vh] h-px w-[11vw] bg-accent" />
        <p className="mt-[2.8vh] font-body text-[1.5vw] uppercase tracking-[0.16em] text-text/70">
          Control investor | Established 2014 | CPG exclusive
        </p>
      </div>
      <div className="absolute bottom-[11vh] right-[5vw] w-[28vw] border-l border-accent/50 pl-[2vw]">
        <p className="font-display text-[2.25vw] leading-[1.3] text-text">
          We don't advise.
        </p>
        <p className="font-display text-[2.25vw] leading-[1.3] text-text">
          We don't observe.
        </p>
        <p className="font-display text-[2.25vw] leading-[1.3] text-accent">
          We own. We operate.
        </p>
        <p className="mt-[2vh] font-body text-[1.5vw] leading-[1.55] text-text/65">
          Permanent capital for control positions across consumer packaged goods.
        </p>
      </div>
    </div>
  );
}