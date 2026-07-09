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
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
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
      <button
        className={`nav-burger${menuOpen ? " open" : ""}`}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-links">
          {links.map(([href, label], i) => (
            <Link
              key={href}
              href={href}
              className={`mobile-menu-link${location === href ? " active" : ""}`}
              style={{ transitionDelay: menuOpen ? `${0.08 + i * 0.05}s` : "0s" }}
            >
              <span className="mobile-menu-num">0{i + 1}</span>
              {label}
            </Link>
          ))}
        </div>
        <button
          className="mobile-menu-cta"
          onClick={() => navigate("/contact")}
        >
          Introduce a Situation
        </button>
      </div>
    </nav>
  );
}
