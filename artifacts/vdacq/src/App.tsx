import { useState, useEffect } from "react";
import { Router, Route, Switch, useLocation } from "wouter";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Modal } from "./components/Modal";
import Home from "./pages/Home";
import PlatformPage from "./pages/Platform";
import TrackRecordPage from "./pages/TrackRecord";
import TeamPage from "./pages/Team";
import ContactPage from "./pages/Contact";
import FundingPage from "./pages/Funding";
import VelocityOSPage from "./pages/VelocityOS";
import HowWeOperatePage from "./pages/HowWeOperate";
import {
  BookReaderPage,
  ResourceReaderPage,
} from "./pages/OperatingLibraryReaders";
import AdminPage from "./pages/Admin";
import { usePageMeta } from "./lib/usePageMeta";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

const legacyHashRedirects: Record<string, string> = {
  portfolio: "/track-record",
  track: "/track-record",
  team: "/team",
  contact: "/contact",
  manifesto: "/",
  mandate: "/",
  platform: "/platform",
  ctrl: "/platform",
  why: "/platform",
};
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function NotFound() {
  usePageMeta(
    "Page Not Found",
    "The page you are looking for does not exist. Van Dyke Acquisitions — permanent capital, control acquisitions, CPG exclusive.",
  );
  return (
    <>
      <div className="page-head" />
      <section className="manifesto" style={{ minHeight: "50vh" }}>
        <div className="s-in">
          <div className="eyebrow">404</div>
          <div className="s-h">Page not found.</div>
          <p className="s-sub">The page you are looking for does not exist.</p>
        </div>
      </section>
    </>
  );
}

export default function App({ ssrPath }: { ssrPath?: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <Router base={base} ssrPath={ssrPath}>
      <LegacyHashRedirect />
      <ScrollToTop />
      <Switch>
        <Route path="/admin">
          <AdminPage />
        </Route>
        <Route>
          <PublicSite
            modalOpen={modalOpen}
            openModal={openModal}
            closeModal={() => setModalOpen(false)}
          />
        </Route>
      </Switch>
    </Router>
  );
}

function PublicSite({
  modalOpen,
  openModal,
  closeModal,
}: {
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}) {
  const [location] = useLocation();
  const isReaderRoute = [
    "/how-we-operate/book",
    "/how-we-operate/metrics-and-questions",
    "/how-we-operate/rule-book",
    "/how-we-operate/checklist-book",
  ].includes(location);

  return (
    <>
      {!isReaderRoute && <Nav />}
      <Switch>
        <Route path="/">
          <Home onModalOpen={openModal} />
        </Route>
        <Route path="/platform">
          <PlatformPage />
        </Route>
        <Route path="/track-record">
          <TrackRecordPage onModalOpen={openModal} />
        </Route>
        <Route path="/team">
          <TeamPage />
        </Route>
        <Route path="/funding">
          <FundingPage />
        </Route>
        <Route path="/velocity-os">
          <VelocityOSPage />
        </Route>
        <Route path="/how-we-operate">
          <HowWeOperatePage />
        </Route>
        <Route path="/how-we-operate/book">
          <BookReaderPage />
        </Route>
        <Route path="/how-we-operate/metrics-and-questions">
          <ResourceReaderPage resource="metrics-and-questions" />
        </Route>
        <Route path="/how-we-operate/rule-book">
          <ResourceReaderPage resource="rule-book" />
        </Route>
        <Route path="/how-we-operate/checklist-book">
          <ResourceReaderPage resource="checklist-book" />
        </Route>
        <Route path="/contact">
          <ContactPage />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
      {!isReaderRoute && <Footer onModalOpen={openModal} />}
      {!isReaderRoute && modalOpen && <Modal onClose={closeModal} />}
    </>
  );
}

function LegacyHashRedirect() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (location !== "/") return;

    const redirectLegacyHash = () => {
      const hash = window.location.hash.slice(1).toLowerCase();
      const target = legacyHashRedirects[hash];
      if (!target) return;

      if (target === location) {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
        window.scrollTo(0, 0);
        return;
      }

      navigate(target, { replace: true });
    };

    redirectLegacyHash();
    window.addEventListener("hashchange", redirectLegacyHash);
    return () => window.removeEventListener("hashchange", redirectLegacyHash);
  }, [location, navigate]);

  return null;
}
