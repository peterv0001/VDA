import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { usePageMeta } from "../lib/usePageMeta";
import { PAGE_META } from "../lib/pageMeta";

type Chapter = { id: string; label: string };
type BookUnlock = {
  downloadUrl: string;
  document: { filename: string };
};

const CHAPTERS: Chapter[] = [
  { id: "prefacewhy-i-wrote-this", label: "Preface — Why I Wrote This" },
  { id: "executive-summary", label: "Executive Summary" },
  { id: "ch1", label: "1. The Physics of the Firm" },
  { id: "ch2", label: "2. Lean as the Survivorship Engine" },
  { id: "ch3", label: "3. AI as Enterprise Electricity" },
  { id: "ch4", label: "4. The Lean–Power Law Barbell" },
  { id: "ch5", label: "5. R.A.P.I.D.: The Master Execution Loop" },
  { id: "ch6", label: "6. The Cadence Stack" },
  { id: "ch7", label: "7. The P&L Spine" },
  { id: "ch8", label: "8. The Growth Experimentation System" },
  { id: "ch9", label: "9. The Case Record" },
  { id: "ch10", label: "10. Hiring" },
  { id: "ch11", label: "11. Performance, Feedback, and Separation" },
  { id: "ch12", label: "12. The Technology Vendor Evaluation Matrix" },
  { id: "ch13", label: "13. AI Operating Leverage and Governance" },
  { id: "ch14", label: "14. The Velocity Dashboard" },
  { id: "ch15", label: "15. The 90-Day Installation Plan" },
  { id: "ch16", label: "16. Quick Reference" },
  { id: "afterword", label: "Afterword" },
];

const BOOK_URL = "/operating-library/velocity-operating-system/index.html";

