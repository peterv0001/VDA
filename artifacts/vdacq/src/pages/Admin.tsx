import { useState, useMemo, useEffect, type FormEvent } from "react";
import {
  useListAdminSubmissions,
  getListAdminSubmissionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Lock,
  LogOut,
  Mail,
  Briefcase,
  Clock,
  User,
  Building,
  Phone,
  Tag,
  AlignLeft,
  Shield,
  AlertCircle,
  Inbox,
  ArrowLeft,
  Activity,
  BookOpen,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import "./Admin.css";
import { usePageMeta } from "../lib/usePageMeta";
import { PAGE_META } from "../lib/pageMeta";

function getErrorStatus(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return undefined;
}

function getErrorName(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string"
  ) {
    return error.name;
  }

  return undefined;
}

function createBasicAuthHeader(username: string, password: string): string {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `Basic ${btoa(binary)}`;
}

export default function AdminPage() {
  const pageMeta = PAGE_META["/admin"];
  usePageMeta(pageMeta.title, pageMeta.description, pageMeta.noIndex);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isFetching } =
    useListAdminSubmissions({
      query: {
        enabled: !!authHeader,
        retry: false,
        queryKey: [...getListAdminSubmissionsQueryKey(), authHeader],
      },
      request: {
        headers: authHeader ? { Authorization: authHeader } : undefined,
      },
    });

  useEffect(() => {
    if (isError) {
      setAuthHeader(null);
      queryClient.removeQueries({
        queryKey: getListAdminSubmissionsQueryKey(),
      });

      const status = getErrorStatus(error);
      if (status === 401) {
        setLoginError("Incorrect credentials. Please try again.");
      } else if (status === 503) {
        setLoginError(
          "Owner access is not configured. Set an admin password before trying again.",
        );
      } else if (
        (status !== undefined && status >= 500) ||
        getErrorName(error) === "TypeError"
      ) {
        setLoginError("The review service is temporarily unavailable.");
      } else {
        setLoginError("Unable to load submissions. Please try again.");
      }
    }
  }, [isError, error, queryClient]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!credentials.username || !credentials.password) return;
    setAuthHeader(
      createBasicAuthHeader(credentials.username, credentials.password),
    );
    setCredentials({ username: "", password: "" });
  };

  const handleSignOut = () => {
    setAuthHeader(null);
    setCredentials({ username: "", password: "" });
    setLoginError(null);
    queryClient.removeQueries({ queryKey: getListAdminSubmissionsQueryKey() });
  };

  type Field = { label: string; value: string | null; icon: "user" | "building" | "mail" | "phone" | "briefcase" | "globe" | "tag" };
  type Entry = {
    key: string;
    type: "inquiry" | "access" | "intake" | "lead";
    id: number;
    date: number;
    fields: Field[];
    sections: Array<{ label: string; value: string | null }>;
  };

  const unifiedList = useMemo<Entry[]>(() => {
    if (!data) return [];

    const inquiries: Entry[] = (data.inquiries || []).map((i) => ({
      key: `inquiry-${i.id}`,
      type: "inquiry",
      id: i.id,
      date: new Date(i.createdAt).getTime(),
      fields: [
        { label: "Full Name", value: i.fullName, icon: "user" },
        { label: "Organization", value: i.organization, icon: "building" },
        { label: "Email", value: i.email, icon: "mail" },
        { label: "Phone", value: i.phone, icon: "phone" },
        { label: "Category", value: i.category, icon: "tag" },
      ],
      sections: [{ label: "Description", value: i.description }],
    }));

    const requests: Entry[] = (data.accessRequests || []).map((r) => ({
      key: `access-${r.id}`,
      type: "access",
      id: r.id,
      date: new Date(r.createdAt).getTime(),
      fields: [
        { label: "Full Name", value: r.fullName, icon: "user" },
        { label: "Organization", value: r.organization, icon: "building" },
        { label: "Email", value: r.email, icon: "mail" },
        { label: "Title / Role", value: r.titleRole, icon: "briefcase" },
      ],
      sections: [{ label: "Reason for Access", value: r.reason }],
    }));

    const intakes: Entry[] = (data.velocityOsIntakes || []).map((v) => ({
      key: `intake-${v.id}`,
      type: "intake",
      id: v.id,
      date: new Date(v.createdAt).getTime(),
      fields: [
        { label: "Full Name", value: v.fullName, icon: "user" },
        { label: "Company", value: v.companyName, icon: "building" },
        { label: "Work Email", value: v.workEmail, icon: "mail" },
        { label: "Phone", value: v.phone, icon: "phone" },
        { label: "Title / Role", value: v.titleRole, icon: "briefcase" },
        { label: "Website", value: v.companyWebsite, icon: "globe" },
        { label: "Urgency", value: v.urgency, icon: "tag" },
      ],
      sections: [
        { label: "Company Context", value: v.companyContext },
        { label: "Primary Challenge", value: v.primaryChallenge },
        { label: "Desired Outcome", value: v.desiredOutcome },
      ],
    }));

    const leads: Entry[] = (data.documentLeads || []).map((l) => ({
      key: `lead-${l.id}`,
      type: "lead",
      id: l.id,
      date: new Date(l.submittedAt).getTime(),
      fields: [
        { label: "Email", value: l.email, icon: "mail" },
        { label: "Document", value: l.documentId, icon: "tag" },
        { label: "Version", value: l.documentVersion, icon: "tag" },
      ],
      sections: [
        {
          label: "Download",
          value: l.downloadedAt
            ? `Downloaded ${format(new Date(l.downloadedAt), "MMM d, yyyy 'at' h:mm a")}`
            : "Link issued, not yet downloaded",
        },
      ],
    }));

    return [...inquiries, ...requests, ...intakes, ...leads].sort(
      (a, b) => b.date - a.date,
    );
  }, [data]);

  const typeMeta = {
    inquiry: { label: "Contact Inquiry", className: "inquiry" },
    access: { label: "Access Request", className: "access" },
    intake: { label: "Velocity OS Intake", className: "intake" },
    lead: { label: "Document Unlock", className: "lead" },
  } as const;

  const typeIcon = (type: Entry["type"]) =>
    type === "inquiry" ? (
      <Mail size={12} />
    ) : type === "access" ? (
      <Lock size={12} />
    ) : type === "intake" ? (
      <Activity size={12} />
    ) : (
      <BookOpen size={12} />
    );

  const fieldIcon = (icon: Field["icon"]) =>
    icon === "user" ? (
      <User />
    ) : icon === "building" ? (
      <Building />
    ) : icon === "mail" ? (
      <Mail />
    ) : icon === "phone" ? (
      <Phone />
    ) : icon === "briefcase" ? (
      <Briefcase />
    ) : icon === "globe" ? (
      <Globe />
    ) : (
      <Tag />
    );

  const counts = {
    inquiry: unifiedList.filter((e) => e.type === "inquiry").length,
    access: unifiedList.filter((e) => e.type === "access").length,
    intake: unifiedList.filter((e) => e.type === "intake").length,
    lead: unifiedList.filter((e) => e.type === "lead").length,
  };

  const isEmpty = unifiedList.length === 0;

  if (!authHeader || loginError) {
    return (
      <div className="admin-wrap">
        <div className="admin-login-container">
          <div className="admin-login-box">
            <div className="admin-shield">
              <Shield size={32} />
            </div>
            <h1 className="admin-title">Owner Access</h1>
            <p className="admin-subtitle">Secure Review Portal</p>

            {loginError && (
              <div className="admin-error-box">
                <AlertCircle size={20} />
                <span className="admin-error-text">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="admin-username">
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  className="admin-input"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="admin-password">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  className="admin-input"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <button
                type="submit"
                className="admin-btn"
                disabled={isLoading || isFetching}
              >
                {(isLoading || isFetching) && !isError
                  ? "Authenticating..."
                  : "Authenticate"}
              </button>
            </form>

            <div className="admin-return">
              <Link href="/" className="admin-return-link">
                <ArrowLeft size={12} />
                Return to Public Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <header className="admin-header">
        <div className="admin-logo">
          <Shield size={18} className="admin-logo-mark" />
          <div className="admin-logo-text">
            Van Dyke <span>Acquisitions</span>
          </div>
          <div className="admin-logo-badge">Owner Portal</div>
        </div>
        <div className="admin-header-actions">
          <Link
            href="/"
            onClick={handleSignOut}
            className="admin-signout admin-public-link"
          >
            <ArrowLeft size={12} /> Public Site
          </Link>
          <button onClick={handleSignOut} className="admin-signout">
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-page-heading">
          <div>
            <h1 className="admin-page-title">Submissions Review</h1>
            <p className="admin-page-subtitle">
              Contact inquiries, portfolio access requests, Velocity OS
              intakes, and document unlocks, newest first.
            </p>
          </div>
          <div className="admin-count" aria-label="Entry counts">
            <strong>{unifiedList.length}</strong> total
            <span>{counts.inquiry} inquiries</span>
            <span>{counts.access} access</span>
            <span>{counts.intake} intakes</span>
            <span>{counts.lead} unlocks</span>
          </div>
        </div>

        {isLoading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p className="admin-loading-label">Loading submissions...</p>
          </div>
        ) : isEmpty ? (
          <div className="admin-empty">
            <Inbox size={48} className="mx-auto" />
            <h3 className="admin-empty-title">No submissions yet</h3>
            <p className="admin-empty-sub">
              When visitors submit inquiries or requests, they will appear here.
            </p>
          </div>
        ) : (
          <div className="admin-timeline">
            {unifiedList.map((item) => (
              <div key={item.key} className="admin-card">
                <div className="admin-card-meta">
                  <div>
                    <span
                      className={`admin-card-type ${typeMeta[item.type].className}`}
                    >
                      {typeIcon(item.type)} {typeMeta[item.type].label}
                    </span>
                  </div>

                  <div className="admin-card-date">
                    <Clock size={12} />
                    <span>
                      {format(new Date(item.date), "MMM d, yyyy")} <br />{" "}
                      <span className="admin-card-time">
                        {format(new Date(item.date), "h:mm a")}
                      </span>
                    </span>
                  </div>

                  <div className="admin-card-id">Record ID: {item.id}</div>
                </div>

                <div className="admin-card-main">
                  <div className="admin-grid-details">
                    {item.fields.map((field) => (
                      <div className="admin-field" key={field.label}>
                        <span className="admin-field-label">
                          {fieldIcon(field.icon)} {field.label}
                        </span>
                        <span className="admin-field-value">
                          {field.value ? (
                            field.icon === "mail" ? (
                              <a
                                href={`mailto:${field.value}`}
                                className="admin-email"
                              >
                                {field.value}
                              </a>
                            ) : field.icon === "globe" ? (
                              <a
                                href={field.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-email"
                              >
                                {field.value}
                              </a>
                            ) : (
                              field.value
                            )
                          ) : (
                            <span className="admin-field-value muted">
                              Not provided
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="admin-card-detail-section">
                    {item.sections.map((section) => (
                      <div className="admin-field" key={section.label}>
                        <span className="admin-field-label admin-field-label-spaced">
                          <AlignLeft /> {section.label}
                        </span>
                        <div className="admin-desc-box">
                          {section.value || (
                            <span className="admin-empty-value">
                              Not provided.
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
