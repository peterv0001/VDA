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
} from "@workspace/db";

const router: IRouter = Router();

function stringsMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function requireOwner(req: Request, res: Response, next: NextFunction): void {
  const expectedUsername = process.env.ADMIN_USERNAME ?? "owner";
  const expectedPassword =
    process.env.ADMIN_PASSWORD ?? process.env.SESSION_SECRET;

  res.set({
    "Cache-Control": "private, no-store",
    Vary: "Authorization",
  });

  if (!expectedPassword) {
    res.status(503).json({ error: "Owner access is not configured" });
    return;
  }

  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Basic ")) {
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
    res.status(401).json({ error: "Invalid owner credentials" });
    return;
  }

  next();
}

router.get(
  "/admin/submissions",
  requireOwner,
  async (_req, res): Promise<void> => {
    try {
      const [inquiries, accessRequests] = await Promise.all([
        db
          .select()
          .from(contactInquiriesTable)
          .orderBy(desc(contactInquiriesTable.createdAt)),
        db
          .select()
          .from(portfolioAccessRequestsTable)
          .orderBy(desc(portfolioAccessRequestsTable.createdAt)),
      ]);

      const data = ListAdminSubmissionsResponse.parse({
        inquiries,
        accessRequests,
      });
      res.json(data);
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
