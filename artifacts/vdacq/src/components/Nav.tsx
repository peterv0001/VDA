import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

const links: [string, string][] = [
  ["/", "Home"],
  ["/platform", "Platform"],
  ["/track-record", "Track Record"],
  ["/team", "Team"],
  ["/contact", "Contact"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [location, navigate] = useLocation();
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <Link href="/" className="nav-brand">
        <div className="nav-wordmark">
          Van Dyke <span>Acquisitions</span>
        </div>
        <div className="nav-sub">
          CPG Family Office &middot; Control Investor &middot; Est. 2014
        </div>
      </Link>
      <div className="nav-links">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${location === href ? " active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>
      <button className="nav-cta" onClick={() => navigate("/contact")}>
        Introduce a Situation
      </button>
    </nav>
  );
}
