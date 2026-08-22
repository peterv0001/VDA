import { Router, type IRouter } from "express";
import healthRouter from "./health";
import inquiriesRouter from "./inquiries";
import accessRequestsRouter from "./accessRequests";
import velocityOsIntakesRouter from "./velocityOsIntakes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(inquiriesRouter);
router.use(accessRequestsRouter);
router.use(velocityOsIntakesRouter);

export default router;
