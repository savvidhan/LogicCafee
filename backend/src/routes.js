import express from "express";

import authRoutes    from "./modules/auth/auth.routes.js";
import patternRoutes from "./modules/patterns/pattern.routes.js";
import problemRoutes from "./modules/problems/problem.routes.js";
import progressRoutes from "./modules/progress/progress.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import searchRoutes  from "./modules/search/search.routes.js";

import { protect } from "./middlewares/auth.middleware.js";

const router = express.Router();

/* ── Public ── */
router.use("/auth",     authRoutes);
router.use("/patterns", patternRoutes);
router.use("/problems", problemRoutes);
router.use("/search",   searchRoutes);

/* ── Protected ── */
router.use("/progress", protect, progressRoutes);
router.use("/profile",  profileRoutes);       // protect applied inside

export default router;
