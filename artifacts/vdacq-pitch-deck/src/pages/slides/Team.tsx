export default function Team() {
  return (
    <div className="deck-grain relative w-screen h-screen overflow-hidden bg-bg px-[7vw] py-[7vh] text-text">
      <div className="absolute right-[7vw] top-[7vh] h-[20vh] w-px bg-accent" />
      <div className="flex items-center gap-[1vw] font-body text-[1.2vw] uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-[3.2vw] bg-accent" />
        Leadership
      </div>
      <h1 className="mt-[3vh] font-display text-[4.6vw] font-bold leading-[1.05] tracking-[-0.05em]">
        The operators behind the office.
      </h1>
      <div className="mt-[5vh] grid grid-cols-[1fr_1.7fr] gap-[5vw]">
        <div className="border-y border-accent/30 py-[3vh]">
          <p className="font-body text-[1.15vw] uppercase tracking-[0.18em] text-accent">Founder</p>
          <p className="mt-[1.5vh] font-display text-[2.8vw] leading-[1.2]">Peter Griscom</p>
          <p className="mt-[1.2vh] font-body text-[1.5vw] leading-[1.5] text-text/65">Founder, Principal & Executive Chairman</p>
        </div>
        <div className="grid grid-cols-2 gap-x-[4vw] gap-y-[2.3vh]">
          <div className="border-t border-accent/30 pt-[1.3vh]">
            <p className="font-body text-[1.55vw] font-semibold">John Brady</p>
            <p className="mt-[0.5vh] font-body text-[1.35vw] text-text/60">Chief Operating Officer</p>
          </div>
          <div className="border-t border-accent/30 pt-[1.3vh]">
            <p className="font-body text-[1.55vw] font-semibold">David Bates</p>
            <p className="mt-[0.5vh] font-body text-[1.35vw] text-text/60">President & CFO</p>
          </div>
          <div className="border-t border-accent/30 pt-[1.3vh]">
            <p className="font-body text-[1.55vw] font-semibold">Paul Massingale</p>
            <p className="mt-[0.5vh] font-body text-[1.35vw] text-text/60">Chief Growth Officer</p>
          </div>
          <div className="border-t border-accent/30 pt-[1.3vh]">
            <p className="font-body text-[1.55vw] font-semibold">Steve Jorgensen</p>
            <p className="mt-[0.5vh] font-body text-[1.35vw] text-text/60">SVP, Portfolio Operations</p>
          </div>
          <div className="border-t border-accent/30 pt-[1.3vh]">
            <p className="font-body text-[1.55vw] font-semibold">Michael Maldonado</p>
            <p className="mt-[0.5vh] font-body text-[1.35vw] text-text/60">SVP, Innovation</p>
          </div>
          <div className="border-t border-accent/30 pt-[1.3vh]">
            <p className="font-body text-[1.55vw] font-semibold">Margaret Keene</p>
            <p className="mt-[0.5vh] font-body text-[1.35vw] text-text/60">SVP, Family & Foundation</p>
          </div>
          <div className="border-t border-accent/30 pt-[1.3vh]">
            <p className="font-body text-[1.55vw] font-semibold">Jason Collyer</p>
            <p className="mt-[0.5vh] font-body text-[1.35vw] text-text/60">VP, IT & Development</p>
          </div>
          <div className="border-t border-accent/30 pt-[1.3vh]">
            <p className="font-body text-[1.55vw] font-semibold">Josh Kirkman</p>
            <p className="mt-[0.5vh] font-body text-[1.35vw] text-text/60">VP, Group Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}