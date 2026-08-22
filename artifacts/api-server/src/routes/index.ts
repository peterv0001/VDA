import { Router, type IRouter } from "express";
import healthRouter from "./health";
import inquiriesRouter from "./inquiries";
import accessRequestsRouter from "./accessRequests";
import velocityOsIntakesRouter from "./velocityOsIntakes";
import adminSubmissionsRouter from "./adminSubmissions";
import velocityOsJournalRouter from "./velocityOsJournal";

const router: IRouter = Router();

router.use(healthRouter);
router.use(inquiriesRouter);
router.use(accessRequestsRouter);
router.use(velocityOsIntakesRouter);
router.use(adminSubmissionsRouter);
router.use(velocityOsJournalRouter);

export default router;
