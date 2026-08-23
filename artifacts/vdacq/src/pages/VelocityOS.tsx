import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "wouter";
import {
  downloadVelocityOsJournal,
  useCreateVelocityOsIntake,
  useUnlockVelocityOsJournal,
} from "@workspace/api-client-react";
import { useReveal } from "../lib/useReveal";
import { usePageMeta } from "../lib/usePageMeta";
import { PAGE_META } from "../lib/pageMeta";

type Urgency =
  | "immediate"
  | "this-quarter"
  | "next-six-months"
  | "exploring";

const PREVIEW_PAGES = [
  {
    title: "Cover",
    description:
      "The Operator's Daily Journal cover: 365 days, 52 modules, four quarterly resets, and one principle, question, and action each day.",
  },
  {
    title: "Opening principle",
    description:
      "The journal's opening maxim: run the inside like Toyota and position the outside like Sequoia.",
  },
  {
    title: "Title page",
    description:
      "The Operator's Daily Journal, built on The Velocity Operating System version 3.0.",
  },
  {
    title: "About this edition",
    description:
      "How 365 days are sequenced into 52 modules across Foundation, Core, Applied, and Advanced levels.",
  },
  {
    title: "How to use this journal",
    description:
      "The 20-minute daily loop, weekly review, quarterly reset, and guidance to write numbers rather than adjectives.",
  },
  {
    title: "The Operating Constitution",
    description:
      "Eight principles covering distribution realism, survivorship, learning velocity, traceability, evidence, capital, standard work, and truth.",
  },
  {
    title: "Non-negotiables and pocket questions",
    description:
      "Nine operating rules and twelve questions used to force evidence, ownership, survivorship, and pre-registered decisions.",
  },
  {
    title: "Your baseline — Day Zero",
    description:
      "A numbers-only baseline for runway, concentration, decision latency, tests shipped, kill rate, revenue per employee, and the binding constraint.",
  },
  {
    title: "Day 001 — Strategy Begins With the Distribution",
    description:
      "A daily principle, operator question, before-noon action, operating checklist, and evening calibration.",
  },
  {
    title: "Day 002 — Model the Domain",
    description:
      "A Foundation-level daily entry that turns distribution realism into a concrete operating action.",
  },
  {
    title: "Day 003",
    description:
      "A Week 01 Foundation entry with a sourced principle, operator question, action, checklist, and evening review.",
  },
  {
    title: "Day 004",
    description:
      "A Week 01 Foundation entry showing the repeated standard-work structure of the daily loop.",
  },
  {
    title: "Day 005",
    description:
      "A Week 01 Foundation entry for applying the system before reactive work begins.",
  },
  {
    title: "Day 006",
    description:
      "A Week 01 Foundation entry connecting one measurable action to daily operating checks.",
  },
  {
    title: "Day 007",
    description:
      "The final daily entry in Week 01 before the first weekly review converts the entries into a decision.",
  },
  {
    title: "Weekly Review — Week 01",
    description:
      "Ship-list hit rate, kills and verdicts, deposits, runway and covenant checks, next week's single play, and the lesson that changes how the operator works.",
  },
  {
    title: "Day 008",
    description:
      "The first Week 02 Foundation entry, continuing the principle-question-action cadence.",
  },
  {
    title: "Day 009",
    description:
      "A Week 02 entry with one operating question, one action, the daily checklist, and an evening calibration.",
  },
  {
    title: "Day 010",
    description:
      "A Week 02 entry that applies the system to a measurable operating constraint.",
  },
  {
    title: "Day 011 — Which Tail Are We Failing to Feed?",
    description:
      "A driver-tree question decomposing revenue into reach, per-unit productivity, and price and mix.",
  },
] as const;

function statusCode(error: unknown): number | undefined {
  if (!error || typeof error !== "object" || !("status" in error)) {
    return undefined;
  }
  return typeof error.status === "number" ? error.status : undefined;
}

