import { timingSafeEqual } from "node:crypto";
import {
  Router,
  type IRouter,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { desc } from "drizzle-orm";
import { ListAdminSubmissionsResponse } from "@workspace/api-zod";
import {
  contactInquiriesTable,
  db,
  portfolioAccessRequestsTable,
  velocityOsIntakesTable,
  velocityOsJournalLeadsTable,
} from "@workspace/db";

const router: IRouter = Router();
const AUTH_WINDOW_MS = 15 * 60 * 1000;
const MAX_AUTH_FAILURES = 5;
const failedAuthByClient = new Map<
  string,
  { failures: number; resetAt: number }
>();

function stringsMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getClientKey(req: Request): string {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function getActiveAuthFailure(
  clientKey: string,
  now: number,
): { failures: number; resetAt: number } | undefined {
  const activeFailure = failedAuthByClient.get(clientKey);

  if (activeFailure && activeFailure.resetAt <= now) {
    failedAuthByClient.delete(clientKey);
    return undefined;
  }

  return activeFailure;
}

function recordAuthFailure(clientKey: string, now: number): void {
  const activeFailure = getActiveAuthFailure(clientKey, now);
  failedAuthByClient.set(clientKey, {
    failures: (activeFailure?.failures ?? 0) + 1,
    resetAt: activeFailure?.resetAt ?? now + AUTH_WINDOW_MS,
  });
}

function requireOwner(req: Request, res: Response, next: NextFunction): void {
  const expectedUsername = process.env.ADMIN_USERNAME ?? "owner";
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const clientKey = getClientKey(req);
  const now = Date.now();

  res.set({
    "Cache-Control": "private, no-store",
    Vary: "Authorization",
  });

  if (!expectedPassword) {
    res.status(503).json({ error: "Owner access is not configured" });
    return;
  }

  const activeFailure = getActiveAuthFailure(clientKey, now);
  if (activeFailure && activeFailure.failures >= MAX_AUTH_FAILURES) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((activeFailure.resetAt - now) / 1000),
    );
    res.set("Retry-After", String(retryAfterSeconds));
    res.status(429).json({ error: "Too many authentication attempts" });
    return;
  }

  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Basic ")) {
    recordAuthFailure(clientKey, now);
    res.set("WWW-Authenticate", 'Basic realm="VDACQ Intake", charset="UTF-8"');
    res.status(401).json({ error: "Owner authentication required" });
    return;
  }

  const credentials = Buffer.from(
    authorization.slice("Basic ".length),
    "base64",
  ).toString("utf8");
  const separatorIndex = credentials.indexOf(":");
  const username =
    separatorIndex === -1 ? credentials : credentials.slice(0, separatorIndex);
  const password =
    separatorIndex === -1 ? "" : credentials.slice(separatorIndex + 1);

  if (
    !stringsMatch(username, expectedUsername) ||
    !stringsMatch(password, expectedPassword)
  ) {
    recordAuthFailure(clientKey, now);
    res.status(401).json({ error: "Invalid owner credentials" });
    return;
  }

  failedAuthByClient.delete(clientKey);
  next();
}

router.get(
  "/admin/submissions",
  requireOwner,
  async (_req, res): Promise<void> => {
    try {
      const [inquiries, accessRequests, velocityOsIntakes, documentLeads] =
        await Promise.all([
          db
            .select()
            .from(contactInquiriesTable)
            .orderBy(desc(contactInquiriesTable.createdAt)),
          db
            .select()
            .from(portfolioAccessRequestsTable)
            .orderBy(desc(portfolioAccessRequestsTable.createdAt)),
          db
            .select()
            .from(velocityOsIntakesTable)
            .orderBy(desc(velocityOsIntakesTable.createdAt)),
          db
            .select({
              id: velocityOsJournalLeadsTable.id,
              email: velocityOsJournalLeadsTable.email,
              documentId: velocityOsJournalLeadsTable.documentId,
              documentVersion: velocityOsJournalLeadsTable.documentVersion,
              submittedAt: velocityOsJournalLeadsTable.submittedAt,
              downloadedAt: velocityOsJournalLeadsTable.downloadedAt,
              createdAt: velocityOsJournalLeadsTable.createdAt,
            })
            .from(velocityOsJournalLeadsTable)
            .orderBy(desc(velocityOsJournalLeadsTable.submittedAt)),
        ]);

      const data = ListAdminSubmissionsResponse.parse({
        inquiries,
        accessRequests,
        velocityOsIntakes,
        documentLeads,
      });
      res.json(data);
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
