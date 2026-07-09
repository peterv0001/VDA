import { useReveal } from "../lib/useReveal";

export default function TeamPage() {
  useReveal();
  const members = [
    {
      init: "PG",
      name: "Peter Griscom",
      role: "Founder, Principal & Executive Chairman",
      badge: "Founded Van Dyke Acquisitions in 2014",
      founder: true,
    },
    { init: "JB", name: "John Brady", role: "Chief Operating Officer", badge: "Operations" },
    { init: "DB", name: "David Bates", role: "President & CFO", badge: "Finance" },
    { init: "PM", name: "Paul Massingale", role: "Chief Growth Officer", badge: "Growth" },
    { init: "SJ", name: "Steve Jorgensen", role: "SVP, Portfolio Operations", badge: "Portfolio" },
    { init: "MM", name: "Michael Maldonado", role: "SVP, Innovation", badge: "Innovation" },
    { init: "MK", name: "Margaret Keene", role: "SVP, Family & Foundation", badge: "Family Office" },
    { init: "JC", name: "Jason Collyer", role: "VP, IT & Development", badge: "Technology" },
    { init: "JK", name: "Josh Kirkman", role: "VP, Group Revenue", badge: "Revenue" },
  ];
  const founder = members[0];
  const rest = members.slice(1);
  return (
    <>
      <div className="page-head" />
      <section className="team" id="team">
        <div className="s-in">
          <div className="rv">
            <div className="eyebrow">Leadership</div>
            <div className="s-h">The operators behind the office.</div>
            <p className="s-sub">
              A senior team spanning acquisitions, operations, technology, revenue, and portfolio
              management — unified by a decade of shared experience in consumer goods.
            </p>
          </div>
          <div className="team-grid rv">
            <div className="tmc founder">
              <div className="founder-init">{founder.init}</div>
              <div>
                <div className="founder-name">{founder.name}</div>
                <div className="founder-role">{founder.role}</div>
                <div className="founder-note">{founder.badge}</div>
              </div>
            </div>
            {rest.map((m) => (
              <div key={m.init} className="tmc">
                <div className="tmc-init">{m.init}</div>
                <div className="tmc-name">{m.name}</div>
                <div className="tmc-role">{m.role}</div>
                <div className="tmc-badge">{m.badge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