export default function VelocityOSPage() {
  usePageMeta(PAGE_META["/velocity-os"].title, PAGE_META["/velocity-os"].description);
  useReveal();

  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [titleRole, setTitleRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyContext, setCompanyContext] = useState("");
  const [primaryChallenge, setPrimaryChallenge] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [urgency, setUrgency] = useState<Urgency | "">("");
  const [validationError, setValidationError] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = PREVIEW_PAGES.length;

  const [unlockEmail, setUnlockEmail] = useState("");
  const [unlockValidationError, setUnlockValidationError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const unlockErrorRef = useRef<HTMLParagraphElement>(null);
  const unlockMutation = useUnlockVelocityOsJournal();

  const mutation = useCreateVelocityOsIntake();

  useEffect(() => {
    if (validationError || mutation.isError) {
      errorRef.current?.focus();
    }
  }, [mutation.isError, validationError]);

  useEffect(() => {
    if (unlockValidationError || unlockMutation.isError || downloadError) {
      unlockErrorRef.current?.focus();
    }
  }, [downloadError, unlockMutation.isError, unlockValidationError]);

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    const email = unlockEmail.trim();
    setUnlockValidationError("");
    setDownloadError("");
    unlockMutation.reset();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setUnlockValidationError(
        "Enter a valid email address to unlock the complete journal.",
      );
      return;
    }

    unlockMutation.mutate({ data: { email } });
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((page) => page + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((page) => page - 1);
  };

  const handleJournalDownload = async () => {
    const unlock = unlockMutation.data;
    if (!unlock) return;

    const token = unlock.downloadUrl.split("/").filter(Boolean).at(-1);
    if (!token) {
      setDownloadError(
        "This download link could not be used. Create a fresh link and try again.",
      );
      return;
    }

    setDownloadError("");
    setIsDownloading(true);
    try {
      const journal = await downloadVelocityOsJournal(token);
      const objectUrl = URL.createObjectURL(journal);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = unlock.document.filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
    } catch (error) {
      setDownloadError(
        statusCode(error) === 410
          ? "This 10-minute download link has expired. Create a fresh link to continue."
          : "The download was interrupted or is temporarily unavailable. Try again, or create a fresh link.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const resetJournalUnlock = () => {
    setDownloadError("");
    setUnlockValidationError("");
    unlockMutation.reset();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");
    mutation.reset();

    const trimmed = {
      fullName: fullName.trim(),
      workEmail: workEmail.trim(),
      titleRole: titleRole.trim(),
      companyName: companyName.trim(),
      companyContext: companyContext.trim(),
      primaryChallenge: primaryChallenge.trim(),
      desiredOutcome: desiredOutcome.trim(),
    };

    if (
      !trimmed.fullName ||
      !trimmed.workEmail ||
      !trimmed.titleRole ||
      !trimmed.companyName ||
      !trimmed.companyContext ||
      !trimmed.primaryChallenge ||
      !trimmed.desiredOutcome ||
      !urgency
    ) {
      setValidationError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.workEmail)) {
      setValidationError("Please enter a valid work email address.");
      return;
    }

    if (
      trimmed.companyContext.length < 20 ||
      trimmed.primaryChallenge.length < 20 ||
      trimmed.desiredOutcome.length < 20
    ) {
      setValidationError(
        "Please provide at least 20 characters for the context, challenge, and outcome fields.",
      );
      return;
    }

    if (companyWebsite.trim()) {
      try {
        const website = new URL(companyWebsite.trim());
        if (!["http:", "https:"].includes(website.protocol)) {
          throw new Error("Unsupported protocol");
        }
      } catch {
        setValidationError(
          "Please enter a complete company website, including https://.",
        );
        return;
      }
    }

    mutation.mutate({
      data: {
        ...trimmed,
        phone: phone.trim() || undefined,
        companyWebsite: companyWebsite.trim() || undefined,
        urgency,
      },
    });
  };

  const scrollToIntake = () => {
    document.getElementById("intake-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToJournal = () => {
    document.getElementById("journal")?.scrollIntoView({ behavior: "smooth" });
  };

  const currentPreviewPage =
    PREVIEW_PAGES[currentPage - 1] ?? PREVIEW_PAGES[0];

  return (
    <>
      <div className="page-head" />

      <section className="vos-hero">
        <div className="s-in rv">
          <div className="eyebrow">Velocity OS</div>
          <h1 className="s-h">
            Execution is not an accident. <span className="accent">It is a system.</span>
          </h1>
          <p className="vos-sub">
            Velocity OS is our proprietary operating model, designed for owners and operators whose companies need clearer accountability and repeatable execution. It bridges the gap between high-level strategy and daily reality.
          </p>
          <div className="vos-hero-cta">
            <button onClick={scrollToIntake} className="btn-gold">
              Get help with my operations
            </button>
            <Link href="/how-we-operate" className="btn-outline-dark">
              Explore the open library
            </Link>
            <button onClick={scrollToJournal} className="btn-outline-dark">
              Preview the daily journal
            </button>
          </div>
        </div>
      </section>

      <section className="vos-outcomes">
        <div className="s-in">
          <div className="vos-outcomes-head rv">
            <div className="eyebrow">Built for operators</div>
            <h2 className="s-h">
              Close the gap between strategy and operating reality.
            </h2>
            <p className="s-sub">
              Velocity OS is designed for ownership groups and leadership teams
              facing complexity that has outgrown informal management.
            </p>
          </div>
          <div className="vos-outcome-grid rv">
            {[
              [
                "Founder bottlenecks",
                "Move decisions out of one person’s head and into clear ownership, authority, and accountability.",
              ],
              [
                "Activity without signal",
                "Connect daily work to the leading indicators that explain revenue, margin, and cash performance.",
              ],
              [
                "Growth without leverage",
                "Turn what works into standard work, durable systems, and operating capacity that compounds.",
              ],
              [
                "Capital without learning",
                "Treat initiatives as testable decisions so resources follow evidence rather than momentum.",
              ],
            ].map(([title, description]) => (
              <article className="vos-outcome-card" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <div className="vos-engagement rv">
            <span>How an initial engagement begins</span>
            <p>
              We start by understanding the operating constraint, the outcomes
              ownership needs, and where execution is breaking down. From there,
              we determine whether a focused Velocity OS working relationship is
              the right fit.
            </p>
          </div>
        </div>
      </section>

      <section className="vos-pillars">
        <div className="s-in rv">
          <div className="eyebrow light">The Pillars</div>
          <h2 className="vos-h2">A framework for truth and velocity.</h2>
          <div className="vos-grid">
            {[
              {
                title: "Decision Rights & Ownership",
                desc: "Clear mandates eliminate consensus-driven paralysis. Every outcome has a single owner.",
              },
              {
                title: "Operating Cadence",
                desc: "A rhythmic, structured sequence of meetings and reviews that forces issues to the surface quickly.",
              },
              {
                title: "Driver-Tree Measurement",
                desc: "We measure the leading indicators that create value, not just the trailing financial results.",
              },
              {
                title: "Disciplined Experimentation & Capital Allocation",
                desc: "Capital flows to what works. We place small bets, measure obsessively, and scale winners.",
              },
              {
                title: "Standard Work",
                desc: "Repeatable processes reduce variance. We document what works so the organization can scale without breaking.",
              },
              {
                title: "Operating Leverage",
                desc: "Building systems that allow revenue to grow faster than expenses through technology and process design.",
              },
              {
                title: "Truth-Forward Culture",
                desc: "Bad news travels fast. We confront brutal facts without blame, enabling rapid course correction.",
              },
            ].map((pillar, i) => (
              <div key={i} className="vos-card">
                <div className="vos-card-num">0{i + 1}</div>
                <h3 className="vos-card-t">{pillar.title}</h3>
                <p className="vos-card-d">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="vos-journal"
        id="journal"
        aria-labelledby="journal-heading"
      >
        <div className="s-in rv">
          <div className="eyebrow">The Operator's Daily Journal</div>
          <h2 className="vos-h2" id="journal-heading">
            Execution is not a concept.
            <br />
            It is a daily practice.
          </h2>
          <div className="vos-journal-intro">
            <p>
              The Operator's Daily Journal is the physical manifestation of
              Velocity OS. It turns principles into owned actions, installs an
              operating cadence, makes driver-tree measures visible, and turns
              experimentation and capital allocation into pre-registered
              decisions. Repetition creates standard work and operating leverage;
              the reviews create a truth-forward culture.
            </p>
            <div className="vos-j-stats">
              <div className="vjs-item"><strong>365</strong> Daily Entries</div>
              <div className="vjs-item"><strong>52</strong> Weekly Modules</div>
              <div className="vjs-item"><strong>4</strong> Quarterly Resets</div>
              <div className="vjs-item">
                <strong>4</strong> Foundation → Advanced
              </div>
              <div className="vjs-item"><strong>≈20</strong> Min. Daily Loop</div>
            </div>
          </div>

          <div className="vos-j-grid">
            <div className="vjg-col">
              <h3>The Daily Loop</h3>
              <p><strong>Morning:</strong> One principle, one operator question, one action. A focused daily checklist to set the trajectory.</p>
              <p><strong>Evening:</strong> Evening calibration. What moved? What did you buy versus earn? What did you get wrong?</p>
            </div>
            <div className="vjg-col">
              <h3>The Weekly Review</h3>
              <p>Every seventh day forces a look at the data: ship-list hit rate, learning velocity, kills, cash/covenant checks, and the single play for next week.</p>
            </div>
            <div className="vjg-col">
              <h3>The Quarterly Reset</h3>
              <p>Four times a year, the journal stops for a full reset. A convexity audit, kill list, and a prediction review against your pre-registered decision criteria.</p>
            </div>
          </div>

          <div
            className="vos-j-viewer"
            data-testid="viewer"
            role="region"
            aria-labelledby="preview-heading"
            aria-describedby="preview-page-summary"
          >
            <div className="vjv-header">
              <h3 className="vjv-title" id="preview-heading">
                Preview: First 20 Physical Pages
              </h3>
              <span className="vjv-status" data-testid="page-status" aria-live="polite">Page {currentPage} of {totalPages}</span>
            </div>
            <div className="vjv-body">
              <button
                className="vjv-btn"
                onClick={prevPage}
                disabled={currentPage === 1}
                data-testid="previous"
                aria-label="Previous page"
              >
                &larr;
              </button>
              <div className="vjv-img-wrap">
                <img
                  key={currentPage}
                  src={`/velocity-os-journal/pages/page-${String(currentPage).padStart(2, "0")}.png`}
                  alt={`${currentPreviewPage.title}. ${currentPreviewPage.description}`}
                  className="vjv-img"
                  data-testid="page-image"
                  width="918"
                  height="1188"
                />
              </div>
              <button
                className="vjv-btn"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                data-testid="next"
                aria-label="Next page"
              >
                &rarr;
              </button>
            </div>
            <p className="vjv-page-summary" id="preview-page-summary">
              <strong>{currentPreviewPage.title}.</strong>{" "}
              {currentPreviewPage.description}
            </p>
            <div className="vjv-fallback">
              <a
                href="/velocity-os-journal/operators-daily-journal-preview.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open the 20-page preview PDF
              </a>
            </div>
            <details className="vjv-transcript">
              <summary>Read a text guide to all 20 preview pages</summary>
              <ol>
                {PREVIEW_PAGES.map((page, index) => (
                  <li key={page.title}>
                    <strong>Page {index + 1}: {page.title}</strong>
                    <span>{page.description}</span>
                  </li>
                ))}
              </ol>
            </details>
          </div>

          <div className="vos-j-gate">
            <h3>Unlock the Complete Journal</h3>
            <p>
              Enter your email for immediate access to the complete 440-page
              Operator&apos;s Daily Journal. No account or email verification is
              required.
            </p>

            {unlockMutation.isSuccess && unlockMutation.data ? (
              <div className="vjg-success" data-testid="unlock-status" role="status" aria-live="polite">
                <h4>Unlocked successfully</h4>
                <p>{unlockMutation.data.message}</p>
                <button
                  type="button"
                  className="btn-gold"
                  onClick={handleJournalDownload}
                  disabled={isDownloading}
                >
                  {isDownloading
                    ? "Preparing download..."
                    : `Download ${unlockMutation.data.document.title}`}
                </button>
                {downloadError && (
                  <p
                    className="form-error vjg-download-error"
                    role="alert"
                    ref={unlockErrorRef}
                    tabIndex={-1}
                  >
                    {downloadError}
                  </p>
                )}
                {downloadError && (
                  <button
                    type="button"
                    className="vjg-new-link"
                    onClick={resetJournalUnlock}
                  >
                    Create a fresh link
                  </button>
                )}
              </div>
            ) : (
              <form
                className="vjg-form"
                onSubmit={handleUnlock}
                noValidate
                aria-busy={unlockMutation.isPending}
              >
                <label className="vjg-label" htmlFor="journal-email">
                  Email address
                </label>
                <div className="vjg-f-row">
                  <input
                    id="journal-email"
                    type="email"
                    className="cf-input"
                    placeholder="Work Email"
                    value={unlockEmail}
                    onChange={e => setUnlockEmail(e.target.value)}
                    required
                    data-testid="email"
                    aria-label="Email address for journal download"
                  />
                  <button
                    type="submit"
                    className="btn-gold"
                    disabled={unlockMutation.isPending}
                    data-testid="unlock-button"
                  >
                    {unlockMutation.isPending ? "Unlocking..." : "Unlock Journal"}
                  </button>
                </div>
                {(unlockValidationError || unlockMutation.isError) && (
                  <p
                    className="form-error vjg-form-error"
                    role="alert"
                    data-testid="unlock-status"
                    ref={unlockErrorRef}
                    tabIndex={-1}
                  >
                    {unlockValidationError ||
                      (statusCode(unlockMutation.error) === 503
                        ? "The journal is temporarily unavailable. Please try again in a few minutes."
                        : "We could not save your request. Please check your email and try again.")}
                  </p>
                )}
                <p className="vjg-privacy">
                  We collect your email only to record access to this resource
                  and unlock the download. This does not subscribe you to
                  marketing communications.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="vos-intake" id="intake-form">
        <div className="s-in rv">
          <div className="vos-intake-inner">
            <div className="vos-intake-info">
              <div className="eyebrow light">Intake Request</div>
              <h2 className="vos-h2" style={{ marginBottom: "24px" }}>
                Introduce your operational challenge.
              </h2>
              <p className="vos-intake-p">
                We work selectively with ownership groups and executive teams who are serious about implementing a rigorous operating system. Provide context below, and our operations team will review your request.
              </p>
            </div>

            <div className="vos-form-container">
              {mutation.isSuccess ? (
                <div className="form-success" role="status" aria-live="polite">
                  <div className="form-success-icon">&#x2713;</div>
                  <h3>Your request is under review.</h3>
                  <p>
                    Our team will review your request and follow up about a
                    Velocity OS call or waitlist placement.
                  </p>
                </div>
              ) : (
                <form
                  className="cf"
                  onSubmit={handleSubmit}
                  noValidate
                  aria-busy={mutation.isPending}
                >
                  <div className="cf-row">
                    <div className="cf-field">
                      <label className="cf-label" htmlFor="fullName">Full Name *</label>
                      <input id="fullName" className="cf-input" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={120} required />
                    </div>
                    <div className="cf-field">
                      <label className="cf-label" htmlFor="titleRole">Title / Role *</label>
                      <input id="titleRole" className="cf-input" value={titleRole} onChange={(e) => setTitleRole(e.target.value)} maxLength={120} required />
                    </div>
                  </div>

                  <div className="cf-row">
                    <div className="cf-field">
                      <label className="cf-label" htmlFor="workEmail">Work Email *</label>
                      <input id="workEmail" type="email" className="cf-input" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} maxLength={254} required />
                    </div>
                    <div className="cf-field">
                      <label className="cf-label" htmlFor="phone">Phone (optional)</label>
                      <input id="phone" type="tel" className="cf-input" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} />
                    </div>
                  </div>

                  <div className="cf-row">
                    <div className="cf-field">
                      <label className="cf-label" htmlFor="companyName">Company Name *</label>
                      <input id="companyName" className="cf-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} maxLength={160} required />
                    </div>
                    <div className="cf-field">
                      <label className="cf-label" htmlFor="companyWebsite">Company Website (optional)</label>
                      <input id="companyWebsite" type="url" className="cf-input" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} maxLength={300} />
                    </div>
                  </div>

                  <div className="cf-field">
                    <label className="cf-label" htmlFor="companyContext">Company Context *</label>
                    <textarea
                      id="companyContext"
                      className="cf-input cf-textarea"
                      placeholder="Size, scale, industry, team structure..."
                      value={companyContext}
                      onChange={(e) => setCompanyContext(e.target.value)}
                      maxLength={2000}
                      required
                    />
                  </div>

                  <div className="cf-field">
                    <label className="cf-label" htmlFor="primaryChallenge">Primary Challenge *</label>
                    <textarea
                      id="primaryChallenge"
                      className="cf-input cf-textarea"
                      placeholder="What is breaking? Where is the friction?"
                      value={primaryChallenge}
                      onChange={(e) => setPrimaryChallenge(e.target.value)}
                      maxLength={2000}
                      required
                    />
                  </div>

                  <div className="cf-field">
                    <label className="cf-label" htmlFor="desiredOutcome">Desired Outcome *</label>
                    <textarea
                      id="desiredOutcome"
                      className="cf-input cf-textarea"
                      placeholder="What does success look like in 6-12 months?"
                      value={desiredOutcome}
                      onChange={(e) => setDesiredOutcome(e.target.value)}
                      maxLength={2000}
                      required
                    />
                  </div>

                  <div className="cf-field">
                    <label className="cf-label" htmlFor="urgency">Urgency *</label>
                    <select
                      id="urgency"
                      className="cf-input"
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as Urgency)}
                      required
                    >
                      <option value="" disabled>Select urgency</option>
                      <option value="immediate">Immediate</option>
                      <option value="this-quarter">This Quarter</option>
                      <option value="next-six-months">Next Six Months</option>
                      <option value="exploring">Exploring / Future</option>
                    </select>
                  </div>

                  {(validationError || mutation.isError) && (
                    <p
                      id="velocity-form-error"
                      className="form-error"
                      role="alert"
                      ref={errorRef}
                      tabIndex={-1}
                    >
                      {validationError ||
                        "Something went wrong. Please try again."}
                    </p>
                  )}

                  <button type="submit" className="cf-submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Submitting..." : "Submit Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
