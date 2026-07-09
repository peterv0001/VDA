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

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function NotFound() {
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

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <Router base={base}>
      <ScrollToTop />
      <Nav />
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
        <Route path="/contact">
          <ContactPage />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
      <Footer onModalOpen={openModal} />
      {modalOpen && <Modal onClose={() => setModalOpen(false)} />}
    </Router>
  );
}
