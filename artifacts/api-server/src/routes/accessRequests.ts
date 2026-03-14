import { Router, type IRouter } from "express";
import { CreateAccessRequestBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { portfolioAccessRequestsTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.post("/access-requests", async (req, res) => {
  const parsed = CreateAccessRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      details: parsed.error.issues.map((i) => i.message),
    });
    return;
  }

  try {
    await db.insert(portfolioAccessRequestsTable).values(parsed.data);
    res.status(201).json({
      success: true,
      message: "Your access request has been received. We will review and respond within one business day.",
    });
  } catch (err) {
    console.error("Failed to insert portfolio access request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
