import express from "express";
import {
  update,
  getMyProgress,
  getPatternProgress,
  getProblemNote,
  saveProblemNote,
} from "./progress.controller.js";

const router = express.Router();

/**
 * Progress Routes
 * Base path: /api/progress
 * (Already protected in routes.js)
 */
router.post("/", update);
router.get("/me", getMyProgress);

/**
 * Pattern-wise progress
 */
router.get("/patterns", getPatternProgress);

/**
 * 📝 Notes per problem
 */
router.get(
  "/problem/:problemId/note",
  getProblemNote
);
router.post(
  "/problem/:problemId/note",
  saveProblemNote
);

export default router;
