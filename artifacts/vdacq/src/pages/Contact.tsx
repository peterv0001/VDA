import { useState, type FormEvent } from "react";
import { useCreateInquiry } from "@workspace/api-client-react";
import { useReveal } from "../lib/useReveal";
import { usePageMeta } from "../lib/usePageMeta";

export default function ContactPage() {
  usePageMeta(
    "Contact",
    "Get in touch with Van Dyke Acquisitions — acquisition opportunities, lending inquiries, and partnership discussions in the CPG space.",
  );
  useReveal();
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");

  const mutation = useCreateInquiry();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (!fullName.trim() || !contactEmail.trim() || !organization.trim() || !category) {
      setValidationError("Please fill in all required fields.");
      return;
    }
    mutation.mutate({
      data: {
        fullName: fullName.trim(),
        organization: organization.trim(),
        email: contactEmail.trim(),
        phone: phone.trim() || undefined,
        category,
        description: description.trim() || undefined,
      },
    });
  };

  return (
    <>
      <div className="page-head" />
      <section className="contact" id="contact">
        <div className="s-in">
          <div className="contact-grid rv">
            <div>
              <div className="eyebrow light">Start a Conversation</div>
              <div className="s-h" style={{ color: "var(--cream)" }}>
                Introduce a situation.
              </div>
              <ul className="contact-reasons">
                {[
                  [
                    "\u2192",
                    <>
                      <strong>M&A Advisors & Investment Bankers</strong>{" "}
                      representing a sell-side CPG mandate — distressed or healthy
                    </>,
                  ],
                  [
                    "\u2192",
                    <>
                      <strong>Founders & Owners</strong> exploring a full or
                      majority sale of a CPG brand or manufacturing business
                    </>,
                  ],
                  [
                    "\u2192",
                    <>
                      <strong>Creditors, Trustees & Receivers</strong> seeking a
                      qualified buyer for a distressed consumer asset
                    </>,
                  ],
                  [
                    "\u2192",
                    <>
                      <strong>PE Firms & Family Offices</strong> seeking
                      co-investment, co-underwriting, or a permanent capital
                      exit partner
                    </>,
                  ],
                ].map(([icon, text], i) => (
                  <li key={i} className="cr-item">
                    <span className="cr-icon">{icon}</span>
                    <span className="cr-text">{text}</span>
                  </li>
                ))}
              </ul>
              <a href="mailto:deals@vdacq.com" className="contact-book-link">
                Or email directly &rarr; deals@vdacq.com
              </a>
              <a href="tel:+12174861588" className="contact-book-link">
                Or call directly &rarr; (217) 486-1588
              </a>
            </div>
            {mutation.isSuccess ? (
              <div className="cf">
                <div className="form-success">
                  <div className="form-success-icon">&#x2713;</div>
                  <p>Your inquiry has been received. We'll be in touch within one business day.</p>
                </div>
              </div>
            ) : (
              <form className="cf" onSubmit={handleSubmit}>
                <div className="cf-row">
                  <div className="cf-field">
                    <label className="cf-label">Full Name *</label>
                    <input className="cf-input" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label">Organization *</label>
                    <input className="cf-input" placeholder="Firm, fund, or company" value={organization} onChange={(e) => setOrganization(e.target.value)} required />
                  </div>
                </div>
                <div className="cf-row">
                  <div className="cf-field">
                    <label className="cf-label">Email *</label>
                    <input className="cf-input" type="email" placeholder="Professional email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label">Phone</label>
                    <input className="cf-input" type="tel" placeholder="Direct line (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="cf-field">
                  <label className="cf-label">Nature of Situation *</label>
                  <select className="cf-input" value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="" disabled>
                      Select category
                    </option>
                    <option>Sell-Side M&A / Distressed CPG Asset</option>
                    <option>Founder Exploring a Sale</option>
                    <option>Growth-Stage CPG Brand Seeking a Partner</option>
                    <option>Creditor / Trustee / Receiver Situation</option>
                    <option>Co-Investment / Co-Underwriting Opportunity</option>
                    <option>Operating Consulting Inquiry</option>
                    <option>Other / General</option>
                  </select>
                </div>
                <div className="cf-field">
                  <label className="cf-label">Brief Description</label>
                  <textarea
                    className="cf-input cf-textarea"
                    placeholder="Briefly describe the opportunity, situation, or reason for reaching out..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                {validationError && <p className="form-error">{validationError}</p>}
                {mutation.isError && <p className="form-error">Something went wrong. Please try again.</p>}
                <button type="submit" className="cf-submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Submitting..." : "Submit Inquiry"}
                </button>
                <p className="cf-alt">
                  Prefer a direct line?{" "}
                  <a href="tel:+12174861588">(217) 486-1588</a>
                  {" "}or{" "}
                  <a href="mailto:deals@vdacq.com">deals@vdacq.com</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
