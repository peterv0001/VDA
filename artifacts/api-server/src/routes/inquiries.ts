import { Router, type IRouter } from "express";
import { CreateInquiryBody } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { contactInquiriesTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.post("/inquiries", async (req, res) => {
  const parsed = CreateInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      details: parsed.error.issues.map((i) => i.message),
    });
    return;
  }

  try {
    await db.insert(contactInquiriesTable).values(parsed.data);
    res.status(201).json({
      success: true,
      message: "Your inquiry has been received. We'll be in touch within one business day.",
    });
  } catch (err) {
    console.error("Failed to insert contact inquiry:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