function chapterFromHash() {
  const hash = window.location.hash.replace(/^#/, "");
  const index = CHAPTERS.findIndex((chapter) => chapter.id === hash);
  return index >= 0 ? index : 0;
}

export function BookReaderPage() {
  usePageMeta(
    PAGE_META["/how-we-operate/book"].title,
    PAGE_META["/how-we-operate/book"].description,
  );

  const frameRef = useRef<HTMLIFrameElement>(null);
  const activeChapterRef = useRef(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [frameVersion, setFrameVersion] = useState(0);
  const [bookEmail, setBookEmail] = useState("");
  const [bookUnlock, setBookUnlock] = useState<BookUnlock | null>(null);
  const [bookDownloadError, setBookDownloadError] = useState("");
  const [isUnlockingBook, setIsUnlockingBook] = useState(false);
  const [isDownloadingBook, setIsDownloadingBook] = useState(false);
  const currentChapter = CHAPTERS[activeChapter];
  activeChapterRef.current = activeChapter;

  const frameUrl = useMemo(
    () => `${BOOK_URL}#${currentChapter.id}`,
    [currentChapter.id],
  );

  const moveToChapter = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), CHAPTERS.length - 1);
    const next = CHAPTERS[nextIndex];
    window.history.pushState(null, "", `#${next.id}`);
    setActiveChapter(nextIndex);
    setFrameVersion((version) => version + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleReaderMessage = (event: MessageEvent) => {
      if (
        event.source !== frameRef.current?.contentWindow ||
        event.data?.type !== "velocity-os-chapter-navigation"
      ) {
        return;
      }
      moveToChapter(
        activeChapterRef.current + (event.data.direction === "next" ? 1 : -1),
      );
    };

    window.addEventListener("message", handleReaderMessage);
    return () => window.removeEventListener("message", handleReaderMessage);
  }, []);

  useEffect(() => {
    const updateFromHash = () => {
      setActiveChapter(chapterFromHash());
      setFrameVersion((version) => version + 1);
    };

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);
    return () => window.removeEventListener("hashchange", updateFromHash);
  }, []);

  const connectFrame = () => {
    const doc = frameRef.current?.contentDocument;
    const view = frameRef.current?.contentWindow;
    if (!doc || !view) return;

    const updateReadingState = () => {
      const total = doc.documentElement.scrollHeight - view.innerHeight;
      setProgress(total > 0 ? Math.round((view.scrollY / total) * 100) : 0);

      const visibleIndex = CHAPTERS.reduce((latest, chapter, index) => {
        const element = doc.getElementById(chapter.id);
        return element && element.getBoundingClientRect().top < view.innerHeight * 0.35
          ? index
          : latest;
      }, 0);
      setActiveChapter(visibleIndex);
    };

    view.addEventListener("scroll", updateReadingState, { passive: true });
    updateReadingState();

    return () => {
      view.removeEventListener("scroll", updateReadingState);
    };
  };

  const requestBookDownload = async (event: FormEvent) => {
    event.preventDefault();
    const email = bookEmail.trim();
    setBookDownloadError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setBookDownloadError(
        "Enter a valid email address to receive the illustrated book.",
      );
      return;
    }

    setIsUnlockingBook(true);
    try {
      const response = await fetch("/api/velocity-os/illustrated-book-unlocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as BookUnlock & { error?: string };
      if (!response.ok || !data.downloadUrl || !data.document?.filename) {
        throw new Error(data.error || "We could not prepare the book download.");
      }
      setBookUnlock(data);
    } catch (error) {
      setBookDownloadError(
        error instanceof Error
          ? error.message
          : "We could not prepare the book download. Please try again.",
      );
    } finally {
      setIsUnlockingBook(false);
    }
  };

  const downloadIllustratedBook = async () => {
    if (!bookUnlock) return;
    setBookDownloadError("");
    setIsDownloadingBook(true);
    try {
      const response = await fetch(bookUnlock.downloadUrl);
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          response.status === 410
            ? "This 10-minute download link has expired. Enter your email again for a fresh link."
            : body?.error || "The book download is temporarily unavailable.",
        );
      }
      const objectUrl = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = bookUnlock.document.filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
    } catch (error) {
      setBookDownloadError(
        error instanceof Error
          ? error.message
          : "The book download is temporarily unavailable.",
      );
    } finally {
      setIsDownloadingBook(false);
    }
  };

  return (
    <main className="operating-reader">
      <header className="reader-topbar">
        <Link href="/how-we-operate" className="reader-back">
          <span aria-hidden="true">←</span> How We Operate
        </Link>
        <div className="reader-identity">
          <span>The Velocity Operating System</span>
          <span className="reader-progress" aria-live="polite">{progress}% read</span>
        </div>
        <button
          type="button"
          className="reader-open reader-open-button"
          onClick={() =>
            document.getElementById("illustrated-book-download")?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          }
        >
          Download PDF
        </button>
      </header>

      <div className="reader-progress-track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <section className="reader-controls" aria-label="Book navigation">
        <details className="reader-contents">
          <summary>Contents <span aria-hidden="true">⌄</span></summary>
          <nav aria-label="Book table of contents">
            <ol>
              {CHAPTERS.map((chapter, index) => (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    aria-current={activeChapter === index ? "location" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      moveToChapter(index);
                    }}
                  >
                    {chapter.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </details>
        <p className="reader-position">
          <span className="reader-position-label">Now reading</span>
          {currentChapter.label}
        </p>
        <p className="reader-keyboard">Use <kbd>Shift</kbd> + <kbd>←</kbd>/<kbd>→</kbd> to move between chapters.</p>
      </section>

      <div className="reader-frame-wrap" data-testid="book-reader">
        <iframe
          key={frameVersion}
          ref={frameRef}
          src={frameUrl}
          title="The complete illustrated edition of The Velocity Operating System"
          className="reader-frame"
          onLoad={connectFrame}
        />
      </div>

      <nav className="reader-pagination" aria-label="Chapter navigation">
        <button
          type="button"
          onClick={() => moveToChapter(activeChapter - 1)}
          disabled={activeChapter === 0}
        >
          <span>Previous</span>
          {activeChapter > 0 ? CHAPTERS[activeChapter - 1].label : "Beginning"}
        </button>
        <button
          type="button"
          onClick={() => moveToChapter(activeChapter + 1)}
          disabled={activeChapter === CHAPTERS.length - 1}
        >
          <span>Next</span>
          {activeChapter < CHAPTERS.length - 1
            ? CHAPTERS[activeChapter + 1].label
            : "End of book"}
        </button>
      </nav>

      <section
        className="book-download"
        id="illustrated-book-download"
        aria-labelledby="illustrated-book-download-title"
      >
        <p className="reader-position-label">Take the illustrated edition with you</p>
        <h2 id="illustrated-book-download-title">Download the complete book</h2>
        <p>
          The complete reader remains open on this site. Enter your email to
          unlock a private, 10-minute download link for the illustrated PDF.
        </p>
        {bookUnlock ? (
          <div className="book-download-ready">
            <p role="status">
              Your private link is ready. Download the illustrated edition
              before it expires.
            </p>
            <button
              type="button"
              className="btn-gold"
              onClick={downloadIllustratedBook}
              disabled={isDownloadingBook}
            >
              {isDownloadingBook
                ? "Preparing download…"
                : "Download the illustrated PDF"}
            </button>
            <button
              type="button"
              className="book-download-reset"
              onClick={() => {
                setBookUnlock(null);
                setBookDownloadError("");
              }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form
            className="book-download-form"
            onSubmit={requestBookDownload}
            noValidate
          >
            <label htmlFor="illustrated-book-email">
              Email address
              <input
                id="illustrated-book-email"
                data-testid="illustrated-book-email"
                type="email"
                autoComplete="email"
                value={bookEmail}
                onChange={(event) => setBookEmail(event.target.value)}
                placeholder="you@company.com"
              />
            </label>
            <button
              type="submit"
              className="btn-gold"
              data-testid="illustrated-book-unlock"
              disabled={isUnlockingBook}
            >
              {isUnlockingBook ? "Preparing link…" : "Unlock PDF download"}
            </button>
          </form>
        )}
        {bookDownloadError && (
          <p className="book-download-error" role="alert">
            {bookDownloadError}
          </p>
        )}
      </section>
    </main>
  );
}

type ResourceReaderProps = {
  slug: "metrics-and-questions" | "rule-book" | "checklist-book";
  name: string;
  eyebrow: string;
  description: string;
  pages: number;
  filename: string;
};

const RESOURCE_META = {
  "metrics-and-questions": {
    slug: "metrics-and-questions",
    name: "Metrics & Questions",
    eyebrow: "Measurement & operating questions companion",
    description:
      "A 29-page field reference for the measures and operating questions that keep the Velocity Operating System connected to evidence.",
    pages: 29,
    filename: "velocity-os-metrics-and-questions.pdf",
  },
  "rule-book": {
    slug: "rule-book",
    name: "The Rule Book",
    eyebrow: "Decision & governance companion",
    description:
      "An 11-page cited field reference for decision rules, governance, and the explicit standards that make judgment repeatable.",
    pages: 11,
    filename: "velocity-os-rule-book.pdf",
  },
  "checklist-book": {
    slug: "checklist-book",
    name: "The Checklist Book",
    eyebrow: "Execution & review companion",
    description:
      "A 41-page field reference for turning the model into repeatable practice through operating and review checklists.",
    pages: 41,
    filename: "velocity-os-checklist-book.pdf",
  },
} as const satisfies Record<string, ResourceReaderProps>;

export function ResourceReaderPage({
  resource,
}: {
  resource: keyof typeof RESOURCE_META;
}) {
  const details = RESOURCE_META[resource];
  const route = `/how-we-operate/${details.slug}`;
  usePageMeta(PAGE_META[route].title, PAGE_META[route].description);

  const [page, setPage] = useState(1);
  const documentUrl = `/operating-library/${details.filename}`;

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === "ArrowLeft") {
        event.preventDefault();
        setPage((current) => Math.max(1, current - 1));
      }
      if (event.shiftKey && event.key === "ArrowRight") {
        event.preventDefault();
        setPage((current) => Math.min(details.pages, current + 1));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [details.pages]);

  return (
    <main className="resource-reader">
      <header className="reader-topbar">
        <Link href="/how-we-operate" className="reader-back">
          <span aria-hidden="true">←</span> How We Operate
        </Link>
        <div className="reader-identity">
          <span>{details.name}</span>
          <span className="reader-progress">{details.pages} pages</span>
        </div>
        <a href={documentUrl} target="_blank" rel="noreferrer" className="reader-open">
          Open PDF
        </a>
      </header>

      <section className="resource-reader-intro">
        <div>
          <p className="reader-position-label">{details.eyebrow}</p>
          <h1>{details.name}</h1>
          <p>{details.description}</p>
        </div>
        <div className="resource-reader-actions">
          <a href={documentUrl} target="_blank" rel="noreferrer">Open in a new tab</a>
          <a href={documentUrl} download>Download PDF</a>
        </div>
      </section>

      <section className="resource-page-controls" aria-label={`${details.name} page controls`}>
        <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
          Previous page
        </button>
        <label>
          <span>Page</span>
          <input
            type="number"
            min={1}
            max={details.pages}
            value={page}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isInteger(next) && next >= 1 && next <= details.pages) setPage(next);
            }}
          />
          <span>of {details.pages}</span>
        </label>
        <button type="button" disabled={page === details.pages} onClick={() => setPage((current) => current + 1)}>
          Next page
        </button>
      </section>

      <div className="resource-pdf-wrap" data-testid={`${details.slug}-reader`}>
        <iframe
          title={`${details.name}, page ${page}`}
          src={`${documentUrl}#page=${page}&view=FitH`}
          className="resource-pdf"
        />
        <p className="resource-mobile-fallback">
          Your device may open PDFs in a separate reader. <a href={documentUrl} target="_blank" rel="noreferrer">Open {details.name}</a> or <a href={documentUrl} download>download the PDF</a>.
        </p>
      </div>

      <p className="reader-keyboard resource-keyboard">
        Use <kbd>Shift</kbd> + <kbd>←</kbd>/<kbd>→</kbd> to turn pages.
      </p>
    </main>
  );
}