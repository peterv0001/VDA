import { useState, useEffect, type FormEvent } from "react";
import { useCreateAccessRequest } from "@workspace/api-client-react";

export function Modal({ onClose }: { onClose: () => void }) {
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [titleRole, setTitleRole] = useState("");
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState("");

  const mutation = useCreateAccessRequest();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (!fullName.trim() || !email.trim() || !organization.trim() || !reason) {
      setValidationError("Please fill in all required fields.");
      return;
    }
    mutation.mutate(
      { data: { fullName: fullName.trim(), organization: organization.trim(), email: email.trim(), titleRole: titleRole.trim() || undefined, reason } },
      { onSuccess: () => { setTimeout(onClose, 2000); } }
    );
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          &#x2715;
        </button>
        <div className="modal-eye">Portfolio Access Request</div>
        <div className="modal-title" id="modal-heading">Qualified Counterparties Only</div>
        <p className="modal-sub">
          Van Dyke Acquisitions shares portfolio detail exclusively with
          verified principals, advisors, and institutional counterparties.
          Submit your information and we will respond within one business day.
        </p>
        {mutation.isSuccess ? (
          <div className="form-success">
            <div className="form-success-icon">&#x2713;</div>
            <p>Your access request has been received. We will review and respond within one business day.</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="modal-name">Full Name</label>
            <input className="modal-input" id="modal-name" placeholder="Full Name *" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <label className="sr-only" htmlFor="modal-org">Organization</label>
            <input className="modal-input" id="modal-org" placeholder="Organization / Fund / Firm *" type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} required />
            <label className="sr-only" htmlFor="modal-email">Professional Email</label>
            <input className="modal-input" id="modal-email" placeholder="Professional Email Address *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label className="sr-only" htmlFor="modal-title">Title / Role</label>
            <input className="modal-input" id="modal-title" placeholder="Title / Role" type="text" value={titleRole} onChange={(e) => setTitleRole(e.target.value)} />
            <label className="sr-only" htmlFor="modal-reason">Reason for Access</label>
            <select className="modal-input" id="modal-reason" value={reason} onChange={(e) => setReason(e.target.value)} required>
              <option value="" disabled>
                Reason for Access *
              </option>
              <option>M&A Advisory / Deal Sourcing</option>
              <option>Founder Evaluating a Sale</option>
              <option>Creditor / Banker / Trustee</option>
              <option>PE / Family Office Co-Investment</option>
              <option>Strategic / Corporate Development</option>
              <option>Other</option>
            </select>
            {validationError && <p className="form-error">{validationError}</p>}
            {mutation.isError && <p className="form-error">Something went wrong. Please try again.</p>}
            <button type="submit" className="modal-submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit Access Request"}
            </button>
          </form>
        )}
        <p className="modal-note">
          All submissions are reviewed personally. Confidentiality guaranteed.
        </p>
      </div>
    </div>
  );
}
