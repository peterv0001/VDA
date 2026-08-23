import { Link } from "wouter";

export function Footer({ onModalOpen }: { onModalOpen: () => void }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        Van Dyke <span>Acquisitions</span>
      </div>
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/platform">Platform</Link>
        <Link href="/track-record">Track Record</Link>
        <Link href="/team">Team</Link>
        <Link href="/funding">Get Funding</Link>
        <Link href="/how-we-operate">How We Operate</Link>
        <Link href="/velocity-os">Operations Help</Link>
        <Link href="/contact">Contact</Link>
        <button className="footer-access-btn" onClick={onModalOpen}>
          Portfolio Access
        </button>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} Van Dyke Acquisitions LLC. All rights
        reserved.
      </div>
    </footer>
  );
}
