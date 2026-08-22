import { Router, type IRouter } from "express";
import {
  CreateVelocityOsIntakeBody,
  type ErrorResponse,
  type SubmissionResult,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import { velocityOsIntakesTable } from "@workspace/db/schema";

const router: IRouter = Router();

function validationError(details: string[]): ErrorResponse {
  return { error: "Validation failed", details };
}

function normalizeIntakeBody(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return body;
  }

  const values = body as Record<string, unknown>;
  const trim = (value: unknown) =>
    typeof value === "string" ? value.trim() : value;
  const trimOptional = (value: unknown) => {
    const trimmed = trim(value);
    return trimmed === "" ? undefined : trimmed;
  };

  return {
    ...values,
    fullName: trim(values.fullName),
    workEmail: trim(values.workEmail),
    phone: trimOptional(values.phone),
    titleRole: trim(values.titleRole),
    companyName: trim(values.companyName),
    companyWebsite: trimOptional(values.companyWebsite),
    companyContext: trim(values.companyContext),
    primaryChallenge: trim(values.primaryChallenge),
    desiredOutcome: trim(values.desiredOutcome),
  };
}

router.post("/velocity-os-intakes", async (req, res) => {
  const parsed = CreateVelocityOsIntakeBody.safeParse(normalizeIntakeBody(req.body));
  if (!parsed.success) {
    res
      .status(400)
      .json(validationError(parsed.error.issues.map((issue) => issue.message)));
    return;
  }

  const data = {
    ...parsed.data,
    phone: parsed.data.phone || undefined,
    companyWebsite: parsed.data.companyWebsite || undefined,
  };

  const requiredValues = [
    data.fullName,
    data.workEmail,
    data.titleRole,
    data.companyName,
    data.companyContext,
    data.primaryChallenge,
    data.desiredOutcome,
  ];
  if (requiredValues.some((value) => !value)) {
    res
      .status(400)
      .json(validationError(["Required fields cannot be blank or whitespace."]));
    return;
  }

  if (
    data.companyContext.length < 20 ||
    data.primaryChallenge.length < 20 ||
    data.desiredOutcome.length < 20
  ) {
    res
      .status(400)
      .json(
        validationError([
          "Company context, primary challenge, and desired outcome must each be at least 20 characters.",
        ]),
      );
    return;
  }

  if (data.companyWebsite) {
    try {
      const website = new URL(data.companyWebsite);
      if (!["http:", "https:"].includes(website.protocol)) {
        throw new Error("Unsupported website protocol");
      }
    } catch {
      res
        .status(400)
        .json(
          validationError([
            "Company website must be a complete http or https URL.",
          ]),
        );
      return;
    }
  }

  try {
    await db.insert(velocityOsIntakesTable).values(data);
    const response: SubmissionResult = {
      success: true,
      message:
        "Your request has been received. Our team will review it and follow up about a Velocity OS call or waitlist placement.",
    };
    res.status(201).json(response);
  } catch {
    const response: ErrorResponse = { error: "Internal server error" };
    res.status(500).json(response);
  }
});

export default router;