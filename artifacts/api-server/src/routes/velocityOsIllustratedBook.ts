import { createHash, randomBytes } from "node:crypto";
import { Readable } from "node:stream";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  DownloadVelocityOsIllustratedBookParams,
  UnlockVelocityOsIllustratedBookBody,
  type ErrorResponse,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import { velocityOsJournalLeadsTable } from "@workspace/db/schema";
import {
  fetchVelocityOsIllustratedBook,
  isVelocityOsIllustratedBookAvailable,
} from "../lib/velocityOsIllustratedBookStorage";

const router: IRouter = Router();

const DOCUMENT_ID = "velocity-os-illustrated-book";
const DOCUMENT_VERSION = "illustrated-v3-1";
const DOCUMENT_TITLE = "The Velocity Operating System — Illustrated Edition";
const DOCUMENT_FILENAME = "the-velocity-operating-system-v3-1-illustrated.pdf";
const TOKEN_TTL_MS = 10 * 60 * 1000;

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function error(error: string, details?: string[]): ErrorResponse {
  return details ? { error, details } : { error };
}

router.post("/velocity-os/illustrated-book-unlocks", async (req, res) => {
  const body =
    req.body && typeof req.body === "object" && !Array.isArray(req.body)
      ? {
          ...(req.body as Record<string, unknown>),
          email:
            typeof (req.body as Record<string, unknown>)["email"] === "string"
              ? (
                  (req.body as Record<string, unknown>)["email"] as string
                ).trim()
              : (req.body as Record<string, unknown>)["email"],
        }
      : req.body;
  const parsed = UnlockVelocityOsIllustratedBookBody.safeParse(body);

  if (!parsed.success) {
    res
      .status(400)
      .json(
        error(
          "Enter a valid email address to receive the illustrated book.",
          parsed.error.issues.map((issue) => issue.message),
        ),
      );
    return;
  }

  let available = false;
  try {
    available = await isVelocityOsIllustratedBookAvailable();
  } catch {
    available = false;
  }

  if (!available) {
    res
      .status(503)
      .json(
        error(
          "The illustrated book file is temporarily unavailable. Please try again in a few minutes.",
        ),
      );
    return;
  }

  const email = parsed.data.email.toLowerCase();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  const submittedAt = new Date();

  try {
    await db
      .insert(velocityOsJournalLeadsTable)
      .values({
        email,
        documentId: DOCUMENT_ID,
        documentVersion: DOCUMENT_VERSION,
        downloadTokenHash: tokenHash(token),
        downloadTokenExpiresAt: expiresAt,
        submittedAt,
      })
      .onConflictDoUpdate({
        target: [
          velocityOsJournalLeadsTable.email,
          velocityOsJournalLeadsTable.documentId,
          velocityOsJournalLeadsTable.documentVersion,
        ],
        set: {
          downloadTokenHash: tokenHash(token),
          downloadTokenExpiresAt: expiresAt,
          submittedAt,
        },
      });

    res.status(201).json({
      success: true,
      message:
        "Your illustrated book is ready. This private download link expires in 10 minutes.",
      downloadUrl: `/api/velocity-os/illustrated-book-downloads/${token}`,
      expiresAt: expiresAt.toISOString(),
      document: {
        title: DOCUMENT_TITLE,
        version: DOCUMENT_VERSION,
        filename: DOCUMENT_FILENAME,
      },
    });
  } catch {
    res
      .status(500)
      .json(
        error(
          "We could not save your request. Please try again without reloading the page.",
        ),
      );
  }
});

router.get("/velocity-os/illustrated-book-downloads/:token", async (req, res) => {
  const parsed = DownloadVelocityOsIllustratedBookParams.safeParse(req.params);
  if (!parsed.success) {
    res
      .status(401)
      .json(
        error(
          "This download link is invalid. Submit your email again to create a new link.",
        ),
      );
    return;
  }

  let lead:
    | {
        id: number;
        expiresAt: Date;
      }
    | undefined;
  try {
    [lead] = await db
      .select({
        id: velocityOsJournalLeadsTable.id,
        expiresAt: velocityOsJournalLeadsTable.downloadTokenExpiresAt,
      })
      .from(velocityOsJournalLeadsTable)
      .where(
        eq(
          velocityOsJournalLeadsTable.downloadTokenHash,
          tokenHash(parsed.data.token),
        ),
      )
      .limit(1);
  } catch {
    res
      .status(500)
      .json(
        error(
          "We could not validate this download link. Please try again without reloading the page.",
        ),
      );
    return;
  }

  if (!lead) {
    res
      .status(401)
      .json(
        error(
          "This download link is invalid. Submit your email again to create a new link.",
        ),
      );
    return;
  }

  if (lead.expiresAt.getTime() <= Date.now()) {
    res
      .status(410)
      .json(
        error(
          "This download link has expired. Submit your email again to create a fresh link.",
        ),
      );
    return;
  }

  let bookResponse: Response | undefined;
  try {
    bookResponse = await fetchVelocityOsIllustratedBook(req.get("range"));
  } catch {}

  if (!bookResponse?.ok || !bookResponse.body) {
    res
      .status(503)
      .json(
        error(
          "The illustrated-book download is temporarily unavailable. Your link is still valid, so please try again.",
        ),
      );
    return;
  }

  try {
    await db
      .update(velocityOsJournalLeadsTable)
      .set({ downloadedAt: new Date() })
      .where(eq(velocityOsJournalLeadsTable.id, lead.id));
  } catch {
    res
      .status(500)
      .json(
        error(
          "We could not record the download. Your link is still valid, so please try again.",
        ),
      );
    return;
  }

  res.status(bookResponse.status);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${DOCUMENT_FILENAME}"`,
  );
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Referrer-Policy", "no-referrer");
  for (const header of [
    "accept-ranges",
    "content-length",
    "content-range",
    "etag",
    "last-modified",
  ]) {
    const value = bookResponse.headers.get(header);
    if (value) res.setHeader(header, value);
  }

  const stream = Readable.fromWeb(
    bookResponse.body as ReadableStream<Uint8Array>,
  );
  stream.on("error", () => res.destroy());
  stream.pipe(res);
});

export default router;