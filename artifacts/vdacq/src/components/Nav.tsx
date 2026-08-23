import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "wouter";

const links: [string, string][] = [
  ["/", "Home"],
  ["/platform", "Platform"],
  ["/track-record", "Track Record"],
  ["/team", "Team"],
  ["/funding", "Get Funding"],
  ["/how-we-operate", "How We Operate"],
  ["/velocity-os", "Operations Help"],
  ["/contact", "Contact"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const burgerButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const wasMenuOpen = useRef(false);
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
  useLayoutEffect(() => {
    if (!menuOpen) return;

    const menu = mobileMenuRef.current;
    if (!menu) return;

    const getFocusableElements = () =>
      Array.from(
        menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

    const focusTimer = window.setTimeout(() => {
      getFocusableElements()[0]?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);
  useLayoutEffect(() => {
    if (!menuOpen && wasMenuOpen.current) {
      burgerButtonRef.current?.focus();
    }
    wasMenuOpen.current = menuOpen;
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
      <Link href="/contact" className="nav-cta">
        Introduce a Situation
      </Link>
      <button
        ref={burgerButtonRef}
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
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
        aria-label="Mobile navigation"
        aria-modal="true"
        role="dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) setMenuOpen(false);
        }}
      >
        <div className="mobile-menu-content">
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
          <Link href="/contact" className="mobile-menu-cta">
            Introduce a Situation
          </Link>
        </div>
      </div>
    </nav>
  );
}
