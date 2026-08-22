import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCreateVelocityOsIntake } from "@workspace/api-client-react";
import { useReveal } from "../lib/useReveal";
import { usePageMeta } from "../lib/usePageMeta";
import { PAGE_META } from "../lib/pageMeta";

type Urgency =
  | "immediate"
  | "this-quarter"
  | "next-six-months"
  | "exploring";

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

  const mutation = useCreateVelocityOsIntake();

  useEffect(() => {
    if (validationError || mutation.isError) {
      errorRef.current?.focus();
    }
  }, [mutation.isError, validationError]);

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
