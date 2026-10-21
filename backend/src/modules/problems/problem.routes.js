import express from "express";
import { create, getByPattern, getOne } from "./problem.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { getStats } from "./problem.controller.js";

const router = express.Router();

/**
 * Problem Routes
 * - Create is protected
 * - Read routes are public
 */
router.post("/", protect, create);
router.get("/stats", getStats);
router.get("/pattern/:patternId", getByPattern);
router.get("/:id", getOne);

export default router;
