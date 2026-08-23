import { Link } from "wouter";
import { usePageMeta } from "../lib/usePageMeta";
import { useReveal } from "../lib/useReveal";
import { PAGE_META } from "../lib/pageMeta";

export default function HowWeOperatePage() {
  usePageMeta(
    PAGE_META["/how-we-operate"].title,
    PAGE_META["/how-we-operate"].description,
  );
  useReveal();

  return (
    <>
      <div className="page-head" />

      <section className="hwo-hero">
        <div className="s-in hwo-hero-in rv">
          <div className="eyebrow light">Transparency Library</div>
          <h1 className="s-h">
            How We Operate
          </h1>
          <p className="hwo-hero-sub">
            An intentional public library for the principles, measures, decision
            rules, and checklists we believe contribute to durable performance.
          </p>
        </div>
      </section>

      <section className="hwo-intro">
        <div className="s-in hwo-intro-grid rv">
          <div className="hwo-intro-pull">
            We publish our operating system because execution should not be a
            secret. For serious operators, transparency creates alignment.
          </div>
          <div className="hwo-intro-body">
            <p>
              The materials in this library represent our standard work—the
              principles, rules, and pocket questions that govern daily
              reality. They were built to solve specific problems: founder
              bottlenecks, activity without signal, growth without leverage,
              and capital without learning.
            </p>
            <p>
              We make these resources public for founders, partners, and
              operators who value rigorous execution. A truth-forward culture
              requires shared facts and clear frameworks. This is ours.
            </p>
          </div>
        </div>
      </section>

      <section className="hwo-main">
        <div className="s-in rv">
          <div className="eyebrow">The Foundation</div>
          <div className="hwo-main-card">
            <div className="hwo-main-img">
              <div className="hwo-main-img-inner">
                <span>Illustrated Edition</span>
                <h3>The Velocity Operating System</h3>
              </div>
            </div>
            <div className="hwo-main-content">
              <h2>The Illustrated Book</h2>
              <div className="hwo-author">By Peter V. Griscom</div>
              <p>
                The complete illustrated book is the starting point for
                understanding the model: lean survivorship, convex bets, and
                AI as enterprise electricity. It connects a disciplined inside
                of the firm to a power-law outside.
              </p>
              <p className="hwo-thesis">
                <strong>The operating thesis:</strong> run the inside like
                Toyota, position the outside like Sequoia, and power both with
                AI as enterprise electricity.
              </p>
              <div>
                <Link href="/how-we-operate/book" className="btn-gold">
                  Read the complete book
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hwo-refs">
        <div className="s-in rv">
          <div className="eyebrow">Field References</div>
          <h2 className="hwo-section-title">Public operating manuals</h2>
          <p className="hwo-chapter-intro">
            Five parts and 16 chapters move from first principles to the
            operating model, growth evidence, talent and governance, and
            installation. Start with the book for the model, then use the field
            references when the work calls for a measure, rule, or repeatable
            practice.
          </p>
          <div className="hwo-refs-grid">
            <Link
              href="/how-we-operate/metrics-and-questions"
              className="hwo-ref-card"
              aria-label="Metrics & Questions"
            >
              <div className="hwo-ref-card-num">01</div>
              <h3>Metrics & Questions</h3>
              <p>
                 What to measure and ask: leading indicators and pocket
                 questions that force evidence, ownership, and survivorship.
              </p>
              <div className="hwo-ref-link">Explore</div>
            </Link>
            
            <Link
              href="/how-we-operate/rule-book"
              className="hwo-ref-card"
              aria-label="Rule Book"
            >
              <div className="hwo-ref-card-num">02</div>
              <h3>Rule Book</h3>
              <p>
                 How to decide: cited decision rules and governance guardrails
                 that keep the system intact.
              </p>
              <div className="hwo-ref-link">Explore</div>
            </Link>

            <Link
              href="/how-we-operate/checklist-book"
              className="hwo-ref-card"
              aria-label="Checklist Book"
            >
              <div className="hwo-ref-card-num">03</div>
              <h3>Checklist Book</h3>
              <p>
                 How to repeat: execution and review checklists that turn
                 operating discipline into a durable habit.
              </p>
              <div className="hwo-ref-link">Explore</div>
            </Link>
          </div>
        </div>
      </section>

      <section className="hwo-cross">
        <div className="s-in hwo-cross-inner rv">
          <div className="eyebrow light hwo-cross-eyebrow">Implementation</div>
          <h2>Looking for the Daily Journal?</h2>
          <p>
            The Operator's Daily Journal remains a separate, email-unlocked
            resource for ownership groups and leadership teams that want to
            turn principles into owned daily actions.
          </p>
          <Link href="/velocity-os" className="btn-outline">
            Operations Help & Journal
          </Link>
        </div>
      </section>
    </>
  );
}
