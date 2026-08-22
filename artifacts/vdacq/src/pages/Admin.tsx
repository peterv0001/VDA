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

  const unifiedList = useMemo(() => {
    if (!data) return [];

    const inquiries = (data.inquiries || []).map((i) => ({
      ...i,
      _type: "inquiry" as const,
      _date: new Date(i.createdAt).getTime(),
    }));

    const requests = (data.accessRequests || []).map((r) => ({
      ...r,
      _type: "access" as const,
      _date: new Date(r.createdAt).getTime(),
    }));

    return [...inquiries, ...requests].sort((a, b) => b._date - a._date);
  }, [data]);

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
              Review incoming contact inquiries and portfolio access requests.
            </p>
          </div>
          <div className="admin-count">{unifiedList.length} Total Entries</div>
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
              <div key={`${item._type}-${item.id}`} className="admin-card">
                <div className="admin-card-meta">
                  <div>
                    {item._type === "inquiry" ? (
                      <span className="admin-card-type inquiry">
                        <Mail size={12} /> Contact Inquiry
                      </span>
                    ) : (
                      <span className="admin-card-type access">
                        <Lock size={12} /> Access Request
                      </span>
                    )}
                  </div>

                  <div className="admin-card-date">
                    <Clock size={12} />
                    <span>
                      {format(new Date(item.createdAt), "MMM d, yyyy")} <br />{" "}
                      <span className="admin-card-time">
                        {format(new Date(item.createdAt), "h:mm a")}
                      </span>
                    </span>
                  </div>

                  <div className="admin-card-id">Record ID: {item.id}</div>
                </div>

                <div className="admin-card-main">
                  <div className="admin-grid-details">
                    <div className="admin-field">
                      <span className="admin-field-label">
                        <User /> Full Name
                      </span>
                      <span className="admin-field-value">{item.fullName}</span>
                    </div>

                    <div className="admin-field">
                      <span className="admin-field-label">
                        <Building /> Organization
                      </span>
                      <span className="admin-field-value">
                        {item.organization}
                      </span>
                    </div>

                    <div className="admin-field">
                      <span className="admin-field-label">
                        <Mail /> Email
                      </span>
                      <span className="admin-field-value">
                        <a
                          href={`mailto:${item.email}`}
                          className="admin-email"
                        >
                          {item.email}
                        </a>
                      </span>
                    </div>

                    {"phone" in item && (
                      <div className="admin-field">
                        <span className="admin-field-label">
                          <Phone /> Phone
                        </span>
                        <span className="admin-field-value">
                          {item.phone || (
                            <span className="admin-field-value muted">
                              Not provided
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {"titleRole" in item && (
                      <div className="admin-field">
                        <span className="admin-field-label">
                          <Briefcase /> Title / Role
                        </span>
                        <span className="admin-field-value">
                          {item.titleRole || (
                            <span className="admin-field-value muted">
                              Not provided
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="admin-card-detail-section">
                    {"category" in item && (
                      <div className="admin-category-field">
                        <span className="admin-field-label admin-field-label-spaced">
                          <Tag /> Category
                        </span>
                        <span className="admin-category">{item.category}</span>
                      </div>
                    )}

                    <div className="admin-field">
                      <span className="admin-field-label admin-field-label-spaced">
                        <AlignLeft />{" "}
                        {item._type === "inquiry"
                          ? "Description"
                          : "Reason for Access"}
                      </span>
                      <div className="admin-desc-box">
                        {"description" in item
                          ? item.description || (
                              <span className="admin-empty-value">
                                No description provided.
                              </span>
                            )
                          : item.reason}
                      </div>
                    </div>
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
