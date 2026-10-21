import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { getProfileSummary } from "./profile.controller.js";

const router = Router();

/**
 * GET /api/profile/summary
 * Protected route
 */
router.get("/summary", protect, getProfileSummary);

export default router;
