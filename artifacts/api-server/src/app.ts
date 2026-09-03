import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

function requireSameOriginAdminRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const origin = req.get("origin");
  const host = req.get("host");

  res.vary("Origin");

  if (!origin) {
    next();
    return;
  }

  try {
    if (host && new URL(origin).host === host) {
      next();
      return;
    }
  } catch {
    // Invalid origins are rejected below.
  }

  res.status(403).json({ error: "Cross-origin admin access is not allowed" });
}

app.use("/api/admin", requireSameOriginAdminRequest);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
