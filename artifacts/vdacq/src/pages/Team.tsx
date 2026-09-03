import { useReveal } from "../lib/useReveal";
import { usePageMeta } from "../lib/usePageMeta";
import { PAGE_META } from "../lib/pageMeta";

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

export default function TeamPage() {
  usePageMeta(PAGE_META["/team"].title, PAGE_META["/team"].description);
  useReveal();
  const founder = members[0];
  const rest = members.slice(1);
  return (
    <>
      <div className="page-head" />
      <section className="team" id="team">
        <div className="s-in">
          <div className="rv">
            <div className="eyebrow">Leadership</div>
            <h1 className="s-h">The operators behind the office.</h1>
            <p className="s-sub">
              A senior team spanning acquisitions, operations, technology,
              revenue, and portfolio management, unified by a decade of shared
              experience in consumer goods.
            </p>
          </div>

          <div className="team-founder rv">
            <div className="founder-init" aria-hidden="true">
              {founder.init}
            </div>
            <div>
              <div className="founder-name">{founder.name}</div>
              <div className="founder-role">{founder.role}</div>
              <div className="founder-note">{founder.badge}</div>
            </div>
          </div>

          <div className="team-roster rv" role="list" aria-label="Leadership team">
            <div className="team-roster-head" aria-hidden="true">
              <span />
              <span>Name</span>
              <span>Role</span>
              <span>Discipline</span>
            </div>
            {rest.map((m) => (
              <div key={m.init} className="tmc" role="listitem">
                <div className="tmc-init" aria-hidden="true">
                  {m.init}
                </div>
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
