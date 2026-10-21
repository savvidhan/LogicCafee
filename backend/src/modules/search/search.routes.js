import express from "express";
import { globalSearch } from "./search.controller.js";
import { apiLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = express.Router();

/**
 * Search Routes
 * Base path: /api/search
 * Public — no auth required
 */
router.get("/", apiLimiter, globalSearch);

export default router;
